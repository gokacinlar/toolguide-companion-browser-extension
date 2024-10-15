import { Template } from "./helper.js";
import { AppCalculations } from "./appCalculations.js";

interface BasicTemplate { [key: string]: string }

const BASIC_TEMPLATE: { [key: string]: BasicTemplate } = {
    classes: {
        ul: "app-calc-ul d-flex flex-row gap-2 align-items-center justify-content-start",
        button: "component-tab-nav-button btn btn-discovery w-100 fs-5 shadow-md rounded-3",
        componentElement: "component-tab-content-element py-2 my-2",
        calcButtons: "calc-button btn btn-primary rounded-pill fs-4 w-100 shadow-sm",
        calcButtonsExtra: "calc-keys btn btn-discovery rounded-pill fs-4 fw-medium w-100 shadow-sm"
    }
}

export class Converters extends HTMLElement {
    private template: Template;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    constructor() {
        super();
        this.template = new Template();
        this.appCalculation = new AppCalculations();

        this.Ids = {
            unitConverter: "unitConverter",
        }
        const styles = `
        @import url(/src/lib/css/fastbootstrap.css);
        @import url(/assets/css/custom.css);
        `;

        const template = this.template.createTemplate(styles, this.unitConverters());
        this.attachShadow({ mode: "open" });
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    // Render the main template
    public unitConverters(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.unitConverter}">Unit Converter</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.anotherPageId}">Another Page</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="unitConverter" style="display: none;">${this.renderUnitConverter()}</div>
            </div>
        `;
    }

    // Function to open corresponding data-page in DOM through buttons
    public handleNavigation() {
        const navButtons = this.shadowRoot?.querySelectorAll<HTMLButtonElement>(".component-tab-nav-button");

        if (navButtons) {
            navButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const pageName = button.getAttribute("data-page");
                    this.appCalculation.openPage(pageName, this.shadowRoot ?? undefined); // Use the optional chaining operator to ensure shadowRoot is not null
                });
            });
        }
    }

    public renderUnitConverter(): string {
        return `
        <section id="unitConverter">
            <div class="uc-container">
                <div class="uc-inputs">
                    <label for="First Input">Type Conversion</label>
                    <input type="text" title="Değer Giriniz" name="First Input">
                </div>
                <div class="uc-input-selection">
                    ${this.renderInputSelection()}
                </div>
                <div class="uc-second-value">
                    <button class="uc-convert-btn" id="ucConvertBtn">Çevir!</button>
                    <textarea class="uc-output-value" id="ucOutputValue" title="Sonuç" readonly></textarea>
                </div>
            </div>
        </section>
        `;
    }

    private renderInputSelection(): string {
        return `
        <div class="uc-child uc-one">
            <label for="uc-value-one">Çevrilecek</label>
            <select name="uc-value-one" id="ucValueOne" title="1. Değer">
                <option value="İkilik">İkilik</option>
                <option value="Ondalık">Ondalık</option>
                <option value="Sekizlik">Sekizlik</option>
                <option value="Onaltılık">Onaltılık</option>
            </select>
        </div>
        <div class="uc-child uc-two">
            <label for="uc-value-one">Sonuç</label>
            <select name="uc-value-two" id="ucValueTwo" title="2. Değer">
                <option value="İkilik">İkilik</option>
                <option value="Ondalık">Ondalık</option>
                <option value="Sekizlik">Sekizlik</option>
                <option value="Onaltılık">Onaltılık</option>
            </select>
        </div>
        `;
    }

    connectedCallback() {
        this.handleNavigation();
        this.appCalculation.openPage("unitConverter", this.shadowRoot ?? undefined); // Use the optional chaining operator to ensure shadowRoot is not null
    }
}

customElements.define("app-converters", Converters);