import ThemeStorage from "./data/theme-storage.js"
import Theme from "./theme.js";

export class ThemeService {
  constructor(storage) {
    this.storage = storage || new ThemeStorage();
    this.theme = null;
  }

  loadData() {
    this.theme = new Theme(this.storage.getMode());
  }

  save() {
    this.storage.setMode(this.theme);
  }

  enableDarkMode() {
    this.theme = "enabled";
    this.save();
  }

  disableDarkMode() {
    this.theme = "disabled";
    this.save();
  }

  toggleDarkMode() {
    const isDarkMode = this.theme;
    if (isDarkMode === "disabled") {
      this.enableDarkMode()
    } else {
      this.disableDarkMode()
    }
  }

  getMode() {
    return this.theme.getMode();
  }

}

export const themeService = new ThemeService();
