class Header extends HTMLElement {
    private stylings: {
        header: string,
        headerTitle: string,
        switchButtons: string
    };

    private btns: {
        btnPrimary: string
    };

    private texts: {
        h1: string
    }

    private svgIcons: {
        light: string,
        dark: string
    }

    constructor() {
        super();
        this.stylings = {
            header: "col-12 d-flex fs-4",
            headerTitle: "w-100 py-2 px-2 my-1 mx-1 d-flex flex-row align-content-center align-items-center justify-content-between bg-primary rounded-3",
            switchButtons: "d-flex flex-row gap-2"
        };

        this.btns = {
            btnPrimary: "d-flex flex-row align-items-end justify-content-center gap-2 btn btn-primary rounded-pill fs-5 transition-all"
        }

        this.texts = {
            h1: "header-title mb-0 text-light fs-2"
        }

        this.svgIcons = {
            light: "/images/icons/light.svg",
            dark: "/images/icons/dark.svg"
        }

        this.attachShadow({ mode: "open" });
        this.shadowRoot?.appendChild(this.createTemplate().content.cloneNode(true));

        // Initialize theme toggler
        this.initThemeToggler();
    }

    private createTemplate(): HTMLTemplateElement {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                @import url(/src/lib/css/fastbootstrap.css);
                @import url(/assets/css/custom.css);
            </style>
            <header class="${this.stylings.header}">
                <section class="${this.stylings.headerTitle}">
                    <div>
                        ${this.renderHeaderUpperContent()}
                    </div>
                    <div>
                        ${this.renderLightDarkModeSwitch()}
                    </div>
                </section>
            </header>
        `;
        return template;
    }

    renderHeaderUpperContent(): string {
        return `
            <h1 class="${this.texts.h1}">Dev Toolguide</h1>
        `;
    }

    renderLightDarkModeSwitch(): string {
        return `
            <div id="bd-theme" aria-label="Theme switcher" class="${this.stylings.switchButtons}">
                <button data-bs-theme-value="light" class="${this.btns.btnPrimary}"><span>Light</span></button>
                <button data-bs-theme-value="dark" class="${this.btns.btnPrimary}"><span>Dark</span></button>
            </div>
        `;
    }

    private initThemeToggler() {
        const getStoredTheme = (): string | null => localStorage.getItem("theme");
        const setStoredTheme = (theme: string) => localStorage.setItem("theme", theme);

        const getPreferredTheme = (): string => {
            const storedTheme = getStoredTheme();
            if (storedTheme) {
                return storedTheme;
            }
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        };

        const setTheme = (theme: string) => {
            if (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.setAttribute("data-bs-theme", "dark");
            } else {
                document.documentElement.setAttribute("data-bs-theme", theme);
            }
        };

        setTheme(getPreferredTheme());

        const showActiveTheme = (theme: string, focus: boolean = false) => {
            const themeSwitcher = this.shadowRoot?.querySelector("#bd-theme") as HTMLElement;
            if (!themeSwitcher) {
                return;
            }

            const btnToActive = this.shadowRoot?.querySelector(`[data-bs-theme-value="${theme}"]`) as HTMLElement;

            this.shadowRoot?.querySelectorAll("[data-bs-theme-value]").forEach(element => {
                element.classList.remove("active");
                element.setAttribute("aria-pressed", "false");
                // Remove any existing image to prevent duplication
                const img = element.querySelector("img");
                if (img) {
                    img.remove();
                }
            });

            btnToActive.classList.add("active");
            btnToActive.setAttribute("aria-pressed", "true");

            // Create and insert the corresponding SVG icon as an <img> element
            const img = document.createElement("img");

            img.src = theme === "light" ? this.svgIcons.light : this.svgIcons.dark;
            img.alt = theme === "light" ? "Light Theme Icon" : "Dark Theme Icon";
            img.style.width = "24px";
            img.style.height = "24px";
            img.setAttribute("class", "text-light");

            btnToActive.insertAdjacentElement("afterbegin", img);

            if (focus) {
                themeSwitcher.focus();
            }
        };

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
            const storedTheme = getStoredTheme();
            if (storedTheme !== "light" && storedTheme !== "dark") {
                setTheme(getPreferredTheme());
            }
        });

        window.addEventListener("DOMContentLoaded", () => {
            showActiveTheme(getPreferredTheme());

            this.shadowRoot?.querySelectorAll("[data-bs-theme-value]").forEach(toggle => {
                toggle.addEventListener("click", () => {
                    const theme = toggle.getAttribute("data-bs-theme-value") as string;
                    setStoredTheme(theme);
                    setTheme(theme);
                    showActiveTheme(theme, true);
                });
            });
        });
    }

    connectedCallBack() {

    }
}

customElements.define("app-header", Header);