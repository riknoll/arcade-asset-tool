import { fileReadAsDataUriAsync, fileReadAsTextAsync } from "./util";
import { readImageAsync, ImageInfo } from "./image";
import { parsePaletteFile } from "./palette";

export function attachDragAndDropEvents(target: HTMLElement, onFilesReceived: (files: File[]) => void) {
    target.addEventListener('paste', function (e: ClipboardEvent) {
        if (e.clipboardData) {
            // has file?
            let files: File[] = [];
            for (let i = 0; i < e.clipboardData.files.length; i++) {
                files.push(e.clipboardData.files.item(i) as File);
            }
            if (files.length > 0) {
                e.stopPropagation(); // Stops some browsers from redirecting.
                e.preventDefault();
                onFilesReceived(files);
            }
            // has item?
            else if (e.clipboardData.items && e.clipboardData.items.length > 0) {
                let f = e.clipboardData.items[0].getAsFile()
                if (f) {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                    e.preventDefault();
                    onFilesReceived([f])
                }
            }
        }
    })
    target.addEventListener('dragover', function (e: DragEvent) {
        if (!e.dataTransfer) return;
        let types = e.dataTransfer.types;
        let found = false;
        for (let i = 0; i < types.length; ++i)
            if (types[i] == "Files")
                found = true;
        if (found) {
            if (e.preventDefault) e.preventDefault(); // Necessary. Allows us to drop.
            e.dataTransfer.dropEffect = 'copy';  // See the section on the DataTransfer object.
            return false;
        }
        return true;
    }, false);
    target.addEventListener('drop', function (e: DragEvent) {
        if (!e.dataTransfer || !e.dataTransfer.files) return;
        const files: File[] = [];
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            files.push(e.dataTransfer.files.item(i) as File);
        }
        if (files.length > 0) {
            e.stopPropagation(); // Stops some browsers from redirecting.
            e.preventDefault();
            onFilesReceived(files);
        }
        return false;
    }, false);
    target.addEventListener('dragend', function (e: DragEvent) {
        return false;
    }, false);
}

export async function importImageFileAsync(file: File): Promise<ImageInfo | null> {
    const data = await fileReadAsDataUriAsync(file);

    if (!data) return null;

    return readImageAsync(data);
}

export async function importPaletteFileAsync(file: File): Promise<Palette | null> {
    const data = await fileReadAsTextAsync(file);

    if (!data) return null;

    return parsePaletteFile(data, getExtension(file.name));
}


function getExtension(name: string) {
    return name.substr(name.lastIndexOf("."));
}