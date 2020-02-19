export function fileReadAsBufferAsync(f: File): Promise<Uint8Array | null> {
    if (!f)
        return Promise.resolve(null);
    else {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onerror = (ev) => resolve(null);
            reader.onload = (ev) => resolve(new Uint8Array(reader.result as ArrayBuffer));
            reader.readAsArrayBuffer(f);
        });
    }
}

export function fileReadAsTextAsync(f: File): Promise<string | null> {
    if (!f)
        return Promise.resolve(null);
    else {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onerror = (ev) => resolve(null);
            reader.onload = (ev) => resolve(reader.result as string);
            reader.readAsText(f);
        });
    }
}

export function fileReadAsDataUriAsync(f: File): Promise<string | null> {
    if (!f)
        return Promise.resolve(null);
    else {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onerror = (ev) => resolve(null);
            reader.onload = (ev) => resolve(reader.result as string);
            reader.readAsDataURL(f);
        });
    }
}

export function uint8ArrayToBase64(input: ArrayLike<number>) {
    return btoa(uint8ArrayToString(input));
}

export function uint8ArrayToString(input: ArrayLike<number>) {
    let len = input.length;
    let res = ""
    for (let i = 0; i < len; ++i)
        res += String.fromCharCode(input[i]);
    return res;
}

// this will take lower 8 bits from each character
export function stringToUint8Array(input: string) {
    let len = input.length;
    let res = new Uint8Array(len)
    for (let i = 0; i < len; ++i)
        res[i] = input.charCodeAt(i) & 0xff;
    return res;
}

export function toHex(bytes: ArrayLike<number>) {
    let r = ""
    for (let i = 0; i < bytes.length; ++i)
        r += ("0" + bytes[i].toString(16)).slice(-2)
    return r
}

export function merge<U>(base: U, change: Partial<U>): U {
    const res = { ...base };

    for (const key in Object.keys(change)) {
        (res as any)[key] = (change as any)[key]
    }

    return res;
}