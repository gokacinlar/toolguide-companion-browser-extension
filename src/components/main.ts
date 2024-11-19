// main.ts
import { Template, STYLINGS } from "./helper.js";
import Converters from "./converters.js";
import Generators from "./generators.js";
import AppCalculations from "./appCalculations.js";
import Formatters from "./formatters.js";
import Ciphers from "./ciphers.js";
import WebDev from "./webdev.js";

export class Main extends HTMLElement {
    private templateHelper: Template;
    private appCalculations: AppCalculations;
    private converters: Converters;
    private generators: Generators;
    private formatters: Formatters;
    private ciphers: Ciphers;
    private webdev: WebDev;

    constructor() {
        super();
        this.templateHelper = new Template();
        this.appCalculations = new AppCalculations();
        this.converters = new Converters();
        this.generators = new Generators();
        this.formatters = new Formatters();
        this.ciphers = new Ciphers();
        this.webdev = new WebDev();

        const template = this.templateHelper.createTemplate(this.renderContent());
        this.appendChild(template.content.cloneNode(true));
    }

    // Render the main placeholder to host the actual elements here
    public renderContent(): string {
        return `
        <main class="${STYLINGS.documentStyling.main}">
            <div class="${STYLINGS.documentStyling.mainPlaceholder}">
                <img class="img-fluid intro-icon" src="/images/logo/final-icon-without-text.png" alt="App Icon Logo">
                <h1>Toolguide Companion</h1>
                <p>Your browser companion to accomplish many handy stuff!</p>
                <div class="main-support-section">
                    <a href="https://buymeacoffee.com/gokacinlar" class="btn btn-success d-flex flex-row gap-2 align-items-center justify-content-center rounded-pill fs-3 px-2 py-2 shadow-md" role="button" title="Redirect to Support Page" target="_blank">
                        <img src="/images/icons/support.svg" class="img-fluid main-support-icon" alt="Support this project!"><span>Support this project!</span>
                    </a>
                </div>
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
                case "webdev":
                    placeHolderContent?.remove();
                    dynamicContent.innerHTML = "";
                    dynamicContent.appendChild(this.webdev);
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
