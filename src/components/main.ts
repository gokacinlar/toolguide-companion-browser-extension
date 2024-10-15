// main.ts
import { Template } from "./helper.js";
import { AppCalculations } from "./appCalculations.js";
import { Converters } from "./converters.js";

export class Main extends HTMLElement {
    private templateHelper: Template;
    private appCalculations: AppCalculations;
    private converters: Converters

    private documentStyling: { [key: string]: string };
    private Ids: { [key: string]: string };

    constructor() {
        super();
        this.templateHelper = new Template();
        this.appCalculations = new AppCalculations();
        this.converters = new Converters();

        this.documentStyling = {
            main: "d-flex flex-column align-content-center justify-content-start",
            mainPlaceholder: "info-placeholder w-100 d-flex flex-column align-items-center justify-content-center"
        };

        this.Ids = {
            dynamicContent: "dynamicContent"
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

    // Render the placeholder
    public renderContent(): string {
        return `
        <main class="${this.documentStyling.main}">
            <div class="${this.documentStyling.mainPlaceholder}">
                <h1>Dev Toolguide</h1>
                <p>Your browser companion to accomplish many handy stuff!</p>
            </div>
            <div id="${this.Ids.dynamicContent}"></div>
        </main>
        `;
    }

    // Method to update the main content based on the selected component
    public updateContent(component: any): void {
        // Define the dynamicContent since all tools will be appended there
        const dynamicContent = this.shadowRoot?.getElementById("dynamicContent") as HTMLElement | null;
        const placeHolderContent = this.shadowRoot?.querySelector(".info-placeholder") as HTMLElement | null;

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
                default:
                    dynamicContent.innerHTML = "<p>Select a component to view its content.</p>";
                    break;
            }
        }
    }
}

customElements.define("app-main", Main);
