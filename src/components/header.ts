import 'fastbootstrap';

class Header extends HTMLElement {
    constructor() {
        super();


        this.attachShadow({ mode: "open" });
        this.shadowRoot?.appendChild(this.createTemplate().content.cloneNode(true));
    }

    createTemplate(): HTMLTemplateElement {
        const template = document.createElement("template");
        template.innerHTML = `
            <header>

            </header>
        `;
        return template
    }
}

customElements.define("app-header", Header);