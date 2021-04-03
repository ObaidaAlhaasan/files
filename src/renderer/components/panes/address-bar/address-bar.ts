import { bindable, EventAggregator, watch } from "aurelia";
import { Settings, system } from "../../../core";
import { Pane } from "../pane";

export class AddressBar {

    @bindable public pane!: Pane;
    public editAddress = false;
    public addressBarPath?: string;
    public addressInput!: HTMLInputElement;
    private detaches: Array<() => void> = [];

    constructor(public settings: Settings, private eventBus: EventAggregator) {
    }

    public attached() {
        this.addressBarPath = this.pane.tabs.active.path;

        let sub = this.eventBus.subscribe("kb-address-edit", (msg: any) => {
            if (this.pane.id == msg.id)
                this.enableEditAddress();
        });
        this.detaches.push(() => sub.dispose());

        let f = (ev: KeyboardEvent) => this.addressBarPathEdited(ev);
        this.addressInput.addEventListener("keydown", f);
        this.detaches.push(() => this.addressInput.removeEventListener("keydown", f));
    }

    public detached() {
        this.detaches.forEach(f => f());
    }

    public enableEditAddress() {
        this.editAddress = true;
        setTimeout(() => {
            this.addressInput.focus();
            this.addressInput.select();
        }, 10);
    }

    @watch((vm: AddressBar) => vm.pane.tabs.active.path)
    public activeTabPathChanged() {
        this.addressBarPath = this.pane.tabs.active.path;
    }

    public async addressBarPathEdited(ev: KeyboardEvent) {
        // If pressed key is not ENTER or ESC keys, don't handle event
        if (ev.which != 13 && ev.which != 27)
            return;

        if (ev.which == 13) { // Enter key
            if (this.addressBarPath) {
                this.addressBarPath = this.addressBarPath.trim();

                if (this.addressBarPath.startsWith("~"))
                    this.addressBarPath = this.addressBarPath.replace("~", system.os.homedir());
                else if (this.addressBarPath.startsWith("/"))
                    this.addressBarPath = this.addressBarPath.replace("/", system.path.parse(process.cwd()).root);

                if (!system.fss.existsSync(this.addressBarPath)) {
                    alert("Invalid path: " + this.addressBarPath);
                }
                else {
                    let stat = await system.fs.stat(this.addressBarPath);
                    if (stat.isDirectory()) {
                        this.pane.tabs.active.setPath(this.addressBarPath);
                    }
                    else {
                        system.shell.openExternal(this.addressBarPath);
                    }
                }
            }
        }

        this.addressBarPath = this.pane.tabs.active.path;
        this.editAddress = false;
    }

    public async addressPartSelected(selectedPartIndex: number) {
        let activeTab = this.pane.tabs.active;
        if (activeTab.pathParts.length - 1 == selectedPartIndex)
            return;

        let newPath = system.path.join(...activeTab.pathParts.slice(0, selectedPartIndex + 1));
        activeTab.setPath(newPath);
    }
}