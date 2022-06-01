export default class ThemeStorage {
  constructor() {
    this.isDarkMode = localStorage.getItem("dark-theme");
    localStorage.setItem("dark-theme", this.isDarkMode);
  }

  getMode() {
    return this.isDarkMode
  }

  setMode(isEnabled) {
    this.isDarkMode = isEnabled;
    localStorage.setItem("dark-theme", this.isDarkMode)
  }

}
