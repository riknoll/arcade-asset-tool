import { Reducer } from "redux";
import { Action, ActionType } from "./actions";
import { stringToColor } from "../lib/palette";
import { merge } from "../lib/util";

const topReducer: Reducer<AssetToolStore, Action> = (state, action) => {
    if (!state) state = initStore();

    switch (action.type) {
        case ActionType.CreateProject:
            return {
                ...state,
                project: initProject()
            };
    }

    return {
        ...state,
        project: projectReducer(state.project, action)
    };
}

const projectReducer: Reducer<Project, Action> = (project, action) => {
    project = project as Project;

    switch (action.type) {
        case ActionType.CreateAsset:
            return {
                ...project,
                nextId: project.nextId + 1,
                assets: [
                    ...project.assets,
                    createAsset(project.nextId, action.image, action.name)
                ]
            };
        case ActionType.SetProjectNamespace:
            return {
                ...project,
                assetNamespace: project.assetNamespace
            };
        case ActionType.SetProjectPalette:
            return {
                ...project,
                palette: action.palette
            };
        case ActionType.UpdateAsset:
            return {
                ...project,
                assets: project.assets.map(a => a.id !== action.id ? a : {
                    ...a,
                    props: merge(a.props, action.props)
                })
            };
    }

    return { ...project }
}

function createAsset(id: number, image: ImageInfo, name = "untitled"): Asset {
    return {
        id,
        src: image,
        props: {
            name
        }
    };
}

function initStore(): AssetToolStore {
    return {
        project: initProject()
    };
}

function initProject(): Project {
    return {
        nextId: 0,
        assetNamespace: "assets",
        assets: [],
        palette: {
            isUserDefined: false,
            colors: [
                "#000000",
                "#ffffff",
                "#ff2121",
                "#ff93c4",
                "#ff8135",
                "#fff609",
                "#249ca3",
                "#78dc52",
                "#003fad",
                "#87f2ff",
                "#8e2ec4",
                "#a4839f",
                "#5c406c",
                "#e5cdc4",
                "#91463d",
                "#000000",
            ].map((c, i) => {
                const color = stringToColor(c);
                color.isTransparent = i === 0;
                return color;
            })
        }
    };
}


export const reducer = topReducer;