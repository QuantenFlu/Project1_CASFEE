
export class ViewService {
  constructor() {
    this.darkMode = localStorage.getItem("dark-theme");
    if(this.darkMode === "enabled") {
      document.body.classList.add("dark-theme")
    }
  }

  enableDarkMode() {
    document.body.classList.add("dark-theme");
    localStorage.setItem("dark-theme", "enabled");
  };

  disableDarkMode() {
    document.body.classList.remove("dark-theme");
    localStorage.setItem("dark-theme", "disabled");
  };

  changeTheme() {
    this.mode = localStorage.getItem("dark-theme");
    if (this.mode === "enabled") {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }

  }
}

export const viewService = new ViewService();
