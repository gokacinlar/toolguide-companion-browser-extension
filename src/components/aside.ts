import { Template } from "./helper.js";
import { Main } from "./main.js";

class Aside extends HTMLElement {
    private documentStylings: {
        template: string,
        btnStyling: string,
    };

    private buttons: { [key: string]: string };

    private templateHelper: Template;
    private main: Main;

    constructor() {
        super();
        this.templateHelper = new Template(); // Create an instance of Template
        this.main = new Main();

        this.documentStylings = {
            template: "aside-buttons btn-group-vertical bg-primary d-flex flex-column gap-2 py-2 px-2 align-items-center justify-content-start rounded-3 shadow-sm",
            btnStyling: "btn btn-info border-2 border-dark border-opacity-50 text-light w-100 fs-5 shadow-md rounded-3"
        };

        this.buttons = {
            calculation: "Calculators",
            converters: "Converters"
        };

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
            <aside class="${this.documentStylings.template}" role="group">
            </aside>
        `;
    }

    // Render Aside buttons to navigate the tabs
    private renderButtons(asideElement: HTMLElement | null): void {
        for (const key in this.buttons) {
            const buttonHolder: HTMLButtonElement = document.createElement("button");

            buttonHolder.textContent = this.buttons[key];
            buttonHolder.className = this.documentStylings.btnStyling;
            buttonHolder.dataset.component = key; // Use data attribute to identify the component
            buttonHolder.addEventListener("click", this.handleButtonClick.bind(this));

            asideElement?.appendChild(buttonHolder);
        }
    }

    // Handle button click to render the corresponding content in the Shadow DOM of Main class
    // which renders itself the proper component
    private handleButtonClick(event: MouseEvent): void {
        const target = event.currentTarget as HTMLButtonElement;
        const component = target.dataset.component; // Get the component name from the data attribute

        // Find the existing Main component in the DOM
        const mainElement = document.querySelector("app-main") as Main | null;
        if (mainElement) {
            mainElement.updateContent(component); // Call the method to update the main content
        }
    }
}

customElements.define("app-aside", Aside);
