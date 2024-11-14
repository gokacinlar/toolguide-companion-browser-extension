import { Template, BASIC_TEMPLATE } from "./helper.js";
import { AppCalculations } from "./appCalculations.js";

export class WebDev extends HTMLElement {
    private template: Template;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };
    constructor() {
        super();
        this.template = new Template();
        this.appCalculation = new AppCalculations();
        this.Ids = {
            colorPicker: "colorPicker"
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
                    this.appCalculation.openPage(pageName, document); // Use the optional chaining operator to ensure shadowRoot is not null
                });
            });
        }
    }

    // Render the main template
    private webDev(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.colorPicker}">Color Picker</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="colorPicker" style="display: none;">${this.renderColorPicker()}</div>
            </div>
        `;
    }

    // Color Picker
    private renderColorPicker(): string {
        return `
            Coming soon...
        `;
    }

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("colorPicker", document);
    }
}

customElements.define("app-webdev", WebDev);