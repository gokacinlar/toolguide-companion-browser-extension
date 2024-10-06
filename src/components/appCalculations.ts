import { Template } from "./helper.js";

interface BasicTemplate {
    ul: string;
    button: string;
    componentElement: string;
}

const BASIC_TEMPLATE: { [key: string]: BasicTemplate } = {
    classes: {
        ul: "app-calc-ul d-flex flex-row gap-2 align-items-center justify-content-start",
        button: "app-calc-nav-button btn btn-discovery w-100 fs-5 shadow-md rounded-3",
        componentElement: "app-calc-component-element py-2"
    }
}

export class AppCalculations extends HTMLElement {
    private template: Template;
    private Ids: { [key: string]: string }

    constructor() {
        super();
        this.template = new Template();

        this.Ids = {
            basicCalculator: "basicCalculator",
            anotherPageId: "anotherPageId"
        }

        const styles = `
            @import url(/src/lib/css/fastbootstrap.css);
            @import url(/assets/css/custom.css);
        `;

        const template = this.template.createTemplate(styles, this.appCalculations());
        this.attachShadow({ mode: "open" });
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    // Render the main template
    public appCalculations(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.basicCalculator}">Basic Calculator</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.anotherPageId}">Another Page</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="basicCalculator" style="display: none;">${this.basicCalculator()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="anotherPageId" style="display: none;">${this.anotherPage()}</div>
            </div>
        `;
    }

    // Function to open corresponding data-page in DOM through buttons
    private handleNavigation() {
        const navButtons = this.shadowRoot?.querySelectorAll<HTMLButtonElement>(".app-calc-nav-button");

        if (navButtons) {
            navButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const pageName = button.getAttribute("data-page");
                    this.openPage(pageName);
                });
            });
        }
    }

    // Function to enable tab switching
    public openPage(pageName: string | null): void {
        // Hide all tab content first
        const tabcontent = Array.from(this.shadowRoot?.querySelectorAll(".app-calc-component-element") as NodeListOf<HTMLElement>);
        if (tabcontent) {
            tabcontent.forEach((content: HTMLElement) => {
                content.style.display = "none";
            });
        }

        // Remove active class from all navigation buttons next
        const tabNavigation = Array.from(this.shadowRoot?.querySelectorAll(".app-calc-nav-button") as NodeListOf<HTMLElement>)
        if (tabNavigation) {
            tabNavigation.forEach((button: HTMLElement) => {
                button.classList.remove("active");
            });
        }

        // Show the selected page based on user selection through buttons
        const blockElem = this.shadowRoot?.getElementById(pageName || "");
        if (blockElem) {
            blockElem.style.display = "block";
        } else {
            console.warn(`Element with id "${pageName}" not found.`);
        }

        // Add active class to the corresponding navigation button to display the content
        const activeButton = this.shadowRoot?.querySelector<HTMLButtonElement>('.app-calc-nav-button[data-page="' + pageName + '"]');
        if (activeButton) {
            activeButton.classList.add("active");
        } else {
            console.warn(`Button with data-page="${pageName}" not found.`);
        }
    }

    // Calculator itself
    public basicCalculator(): string {
        return `
            <div>
                <h2>Basic Calculator</h2>
                <p>This is the content for the Basic Calculator component.</p>
            </div>
        `;
    }

    public anotherPage(): string {
        return `
            <div>
                <h2>Another Content!</h2>
                <p>This is the content for the Another Content component.</p>
            </div>
        `;
    }

    // Use connectedCallback to manage tab switching
    connectedCallback() {
        this.handleNavigation(); // Set up event listeners for navigation buttons
        this.openPage("basicCalculator"); // Open the default page
    }
}

customElements.define("app-calculations", AppCalculations);
