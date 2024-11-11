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
            unitConverter: "unitConverter",
            currencyConverter: "currencyConverter",
            timeZoneConverter: "timeZoneConverter"
        }

        const template = this.template.createTemplate(this.unitConverters());
        this.appendChild(template.content.cloneNode(true));
    }

    // Render the main template
    public unitConverters(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.baseConverter}">Base</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.unitConverter}">Unit</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.currencyConverter}">Currency</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.timeZoneConverter}">Time Zone</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="baseConverter" style="display: none;">${this.renderBaseConverter()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="unitConverter" style="display: none;">${this.renderUnitConverter()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="currencyConverter" style="display: none;">${this.renderCurrencyConverter()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="timeZoneConverter" style="display: none;">${this.renderTimeZoneConverter()}</div>
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

    // Base Converter
    public renderBaseConverter(): string {
        return `
            <section id="baseConverter">
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
                    <label for="uc-value-one">From:</label>
                    <select class="form-select" aria-label="First Value Select" name="uc-value-one" id="ucValueOne" title="First Value">
                        <option value="Binary">Binary</option>
                        <option value="Decimal">Decimal</option>
                        <option value="Octal">Octal</option>
                        <option value="Hexademical">Hexademical</option>
                    </select>
                </div>
                <div class="uc-child uc-two w-100">
                    <label for="uc-value-two">To:</label>
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

    // Unit Converter
    private renderUnitConverter(): string {
        return `
            <section id="unitConverter">
                <div class="uc-container px-1">
                    <div class="uc-inputs input-group mb-3">
                        <span class="input-group-text" id="unitConversionInput">Input</span>
                        <input type="text" class="form-control ruc-form-control" placeholder="Type here..." aria-label="Type Input" aria-describedby="unitConversionInput"/>
                    </div>
                    <div class="uc-inputs-selection mb-3">
                        ${this.renderUnitConverterInputSelection()}
                    </div>
                    <div class="uc-display d-flex flex-column align-items-start justify-content-start mb-3">
                        <label for="rucOutputValue" class="form-label">Results will appear below.</label>
                        <textarea class="uc-output-value w-100 form-control fs-3" id="rucOutputValue" title="Result" placeholder="Result" name="result" readonly></textarea>
                        <div class="alerts d-flex flex-row align-content-center justify-content-between">
                            <div>
                                <button class="btn btn-discovery ruc-convert-btn rounded-pill fs-4 mt-3" id="rucConvertBtn">Convert</button>
                            </div>
                            <div class="d-flex flex-row align-content-center justify-content-center w-100">
                                <div class="ruc-alert alert alert-danger transition ease-in-out duration-300 mt-3 my-0 py-0 rounded-pill" role="alert" style="opacity: 0;">
                                    <h6 class="ruc-alert-message mb-0"></h6>
                                </div>
                                <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-3 my-0 py-0 rounded-pill" role="alert" style="opacity: 0;">
                                    <h6 class="mb-0">Copied to clipboard.</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
        `;
    }

    private renderUnitConverterInputSelection(): string {
        return `
            <div class="ruc-selection-container d-flex flex-row align-items-center justify-content-center gap-2">
                <div class="ruc-child uc-one w-100">
                    <label for="ruc-value-one">From:</label>
                    <select class="form-select" aria-label="First Value Select" name="ruc-value-one" id="rucValueOne" title="First Value">
                        <option value="Millimeter">Millimeter</option>
                        <option value="Centimeter">Centimeter</option>
                        <option value="Meter">Meter</option>
                        <option value="Kilometer">Kilometer</option>
                    </select>
                </div>
                <div class="ruc-child uc-two w-100">
                    <label for="ruc-value-two">To:</label>
                    <select class="form-select" aria-label="Second Value Select" name="ruc-value-two" id="rucValueTwo" title="Second Value">
                        <option value="Millimeter">Millimeter</option>
                        <option value="Centimeter">Centimeter</option>
                        <option value="Meter">Meter</option>
                        <option value="Kilometer">Kilometer</option>
                    </select>
                </div>
            </div>
        `;
    }

    private unitConvert = (inputValue: number, from: string, to: string): number => {
        if (typeof inputValue !== "number" && typeof from !== "string" && typeof to !== "string") {
            throw new Error("Input value must be a number.");
        }

        // Define conversion values as base points to let calculation be performed
        const conversionFactors: {
            [unit1: string]: { [unit2: string]: number; };
        } = {
            "Millimeter": {
                "Centimeter": 0.1,
                "Meter": 0.001,
                "Kilometer": 0.000001
            },
            "Centimeter": {
                "Millimeter": 10,
                "Meter": 0.01,
                "Kilometer": 0.00001
            },
            "Meter": {
                "Millimeter": 1000,
                "Centimeter": 100,
                "Kilometer": 0.001
            },
            "Kilometer": {
                "Millimeter": 1000000,
                "Centimeter": 100000,
                "Meter": 1000
            }
        };

        // Check if the conversion is possible
        if (!conversionFactors[from] || !conversionFactors[from][to]) {
            this.appCalculation.displayAlert(".ruc-alert", ".ruc-alert-message", "Conversion invalid.");
            throw new Error("Conversion invalid.");
        }

        const convertedValue = inputValue * conversionFactors[from][to];
        return convertedValue;
    }

    // Currency Converter
    private renderCurrencyConverter(): string {
        return `
            Coming soon...
        `;
    }

    // Timezone Converter
    private renderTimeZoneConverter(): string {
        return `
            Coming soon...
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

        // Function to do the conversion in Base Conversion
        const convertValue = (inputValue: string, fromUnit: string, toUnit: string): string => {
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

        // Unit Converter functions
        // Define HTMLElements of Unit Converter
        const rucInputField = document.querySelector(".ruc-form-control") as HTMLInputElement;
        const rucOutputTextarea = document.getElementById("rucOutputValue") as HTMLTextAreaElement;
        const rucConvertBtn = document.getElementById("rucConvertBtn") as HTMLButtonElement;
        const rucValueOneSelect = document.getElementById("rucValueOne") as HTMLInputElement;
        const rucValueTwoSelect = document.getElementById("rucValueTwo") as HTMLInputElement;

        rucConvertBtn.addEventListener("click", () => {
            const rucIfParsed = parseFloat(rucInputField.value);
            // Check if input is a number or not
            if (isNaN(rucIfParsed)) {
                this.appCalculation.displayAlert(".ruc-alert", ".ruc-alert-message", "Invalid input value.");
                return;
            }
            // Perform the calculation
            const convertedValue = this.unitConvert(rucIfParsed, rucValueOneSelect.value, rucValueTwoSelect.value);
            const finalResult = rucOutputTextarea.value = convertedValue.toString();
        });
    }
}

customElements.define("app-converters", Converters);