import { Template, Overflowing } from "./helper.js";
import { ElementStyling } from "../static.js";
import AppCalculations from "./app_calculations.js";

export default class WebDev extends HTMLElement {
    private template: Template;
    private staticElementStylings: ElementStyling;
    private overflowing: Overflowing;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    constructor() {
        super();
        this.template = new Template();
        this.staticElementStylings = new ElementStyling();
        this.overflowing = new Overflowing();
        this.appCalculation = new AppCalculations();
        this.Ids = {
            colorPicker: "colorPicker",
            colorPGenerator: "colorPGenerator"
        }

        const template = this.template.createTemplate(this.webDev());
        this.appendChild(template.content.cloneNode(true));
    }

    // Function to open corresponding data-page in DOM through buttons
    public handleNavigation() {
        const navButtons = document.querySelectorAll<HTMLButtonElement>(".component-tab-nav-button");

        if (navButtons) {
            navButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const pageName = button.getAttribute("data-page");
                    this.appCalculation.openPage(pageName, document);
                });
            });
        }
    }

    // Render the main template
    private webDev(): string {
        return `
            <div class="web-dev-tab-navigation-buttons">
                <ul class="${this.staticElementStylings.BASIC_TEMPLATE.classes.ul} webdev-ulist">
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.colorPicker}">Color Picker</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.colorPGenerator}">Color Palette Generator</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="colorPicker" style="display: none;">${this.renderColorPicker()}</div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="colorPGenerator" style="display: none;">${this.colorPaletteGenerator()}</div>
            </div>
        `;
    }

    // Color Picker
    private renderColorPicker(): string {
        return `
            Coming soon...
        `;
    }

    // Color Palette Generator
    private colorPaletteGenerator(): string {
        return `
            Coming soon...
        `;
    }

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("colorPicker", document);
        // Handle tab overflowing & navigation buttons
        const tabMenu = document.querySelector(".web-dev-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".webdev-ulist");
    }
}

customElements.define("app-webdev", WebDev);