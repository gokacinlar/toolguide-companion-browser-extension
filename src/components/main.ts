// main.ts
import { Template } from "./helper.js";
import { ElementStyling } from "../static.js";
import HomePage from "./homepage.js";
import Converters from "./converters.js";
import Generators from "./generators.js";
import Utilities from "./utils.js";
import AppCalculations from "./app_calculations.js";
import Formatters from "./formatters.js";
import Ciphers from "./ciphers.js";
import SystemInformation from "./sys_info.js";

export class Main extends HTMLElement {
    private templateHelper: Template;
    private staticElementStylings: ElementStyling;
    private homePage: HomePage;
    private appCalculations: AppCalculations;
    private converters: Converters;
    private generators: Generators;
    private utils: Utilities;
    private formatters: Formatters;
    private ciphers: Ciphers;
    private sysinfo: SystemInformation;

    constructor() {
        super();
        this.templateHelper = new Template();
        this.staticElementStylings = new ElementStyling();
        this.homePage = new HomePage();
        this.appCalculations = new AppCalculations();
        this.converters = new Converters();
        this.generators = new Generators();
        this.utils = new Utilities();
        this.formatters = new Formatters();
        this.ciphers = new Ciphers();
        this.sysinfo = new SystemInformation();

        const template = this.templateHelper.createTemplate(this.renderContent());
        this.appendChild(template.content.cloneNode(true));
    }

    // Render the main placeholder to host the actual elements here
    public renderContent(): string {
        return `
        <main class="${this.staticElementStylings.STYLINGS.documentStyling.main}">
            <div class="${this.staticElementStylings.STYLINGS.documentStyling.mainPlaceholder}">
                <img class="img-fluid intro-icon" src="/images/logo/final-icon-without-text.png" alt="App Icon Logo">
                <h1>Toolguide Companion</h1>
                <p>Your browser companion to accomplish many handy stuff!</p>
                <div class="main-support-section">
                    <a href="https://buymeacoffee.com/gokacinlar" class="btn btn-success d-flex flex-row gap-2 align-items-center justify-content-center rounded-pill fs-3 px-2 py-2 shadow-md" 
                    role="button" title="Redirect to Support Page (BuyMeACoffee)" target="_blank">
                        <img src="/images/icons/support.svg" class="img-fluid main-support-icon" alt="Sponsor this project!"><span>Sponsor this project!</span>
                    </a>
                </div>
            </div>
            <div id="${this.staticElementStylings.STYLINGS.ids.dynamicContent}"></div>
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
                case "homePage":
                    placeHolderContent?.remove();
                    dynamicContent.innerHTML = "";
                    dynamicContent.appendChild(this.homePage);
                    break;
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
                case "utilities":
                    placeHolderContent?.remove();
                    dynamicContent.innerHTML = "";
                    dynamicContent.appendChild(this.utils);
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
                case "sysinfo":
                    placeHolderContent?.remove();
                    dynamicContent.innerHTML = "";
                    dynamicContent.appendChild(this.sysinfo);
                    break;
                default:
                    dynamicContent.innerHTML = this.renderDefault();
                    break;
            }
        }
    }

    private renderDefault(): string {
        return `
            <div class="${this.staticElementStylings.STYLINGS.welcome.div}">
                <img class="welcome-message-logo img-fluid" src="${this.staticElementStylings.STYLINGS.welcome.imgPath}">
                <h4>Section not available!</h4>
            </div>
        `;
    }
}

customElements.define("app-main", Main);
