import { Template } from "./helper.js";

class Footer extends HTMLElement {
    private templateHelper: Template;
    private stylings: { [key: string]: string };

    constructor() {
        super();

        this.templateHelper = new Template();

        this.stylings = {
            footerStyling: ""
        }

        // Define styles directly in the constructor
        const styles = `
                @import url(/src/lib/css/fastbootstrap.css);
                @import url(/assets/css/custom.css);
            `;
        const template = this.templateHelper.createTemplate(styles, this.renderFooter());
        this.attachShadow({ mode: "open" });
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    renderFooter(): string {
        return `
            <footer class="${this.stylings.footerStyling}">
            </footer>
        `;
    }
}

customElements.define("app-footer", Footer);