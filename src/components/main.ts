// main.ts
import { Template } from "./helper.js";
import { AppCalculations } from "./appCalculations.js";
import { Converters } from "./converters.js";
import { Generators } from "./generators.js";
import { Formatters } from "./formatters.js";
import { Ciphers } from "./ciphers.js";

interface stylings {
    [key: string]: string;
}

const STYLINGS: { [key: string]: stylings } = {
    welcome: {
        div: "d-flex flex-column align-items-center justify-content-center gap-2 px-4 py-4",
        imgPath: "/images/icons/robot.svg"
    },
    documentStyling: {
        main: "d-flex flex-column align-content-center justify-content-start",
        mainPlaceholder: "info-placeholder d-flex flex-column align-items-center justify-content-center gap-1"
    },
    ids: {
        dynamicContent: "dynamicContent"
    }
}

export class Main extends HTMLElement {
    private templateHelper: Template;
    private appCalculations: AppCalculations;
    private converters: Converters;
    private generators: Generators;
    private formatters: Formatters;
    private ciphers: Ciphers;

    constructor() {
        super();
        this.templateHelper = new Template();
        this.appCalculations = new AppCalculations();
        this.converters = new Converters();
        this.generators = new Generators();
        this.formatters = new Formatters();
        this.ciphers = new Ciphers();

        const template = this.templateHelper.createTemplate(this.renderContent());
        this.appendChild(template.content.cloneNode(true));
    }

    // Render the main placeholder to host the actual elements here
    public renderContent(): string {
        return `
        <main class="${STYLINGS.documentStyling.main}">
            <div class="${STYLINGS.documentStyling.mainPlaceholder}">
                <h1>Dev Toolguide</h1>
                <p>Your browser companion to accomplish many handy stuff!</p>
            </div>
            <div id="${STYLINGS.ids.dynamicContent}"></div>
        </main>
        `;
    }

    // Method to update the main content based on the selected component
    public updateContent(component: any): void {
        // Define the dynamicContent since all tools will be appended there
        const dynamicContent = document.getElementById("dynamicContent") as HTMLElement | null;
        const placeHolderContent = document.querySelector(".info-placeholder") as HTMLElement | null;

        if (dynamicContent) {
            switch (component) {
                case "calculation":
                    placeHolderContent?.remove();
                    dynamicContent.innerHTML = "";
                    dynamicContent.appendChild(this.appCalculations);
                    break;
                case "converters":
                    placeHolderContent?.remove();
                    dynamicContent.innerHTML = "";
                    dynamicContent.appendChild(this.converters);
                    break;
                case "generators":
                    placeHolderContent?.remove();
                    dynamicContent.innerHTML = "";
                    dynamicContent.appendChild(this.generators);
                    break;
                case "formatters":
                    placeHolderContent?.remove();
                    dynamicContent.innerHTML = "";
                    dynamicContent.appendChild(this.formatters);
                    break;
                case "ciphers":
                    placeHolderContent?.remove();
                    dynamicContent.innerHTML = "";
                    dynamicContent.appendChild(this.ciphers);
                    break;
                default:
                    dynamicContent.innerHTML = this.renderDefault();
                    break;
            }
        }
    }

    private renderDefault(): string {
        return `
            <div class="${STYLINGS.welcome.div}">
                <img class="welcome-message-logo" src="${STYLINGS.welcome.imgPath}">
                <h4>Section not available!</h4>
            </div>
        `;
    }
}

customElements.define("app-main", Main);
