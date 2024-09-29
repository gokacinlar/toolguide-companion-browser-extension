import { HandleNav } from "./handleNavigation.js";
import { Template } from "./helper.js";

class Aside extends HTMLElement {
    private documentStylings: {
        template: string,
        btnStyling: string,
    };

    private buttons: { [key: string]: string };
    private buttonRefs: { [key: string]: string };
    private templateHelper: Template;

    constructor() {
        super();

        this.documentStylings = {
            template: "aside-buttons bg-primary d-flex flex-column gap-2 py-2 px-2 align-items-center justify-content-start rounded-3",
            btnStyling: "btn btn-outline-light text-light w-100 fs-5"
        };

        this.buttons = {
            calculation: "Calculators",
            converters: "Converters"
        };

        this.buttonRefs = {
            calculation: "",
            converters: ""
        };

        this.templateHelper = new Template(); // Create an instance of Template

        // Define styles directly in the constructor
        const styles = `
            @import url(/src/lib/css/fastbootstrap.css);
            @import url(/assets/css/custom.css);
        `;

        // Create the template and append it to the shadow root
        const template = this.templateHelper.createTemplate(styles, this.renderContent());

        this.attachShadow({ mode: "open" });
        this.shadowRoot?.appendChild(template.content.cloneNode(true));

        // Render buttons after appending the template
        const asideElement = this.shadowRoot?.querySelector("aside") as HTMLElement | null;
        this.renderButtons(asideElement);
    }

    // Always render the content first
    private renderContent(): string {
        return `
            <aside class="${this.documentStylings.template}">
            </aside>
        `;
    }

    // Render Aside buttons to navigate the tabs
    private renderButtons(asideElement: HTMLElement | null): void {
        for (const key in this.buttons) {
            const buttonHolder: HTMLButtonElement = document.createElement("button");

            buttonHolder.textContent = this.buttons[key];
            buttonHolder.className = this.documentStylings.btnStyling;
            buttonHolder.dataset.url = this.buttonRefs[key]; // Use data attribute for URL
            buttonHolder.addEventListener("click", this.handleButtonClick.bind(this));

            asideElement?.appendChild(buttonHolder);
        }
    }

    // Data map the relationship between button elements & their corresponding URLs
    private handleButtonClick(event: MouseEvent): void {
        const target = event.currentTarget as HTMLButtonElement;
        const url = target.dataset.url; // Get the URL from the data attribute
        if (url) {
            window.location.href = url; // Navigate to the URL
        }
    }
}

customElements.define("app-aside", Aside);
