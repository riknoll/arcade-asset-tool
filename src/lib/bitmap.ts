export class Bitmap {
    protected buf: Uint8ClampedArray;

    constructor(public width: number, public height: number, public x0 = 0, public y0 = 0, buf?: Uint8ClampedArray) {
        this.buf = buf || new Uint8ClampedArray(this.dataLength());
    }

    set(col: number, row: number, value: number) {
        if (col < this.width && row < this.height && col >= 0 && row >= 0) {
            const index = this.coordToIndex(col, row);
            this.setCore(index, value);
        }
    }

    get(col: number, row: number) {
        if (col < this.width && row < this.height && col >= 0 && row >= 0) {
            const index = this.coordToIndex(col, row);
            return this.getCore(index);
        }
        return 0;
    }

    copy(col = 0, row = 0, width = this.width, height = this.height): Bitmap {
        const sub = new Bitmap(width, height);
        sub.x0 = col;
        sub.y0 = row;
        for (let c = 0; c < width; c++) {
            for (let r = 0; r < height; r++) {
                sub.set(c, r, this.get(col + c, row + r));
            }
        }
        return sub;
    }

    apply(change: Bitmap, transparent = false) {
        let current: number;
        for (let c = 0; c < change.width; c++) {
            for (let r = 0; r < change.height; r++) {
                current = change.get(c, r);

                if (!current && transparent) continue;
                this.set(change.x0 + c, change.y0 + r, current);
            }
        }
    }

    equals(other: Bitmap) {
        if (this.width === other.width && this.height === other.height && this.x0 === other.x0 && this.y0 === other.y0 && this.buf.length === other.buf.length) {
            for (let i = 0; i < this.buf.length; i++) {
                if (this.buf[i] !== other.buf[i]) return false;
            }
            return true;
        }

        return false;
    }

    protected coordToIndex(col: number, row: number) {
        return col + row * this.width;
    }

    protected getCore(index: number) {
        const cell = Math.floor(index / 2);
        if (index % 2 === 0) {
            return this.buf[cell] & 0xf;
        }
        else {
            return (this.buf[cell] & 0xf0) >> 4;
        }
    }

    protected setCore(index: number, value: number) {
        const cell = Math.floor(index / 2);
        if (index % 2 === 0) {
            this.buf[cell] = (this.buf[cell] & 0xf0) | (value & 0xf);
        }
        else {
            this.buf[cell] = (this.buf[cell] & 0x0f) | ((value & 0xf) << 4);
        }
    }

    protected dataLength() {
        return Math.ceil(this.width * this.height / 2);
    }
}
