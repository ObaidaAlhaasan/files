import * as pathUtil from 'path';
import { FileType } from "./file-system-item-type";

export abstract class FileSystemItem {

    public path: string;
    public name: string;
    public extension: string;
    public type!: FileType;
    public isDir: boolean = false;
    public size: number = 0;
    public dateModified!: Date;
    public dateCreated!: Date;
    public isSelected: boolean = false;
    public isHidden: boolean = false;
    public isSystem: boolean = false;

    constructor(path: string) {
        this.path = path;
        this.name = pathUtil.basename(path);
        this.extension = pathUtil.extname(path);
        if (!!this.extension)
            this.extension = this.extension.toLowerCase();
    }

    public setInfo(info: {
        size?: number,
        dateModified?: Date,
        dateCreated?: Date,
    }) {
        if (info.size || info.size == 0) this.size = info.size;
        if (info.dateModified) this.dateModified = info.dateModified;
        if (info.dateCreated) this.dateCreated = info.dateCreated;
    }
}