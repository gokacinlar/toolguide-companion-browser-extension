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
            baseConverter: "baseConverter",
        }

        const template = this.template.createTemplate(this.unitConverters());
        this.appendChild(template.content.cloneNode(true));
    }

    // Render the main template
    public unitConverters(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.baseConverter}">Base Converter</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.anotherPageId}">Another Page</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="baseConverter" style="display: none;">${this.renderUnitConverter()}</div>
            </div>
        `;
    }

    // Function to open corresponding data-page in DOM through buttons
    public handleNavigation() {
        const navButtons = document.querySelectorAll<HTMLButtonElement>(".component-tab-nav-button");

        if (navButtons) {
            navButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const pageName = button.getAttribute("data-page");
                    this.appCalculation.openPage(pageName, document); // Use the optional chaining operator to ensure shadowRoot is not null
                });
            });
        }
    }

    public renderUnitConverter(): string {
        return `
        <section id="unitConverter">
            <div class="uc-container px-1">
                <div class="uc-inputs input-group mb-3">
                    <span class="input-group-text" id="typing-conversion">Input</span>
                    <input type="text" class="form-control" placeholder="Type here..." aria-label="Type Input" aria-describedby="typing-conversion" />
                </div>
                <div class="uc-inputs-selection mb-3">
                    ${this.renderInputSelection()}
                </div>
                <div class="uc-display d-flex flex-column align-items-start justify-content-start mb-3">
                    <label for="ucOutputValue" class="form-label">Results will appear below.</label>
                    <textarea class="uc-output-value w-100 form-control fs-3" id="ucOutputValue" title="Result" placeholder="Result" name="result" readonly></textarea>
                    <button class="btn btn-discovery uc-convert-btn rounded-pill fs-4 mt-3" id="ucConvertBtn">Convert</button>
                </div>
            </div>
        </section>
        `;
    }

    private renderInputSelection(): string {
        return `
        <div class="uc-selection-container d-flex flex-row align-items-center justify-content-center gap-2">
            <div class="uc-child uc-one w-100">
                <select class="form-select" aria-label="First Value Select" name="uc-value-one" id="ucValueOne" title="First Value">
                    <option value="Binary">Binary</option>
                    <option value="Decimal">Decimal</option>
                    <option value="Octal">Octal</option>
                    <option value="Hexademical">Hexademical</option>
                </select>
            </div>
            <div class="uc-child uc-two w-100">
                <select class="form-select" aria-label="Second Value Select" name="uc-value-two" id="ucValueTwo" title="Second Value">
                    <option value="Binary">Binary</option>
                    <option value="Decimal">Decimal</option>
                    <option value="Octal">Octal</option>
                    <option value="Hexademical">Hexademical</option>
                </select>
            </div>
        </div>
        `;
    }

    connectedCallback() {
        this.handleNavigation();
        this.appCalculation.openPage("baseConverter", document);

        // Define HTMLElements within the connectedCallback()
        const inputField = document.querySelector(".form-control") as HTMLInputElement;
        const outputTextarea = document.getElementById("ucOutputValue") as HTMLTextAreaElement;
        const convertBtn = document.getElementById("ucConvertBtn") as HTMLButtonElement;
        const valueOneSelect = document.getElementById("ucValueOne") as HTMLInputElement;
        const valueTwoSelect = document.getElementById("ucValueTwo") as HTMLInputElement;

        // Function to do the conversion
        function convertValue(inputValue: string, fromUnit: string, toUnit: string): string {
            const dataValues: { [key: string]: number } = {
                "Binary": 2,
                "Decimal": 10,
                "Octal": 8,
                "Hexademical": 16
            };

            if (typeof inputValue !== "string") {
                throw new Error("Input value must be a string.");
            }

            if ((!Object.keys(dataValues).includes(fromUnit)) && (!Object.keys(dataValues).includes(toUnit))) {
                throw new Error("Invalid conversion.");
            }

            try {
                const convertedValue = parseInt(inputValue, dataValues[fromUnit]).toString(dataValues[toUnit]);

                if (dataValues[toUnit] === 16) {
                    return convertedValue.toUpperCase();
                }

                return convertedValue;
            } catch (error) {
                return `Invalid ${fromUnit} number.`;
            }
        }

        // Add event listener to convert button, thus do the conversion
        convertBtn.addEventListener("click", () => {
            // First clean the input
            const inputValue = inputField.value.trim();
            const fromUnit = valueOneSelect.value;
            const toUnit = valueTwoSelect.value;

            if (inputValue.length === 0) {
                outputTextarea.value = "Please provide a value.";
                return;
            }

            try {
                const convertedValue = convertValue(inputValue, fromUnit, toUnit);
                outputTextarea.value = convertedValue;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    outputTextarea.value = error.message;
                } else {
                    outputTextarea.value = "An unknown error occurred.";
                }
            }
        });
    }

}

customElements.define("app-converters", Converters);