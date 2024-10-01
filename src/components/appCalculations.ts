// src/components/appCalculations.ts
export class AppCalculations extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // this.shadowRoot?.appendChild(this.createTemplate().content.cloneNode(true));
    }

    public basicCalculator(): string {
        return `
            <div>
                <h2>Calculators</h2>
                <p>This is the content for the Calculators component.</p>
                <!-- Add your calculator UI here -->
            </div>
        `;
    }
}

customElements.define("app-calculations", AppCalculations);
