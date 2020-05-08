export const LeftFlag    = 0x01;
export const RightFlag   = 0x02;
export const TopFlag     = 0x10;
export const BottomFlag  = 0x20;

export const XFlags = 0x0F;
export const YFlags = 0xF0;

export default class Direction {

    /**
     * @param {Left|Right|Top|Bottom} value initial dir.
     */
    constructor(value) {
        this.value = value;
    }

    equal(dir) {
        return this.value === dir.value;
    }

    get isX() { return Boolean(this.value & XFlags); }
    get isY() { return Boolean(this.value & YFlags); }

    get isLeft() { return Boolean(this.value & LeftFlag); }
    get isRight() { return Boolean(this.value & RightFlag); }
    get isTop() { return Boolean(this.value & TopFlag); }
    get isBottom() { return Boolean(this.value & BottomFlag); }

    get char() {
        if (this.value === LeftFlag) return 'L';
        if (this.value === RightFlag) return 'R';
        if (this.value === TopFlag) return 'T';
        if (this.value === BottomFlag) return 'B';

        return '';
    }
}

export const Left = new Direction(LeftFlag);
export const Right = new Direction(RightFlag);
export const Top = new Direction(TopFlag);
export const Bottom = new Direction(BottomFlag);
