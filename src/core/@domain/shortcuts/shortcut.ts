import { IEventAggregator } from "aurelia";
import { ShortcutManager } from "./shortcut-manager";
import { KeyCode } from "common";

/**
 * A shortcut that executes an action.
 */
export class Shortcut {
  public ctrlKey = false;
  public altKey = false;
  public shiftKey = false;
  public metaKey = false;
  public key?: KeyCode;
  public keyExpression?: (keyCode: KeyCode) => boolean;
  public action: (event: KeyboardEvent, eventBus: IEventAggregator) => void;

  constructor(public name: string) {
    this.action = () => null;
  }

  public get isConfigurable() {
    return !!this.name;
  }

  public withKey(key: KeyCode): Shortcut {
    this.key = key;
    return this;
  }

  public withKeyExpression(expression: (keyCode: KeyCode) => boolean): Shortcut {
    this.keyExpression = expression;
    return this;
  }

  public hasAction(action: (event: KeyboardEvent, eventBus: IEventAggregator) => void): Shortcut {
    this.action = action;
    return this;
  }

  public withCtrlKey(mustBePressed = true): Shortcut {
    this.ctrlKey = mustBePressed;
    return this;
  }

  public withAltKey(mustBePressed = true): Shortcut {
    this.altKey = mustBePressed;
    return this;
  }

  public withShiftKey(mustBePressed = true): Shortcut {
    this.shiftKey = mustBePressed;
    return this;
  }

  public withMetaKey(mustBePressed = true): Shortcut {
    this.metaKey = mustBePressed;
    return this;
  }

  public register(): Shortcut {
    ShortcutManager.registerShortcut(this);
    return this;
  }

  /**
   * Determines if this shortcut matches the specified key combination.
   * @param key Key code.
   * @param ctrl Whether the ctrl key is pressed.
   * @param alt Whether the alt key is pressed.
   * @param shift Whether the shift key is pressed.
   * @param meta Whether the meta key is pressed.
   */
  public matches(
    key: KeyCode | undefined,
    ctrl: boolean,
    alt: boolean,
    shift: boolean,
    meta: boolean
  ): boolean;

  /**
   * Determines if this shortcut matches they key combination in the specified keyboard event.
   * @param event The keyboard event.
   */
  public matches(event: KeyboardEvent): boolean;

  /**
   * Determines if this shortcut has the same key combination as the specified shortcut.
   * @param shortcut The shortcut to compare with.
   */
  public matches(shortcut: Shortcut): boolean;

  public matches(
    keyOrEventOrShortcut: KeyCode | undefined | KeyboardEvent | Shortcut,
    ctrl?: boolean,
    alt?: boolean,
    shift?: boolean,
    meta?: boolean
  ): boolean {
    let key: KeyCode | undefined;

    if (keyOrEventOrShortcut instanceof KeyboardEvent) {
      key = keyOrEventOrShortcut.code as KeyCode;
      ctrl = keyOrEventOrShortcut.ctrlKey;
      alt = keyOrEventOrShortcut.altKey;
      shift = keyOrEventOrShortcut.shiftKey;
      meta = keyOrEventOrShortcut.metaKey;
    } else if (keyOrEventOrShortcut instanceof Shortcut) {
      return (
        this.key === keyOrEventOrShortcut.key &&
        this.keyExpression?.toString() === keyOrEventOrShortcut.keyExpression?.toString() &&
        this.ctrlKey === keyOrEventOrShortcut.ctrlKey &&
        this.altKey === keyOrEventOrShortcut.altKey &&
        this.shiftKey === keyOrEventOrShortcut.shiftKey &&
        this.metaKey === keyOrEventOrShortcut.metaKey
      );
    }

    return this.matchesKeyCombo(key, ctrl ?? false, alt ?? false, shift ?? false, meta ?? false);
  }

  public matchesKeyCombo(
    key: KeyCode | undefined | null,
    ctrl: boolean,
    alt: boolean,
    shift: boolean,
    meta: boolean
  ): boolean {
    if (!key) return false;

    if (this.key) {
      return (
        this.key === key &&
        this.ctrlKey === ctrl &&
        this.altKey === alt &&
        this.shiftKey === shift &&
        this.metaKey === meta
      );
    } else if (this.keyExpression) {
      return this.keyExpression(key);
    } else return false;
  }
}
