interface AssetToolStore {
    project: Project;
}

interface Project {
    assetNamespace: string;
    palette: Palette;
    
    assets: Asset[];
    nextId: number;
}

interface Palette {
    isUserDefined: boolean;
    colors: PaletteColor[];
}

interface PaletteColor {
    r: number;
    b: number;
    g: number;
    isTransparent?: boolean;
}

interface ImageInfo {
    width: number;
    height: number;
    uri: string;
    data: Uint8ClampedArray;
}

interface Asset {
    id: number;

    src: ImageInfo;
    props: AssetProperties;
}

interface AssetProperties {
    name: string;
    width?: number;
    height?: number;
    tags?: string[];
    isTileset?: boolean;
}