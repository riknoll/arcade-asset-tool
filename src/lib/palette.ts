import { toHex } from "./util";
import { ImageInfo } from "./image";

const supportedTypes = [".gpl", ".txt", ".hex"];

export function isPaletteFile(extension: string) {
    return supportedTypes.indexOf(extension.toLowerCase()) !== -1;
}

export function parsePaletteFile(text: string, extension: string): Palette | null {
    let res: Palette | null = null;

    switch (extension) {
        case ".gpl":
            res = parseGPL(text);
            break;
        case ".hex":
            res = parseHEX(text);
            break;
        case ".txt":
            res = parseTXT(text);
            break;
    }

    return res;
}

function parseGPL(text: string): Palette {
    const lines = text.split(/\n/);
    let name: string;
    const colors: string[] = ["#000000"];

    for (const line of lines) {
        if (line.indexOf("#Palette Name:") === 0) {
            name = line.substr(14).trim();
        }
        else if (startsWith(line, "GIMP") || startsWith(line, "#") || !line.trim()) {
            continue;
        }
        else {
            const color = line.split(/\s+/).filter(c => startsWith(c, "#"));
            if (color.length === 1) {
                colors.push(color[0].toLowerCase());
            }
        }
    }

    return {
        colors: colors.map(c => stringToColor(c)),
        isUserDefined: true
    }
}

function parseHEX(text: string): Palette {
    const lines = text.split(/\n/);
    const colors: string[] = ["#000000"];

    for (let line of lines) {
        if (/[A-Fa-f0-9]{6}/.test(line)) {
            colors.push("#" + line.toLowerCase());
        }
    }

    return {
        colors: colors.map(c => stringToColor(c)),
        isUserDefined: true
    }
}

function parseTXT(text: string): Palette {
    const lines = text.split(/\n/);
    let name: string;
    const colors: string[] = ["#000000"];

    for (let line of lines) {
        line = line.trim();
        if (startsWith(line, ";Palette Name:")) {
            name = line.substr(14);
        }
        else if (/[A-Fa-f0-9]{6}/.test(line)) {
            colors.push("#" + line.toLowerCase());
        }
        else if (/[A-Fa-f0-9]{8}/.test(line)) {
            // First two characters are alpha, just strip it out
            colors.push("#" + line.substr(2).toLowerCase());
        }
    }

    return {
        colors: colors.map(c => stringToColor(c)),
        isUserDefined: true
    }
}

export function encodePalette(colors: string[]) {
    const buf = new Uint8Array(colors.length * 3);
    for (let i = 0; i < colors.length; i++) {
        const color = parseColorString(colors[i]);
        const start = i * 3;
        buf[start] = _r(color);
        buf[start + 1] = _g(color);
        buf[start + 2] = _b(color);
    }
    return toHex(buf);
}

export function compareColors(a: PaletteColor, b: PaletteColor): number {
    if (a === b) return 0;
    if (a.isTransparent) {
        if (b.isTransparent) {
            return 0;
        }
        return -1;
    }
    else if (b.isTransparent) {
        return 1;
    }

    if (a.r !== b.r) return a.r - b.r;
    else if (a.g !== b.g) return a.g - b.g;
    else return a.b - b.b;
}

export function colorEquals(a: PaletteColor, b: PaletteColor) {
    return compareColors(a, b) === 0;
}

export function getUsedColors(image: ImageInfo): PaletteColor[] {
    const res: PaletteColor[] = [
        { isTransparent: true, r: 0, g: 0, b: 0 }
    ];

    let current: PaletteColor = { r: 0, g: 0, b: 0 };

    for (let index = 0; index < image.data.length; index += 4) {
        // Transparency
        if (image.data[index + 3] < 100) continue;

        current.r = image.data[index];
        current.g = image.data[index + 1];
        current.b = image.data[index + 2];
        
        if (!res.some(color => colorEquals(color, current))) {
            res.push(current);
            current = { r: 0, g: 0, b: 0 };
        }
    }

    res.sort(compareColors);

    return res;
}

export function stringToColor(color: string): PaletteColor {
    const rgb = parseColorString(color);

    return {
        r: _r(rgb),
        g: _g(rgb),
        b: _b(rgb)
    }
}

export function colorToString(color: PaletteColor): string {
    return "#" + toHex([color.r, color.g, color.b]).substr(2);
}

function parseColorString(color: string) {
    if (color) {
        if (color.length === 6) {
            return parseInt("0x" + color);
        }
        else if (color.length === 7) {
            return parseInt("0x" + color.substr(1));
        }
    }
    return 0;
}

function _r(color: number) { return (color >> 16) & 0xff }
function _g(color: number) { return (color >> 8) & 0xff }
function _b(color: number) { return color & 0xff }

function startsWith(str: string, prefix: string) { return str.indexOf(prefix) === 0 }
