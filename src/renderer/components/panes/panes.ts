import { singleton } from "aurelia";
import { FileService } from "../../core";
import { Pane } from "./pane";

@singleton()
export class Panes {
    public list: Pane[] = [];
    public active!: Pane;

    constructor(private fileService: FileService) {
        this.setActive(this.add());
    }

    public add(): Pane {
        let pane = new Pane(this, this.fileService);
        this.list.push(pane);
        return pane;
    }

    public remove(pane: Pane) {
        if (this.list.length == 1)
            return;

        let ix = this.list.indexOf(pane);

        let newActive: Pane;
        if (this.list.length > 1) {
            newActive = ix == 0 ? this.list[1] : this.list[ix - 1];
            this.setActive(newActive);
        }

        this.list.splice(ix, 1);
    }

    public setActive(pane: Pane) {
        if (this.active == pane)
            return;

        if (this.active)
            this.active.isActive = false;

        pane.isActive = true;
        this.active = pane;
    }
}