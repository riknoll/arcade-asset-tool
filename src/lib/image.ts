import { Bitmap } from "./bitmap";

export interface ImageInfo {
    width: number;
    height: number;
    uri: string;
    data: Uint8ClampedArray;
}

const supportedTypes = [".png"]

export function isImageFile(extension: string) {
    return supportedTypes.indexOf(extension.toLowerCase()) >= 0;
}

export async function readImageAsync(src: string): Promise<ImageInfo | null> {
    const loaded = await loadImageAsync(src);
    const canvas = document.createElement("canvas");
    canvas.width = loaded.width;
    canvas.height = loaded.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(loaded, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return {
        width: data.width,
        height: data.height,
        uri: canvas.toDataURL(),
        data: data.data
    };
}

async function loadImageAsync(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(resolve => {
        const el = document.createElement("img");
        
        el.src = src;
        el.onload = () => {
            resolve(el)
        };
    })
}

export function f4EncodeImage(width: number, height: number, data: Uint8ClampedArray, colors: PaletteColor[]): string {
    return f4EncodeImg(width, height, 4, (x, y) => {
        const index = y * width + x;
        return closestColor(data, index << 2, colors);
    });
}

export function imgEncodeImage(width: number, height: number, data: Uint8ClampedArray, colors: PaletteColor[]): string {
    return imgEncodeImg(width, height, (x, y) => {
        const index = y * width + x;
        return closestColor(data, index << 2, colors);
    });
}

export function convertToBitmap(width: number, height: number, data: Uint8ClampedArray, colors: PaletteColor[]): Bitmap {
    const res = new Bitmap(width, height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            res.set(x, y, closestColor(data, (y * width + x) << 2, colors))
        }
    }

    return res;
}

// use geometric distance on colors
function scale(v: number) {
    return v * v
}

function closestColor(buf: Uint8ClampedArray, pix: number, palette: PaletteColor[], alpha = true) {
    if (alpha && buf[pix + 3] < 100)
        return 0 // transparent
    let mindelta = 0
    let idx = -1
    for (let i = alpha ? 1 : 0; i < palette.length; ++i) {
        let delta = scale(palette[i].r - buf[pix + 0]) + scale(palette[i].g - buf[pix + 1]) + scale(palette[i].b - buf[pix + 2])
        if (idx < 0 || delta < mindelta) {
            idx = i
            mindelta = delta
        }
    }
    return idx
}

function f4EncodeImg(w: number, h: number, bpp: number, getPix: (x: number, y: number) => number) {
    let r = hex2(0xe0 | bpp) + hex2(w) + hex2(h) + "00"
    let ptr = 4
    let curr = 0
    let shift = 0

    let pushBits = (n: number) => {
        curr |= n << shift
        if (shift == 8 - bpp) {
            r += hex2(curr)
            ptr++
            curr = 0
            shift = 0
        } else {
            shift += bpp
        }
    }

    for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j)
            pushBits(getPix(i, j))
        while (shift != 0)
            pushBits(0)
        if (bpp > 1) {
            while (ptr & 3)
                pushBits(0)
        }
    }

    return r

    function hex2(n: number) {
        return ("0" + n.toString(16)).slice(-2)
    }
}

export function imgEncodeImg(w: number, h: number, getPix: (x: number, y: number) => number) {
    let res = "img`\n    "
    for (let r = 0; r < h; r++) {
        let row: number[] = []
        for (let c = 0; c < w; c++) {
            row.push(getPix(c, r));
        }
        res += row.map(n => n.toString(16)).join(" ");
        res += "\n    "
    }
    res += "`";
    return res;
}