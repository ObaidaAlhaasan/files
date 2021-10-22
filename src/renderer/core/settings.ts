import { IEventAggregator, singleton } from "aurelia";
import { SettingsChangedEvent } from "./events/settings-changed-event";

@singleton
export class Settings {
  public theme!: string;
  public inverted!: string;
  public showHiddenFiles!: boolean;
  public fileViewType: FileViewTypes = FileViewTypes.Icons;
  public confirmOnMove!: boolean;
  public windowControlsPosition: "left" | "right" = "right";

  constructor(@IEventAggregator private readonly eventBus: IEventAggregator) {}

  public setTheme(theme: string) {
    document.body.classList.remove(this.theme);
    document.body.classList.add(theme);
    this.theme = theme;
    this.inverted = theme == "dark" ? "inverted" : "";
    this.publishSettingsChangedEvent();
  }

  public toggleTheme() {
    this.setTheme(this.theme === "dark" ? "light" : "dark");
  }

  public setShowHiddenFiles(show: boolean) {
    this.showHiddenFiles = show;
    this.publishSettingsChangedEvent();
  }

  public toggleShowHiddenFiles() {
    this.setShowHiddenFiles(!this.showHiddenFiles);
  }

  public setFileViewType(fileViewType: FileViewTypes) {
    if (this.fileViewType == fileViewType) return;
    this.fileViewType = fileViewType;
    this.publishSettingsChangedEvent();
  }

  public toggleFileViewType() {
    this.setFileViewType(
      this.fileViewType == FileViewTypes.Icons ? FileViewTypes.Details : FileViewTypes.Icons
    );
  }

  public setConfirmOnMove(confirm: boolean) {
    this.confirmOnMove = confirm;
    this.publishSettingsChangedEvent();
  }

  public setWindowControlsPosition(position: "left" | "right") {
    this.windowControlsPosition = position;
    this.publishSettingsChangedEvent();
  }

  private publishSettingsChangedEvent() {
    this.eventBus.publish(new SettingsChangedEvent(this));
  }
}

export enum FileViewTypes {
  Icons = "Icons",
  Details = "Details",
}
