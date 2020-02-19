export enum ActionType {
    CreateProject = "CreateProject",
    CreateAsset = "CreateAsset",
    SetProjectPalette = "SetProjectPalette",
    SetProjectNamespace = "SetProjectNamespace",
    UpdateAsset = "UpdateAsset",
}

export type Action = 
    CreateProjectAction |
    CreateAssetAction |
    SetProjectPaletteAction | 
    SetProjectNamespaceAction |
    UpdateAssetAction;
    

export interface CreateProjectAction {
    type: ActionType.CreateProject;
}

export interface CreateAssetAction {
    type: ActionType.CreateAsset;
    image: ImageInfo;
    name?: string;
}

export interface SetProjectPaletteAction {
    type: ActionType.SetProjectPalette;
    palette: Palette;
}

export interface SetProjectNamespaceAction {
    type: ActionType.SetProjectNamespace;
    assetNamespace: string;
}

export interface UpdateAssetAction {
    type: ActionType.UpdateAsset;
    id: number;
    props: AssetProperties;
}