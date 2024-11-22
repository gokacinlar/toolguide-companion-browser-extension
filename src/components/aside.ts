import { Template, BUTTON_TEMPLATE } from "./helper.js";
import { Main } from "./main.js";

class Aside extends HTMLElement {
    private documentStylings: {
        template: string,
        btnStyling: string,
    };

    private templateHelper: Template;
    private main: Main;

    constructor() {
        super();
        this.templateHelper = new Template(); // Create an instance of Template
        this.main = new Main();

        this.documentStylings = {
            template: "aside-buttons d-flex flex-column gap-2 py-2 px-2 mb-1 align-items-center justify-content-start rounded-3 shadow-lg",
            btnStyling: "btn btn-outline-light w-100 fs-5 shadow-md rounded-3 d-flex flex-row align-items-center justify-content-even gap-2"
        };

        const template = this.templateHelper.createTemplate(this.renderContent());
        this.appendChild(template.content.cloneNode(true));

        // Render buttons after appending the template
        const asideElement = document.querySelector("aside") as HTMLElement | null;
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
        for (const key in BUTTON_TEMPLATE) {
            const buttonHolder: HTMLButtonElement = document.createElement("button");

            buttonHolder.innerHTML = `
                <img class="aside-button-icons" src="${BUTTON_TEMPLATE[key].imgSrc}" alt="${BUTTON_TEMPLATE[key].name}">
                ${BUTTON_TEMPLATE[key].name}
            `;
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

        // First remove the "active" state of the buttons
        const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".aside-buttons > button");
        buttons.forEach((elem) => {
            elem.classList.remove("active");
        })

        target.classList.add("active");

        // Find the existing Main component in the DOM
        const mainElement = document.querySelector("app-main") as Main | null;
        if (mainElement) {
            mainElement.updateContent(component); // Call the method to update the main content
        }
    }
}

customElements.define("app-aside", Aside);
