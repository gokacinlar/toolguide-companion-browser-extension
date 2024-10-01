import { Template } from "./helper.js";
import { AppCalculations } from "./appCalculations.js";

export class Main extends HTMLElement {
    private templateHelper: Template;
    private appCalculations: AppCalculations;

    private documentStyling: { [key: string]: string };

    constructor() {
        super();
        this.templateHelper = new Template();
        this.appCalculations = new AppCalculations();

        this.documentStyling = {
            main: "d-flex align-content-center justify-content-start",
            mainPlaceholder: "w-100 d-flex flex-column align-items-center justify-content-center"
        }

        // Define styles directly in the constructor
        const styles = `
            @import url(/src/lib/css/fastbootstrap.css);
            @import url(/assets/css/custom.css);
        `;

        const template = this.templateHelper.createTemplate(styles, this.renderContent());
        this.attachShadow({ mode: "open" });
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    public renderContent(): string {
        return `
        <main class="${this.documentStyling.main}">
            <div class="${this.documentStyling.mainPlaceholder}">
                <h1>Dev Toolguide</h1>
                <p>Your browser companion to accomplish many handy stuff!</p>
            </div>
        </main>
        `;
    }

    // Method to update the main content based on the selected component
    public updateContent(component: any): void {
        const mainElement = this.shadowRoot?.querySelector("main") as HTMLElement | null;

        if (mainElement) {
            switch (component) {
                case "calculation": // Match the key from Aside
                    mainElement.innerHTML = this.appCalculations.basicCalculator(); // Render the calculator content
                    break;
                case "converters": // Match the key from Aside
                    mainElement.innerHTML = this.renderConverters(); // Call a method to render converters
                    break;
                default:
                    mainElement.innerHTML = "<p>Select a component to view its content.</p>"; // Default message
                    break;
            }
        }
    }

    // Method to render converters content (placeholder)
    // Later delete
    private renderConverters(): string {
        return `
            <div>
                <h2>Converters</h2>
                <p>This is the content for the Converters component.</p>
            </div>
        `;
    }
}

customElements.define("app-main", Main);
