import {
    ActionType,
    CreateAssetAction,
    CreateProjectAction,
    SetProjectPaletteAction,
    SetProjectNamespaceAction,
    UpdateAssetAction
} from "./actions";

export const dispatchCreateProject = () => ({
    type: ActionType.CreateProject
} as CreateProjectAction);

export const dispatchCreateAsset = (image: ImageInfo, name?: string) => ({
    type: ActionType.CreateAsset,
    image,
    name
} as CreateAssetAction);

export const dispatchSetProjectPalette = (palette: Palette) => ({
    type: ActionType.SetProjectPalette,
    palette
} as SetProjectPaletteAction);

export const dispatchSetProjectNamespace = (assetNamespace: string) => ({
    type: ActionType.SetProjectNamespace,
    assetNamespace
} as SetProjectNamespaceAction);

export const dispatchUpdateAsset = (id: number, props: Partial<AssetProperties>) => ({
    type: ActionType.UpdateAsset,
    id,
    props
} as UpdateAssetAction);