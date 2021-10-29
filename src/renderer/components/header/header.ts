import { observable, watch } from "@aurelia/runtime-html";
import { IEventAggregator } from "aurelia";
import { WindowManager } from "../window-manager";
import { Settings } from "core";
import { ViewCommandSearchEvent, ViewCommandToggleHeader } from "common";

export class Header {
  @observable public searchTerm?: string;
  public isMinimized = false;

  private searchInput!: HTMLInputElement;
  private detaches: Array<() => void> = [];

  constructor(
    private readonly settings: Settings,
    private readonly windowManager: WindowManager,
    @IEventAggregator private readonly eventBus: IEventAggregator
  ) {
    this.windowManager.setHeader(this);
  }

  public get activeTab() {
    return this.windowManager.panes.active.tabs.active;
  }

  public attached() {
    const sub = this.eventBus.subscribe(ViewCommandSearchEvent, () => {
      this.searchInput.focus();
      this.searchInput.select();
    });
    this.detaches.push(() => sub.dispose());
    this.eventBus.subscribe(ViewCommandToggleHeader, () => (this.isMinimized = !this.isMinimized));
  }

  public detached() {
    this.detaches.forEach((f) => f());
  }

  @watch<Header>((vm) => vm.activeTab.path)
  private pathChanged() {
    this.searchTerm = undefined;
  }

  private searchTermChanged() {
    this.activeTab.fsItems.search(this.searchTerm);
  }
}
