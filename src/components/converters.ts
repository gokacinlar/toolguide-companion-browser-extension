import { Template, Overflowing, BASIC_TEMPLATE } from "./helper.js";
import { UnitFactors, ConversionValues } from "../static.js";
import AppCalculations from "./appCalculations.js";
import type * as Types from '../types.js';

export default class Converters extends HTMLElement {
    private template: Template;
    private staticUnitFactors: UnitFactors;
    private staticConversionValues: ConversionValues;
    private overflowing: Overflowing;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    constructor() {
        super();
        this.template = new Template();
        this.staticUnitFactors = new UnitFactors();
        this.staticConversionValues = new ConversionValues();
        this.overflowing = new Overflowing();
        this.appCalculation = new AppCalculations();
        this.Ids = {
            baseConverter: "baseConverter",
            unitConverter: "unitConverter",
            dataStorageConverter: "dataStorageConverter",
            speedConverter: "speedConverter",
            currencyConverter: "currencyConverter",
            timeZoneConverter: "timeZoneConverter",
        }

        const template = this.template.createTemplate(this.unitConverters());
        this.appendChild(template.content.cloneNode(true));
    }

    // Render the main template
    public unitConverters(): string {
        return `
            <div class="position-relative converters-tab-navigation-buttons">
                <ul class="${BASIC_TEMPLATE.classes.ul} converters-ulist">
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.baseConverter}">Base Numbers</button></li>
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.unitConverter}">Unit</button></li>
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.dataStorageConverter}">Data Storage</button></li>
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.speedConverter}">Speed</button></li>
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.timeZoneConverter}">Time</button></li>
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.currencyConverter}">Currency</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="baseConverter" style="display: none;">${this.renderBaseConverter()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="unitConverter" style="display: none;">${this.renderUnitConverter()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="dataStorageConverter" style="display: none;">${this.renderDataConverterTemplate()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="speedConverter" style="display: none;">${this.renderSpeedConverterTemplate()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="timeZoneConverter" style="display: none;">${this.renderTimeConverter()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="currencyConverter" style="display: none;">${this.renderCurrencyConverter()}</div>
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
            <section id="baseConverterTemplate">
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
                        ${this.generateAlerts("ucConvertBtn", "uc-alert", "uc-alert-message")}
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
                        ${this.generateOptions(this.staticConversionValues.baseConverterOptions)}
                    </select>
                </div>
                <div class="uc-child uc-two w-100">
                    <label for="uc-value-two">To:</label>
                    <select class="form-select" aria-label="Second Value Select" name="uc-value-two" id="ucValueTwo" title="Second Value">
                        ${this.generateOptions(this.staticConversionValues.baseConverterOptions)}
                    </select>
                </div>
            </div>
        `;
    }

    // Unit Converter
    private renderUnitConverter(): string {
        return `
            <section id="unitConverterTemplate">
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
                        ${this.generateAlerts("rucConvertBtn", "ruc-alert", "ruc-alert-message")}
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
                        ${this.generateOptions(this.staticConversionValues.lengthOptions)}
                    </select>
                </div>
                <div class="ruc-child uc-two w-100">
                    <label for="ruc-value-two">To:</label>
                    <select class="form-select" aria-label="Second Value Select" name="ruc-value-two" id="rucValueTwo" title="Second Value">
                        ${this.generateOptions(this.staticConversionValues.lengthOptions)}
                    </select>
                </div>
            </div>
        `;
    }

    // Data Converter
    private renderDataConverterTemplate(): string {
        return `
            <section id="dataConverter">
                <div class="datac-container px-1">
                    <div class="datac-inputs input-group mb-3">
                        <span class="input-group-text" id="dataConversionInput">Input</span>
                        <input type="text" class="form-control datac-form-control" placeholder="Type here..." aria-label="Type Input" aria-describedby="unitConversionInput"/>
                    </div>
                    <div class="datac-inputs-selection mb-3">
                        ${this.renderDataConverterOptions()}
                    </div>
                    <div class="datac-display d-flex flex-column align-items-start justify-content-start mb-3">
                        <label for="datacOutputValue" class="form-label">Results will appear below.</label>
                        <textarea class="datac-output-value w-100 form-control fs-3" id="datacOutputValue" title="Result" placeholder="Result" name="result" readonly></textarea>
                        ${this.generateAlerts("datacConvertBtn", "datac-alert", "datac-alert-message")}
                    </div>
                </div>
            </section>
        `;
    }

    private renderDataConverterOptions(): string {
        return `
            <div class="datac-selection-container d-flex flex-row align-items-center justify-content-center gap-2">
                <div class="datac-child uc-one w-100">
                    <label for="datac-value-one">From:</label>
                    <select class="form-select" aria-label="First Value Select" name="datac-value-one" id="datacValueOne" title="First Value">
                        ${this.generateOptions(this.staticConversionValues.dataConverterOptions)}
                    </select>
                </div>
                <div class="datac-child uc-two w-100">
                    <label for="datac-value-two">To:</label>
                    <select class="form-select" aria-label="Second Value Select" name="datac-value-two" id="datacValueTwo" title="Second Value">
                        ${this.generateOptions(this.staticConversionValues.dataConverterOptions)}
                    </select>
                </div>
            </div>
        `;
    }

    // Speed Converter
    private renderSpeedConverterTemplate(): string {
        return `
            <section id="speedConverterTemplate">
                <div class="speed-container px-1">
                    <div class="speed-inputs input-group mb-3">
                        <span class="input-group-text" id="speedConversionInput">Input</span>
                        <input type="text" class="form-control speed-form-control" placeholder="Type here..." aria-label="Type Input" aria-describedby="unitConversionInput"/>
                    </div>
                    <div class="speed-inputs-selection mb-3">
                        ${this.renderSpeedConverterOptions()}
                    </div>
                    <div class="speed-display d-flex flex-column align-items-start justify-content-start mb-3">
                        <label for="speedOutputValue" class="form-label">Results will appear below.</label>
                        <textarea class="speed-output-value w-100 form-control fs-3" id="speedOutputValue" title="Result" placeholder="Result" name="result" readonly></textarea>
                        ${this.generateAlerts("speedConvertBtn", "speed-alert", "speed-alert-message")}
                    </div>
                </div>
            </section>
        `;
    }

    private renderSpeedConverterOptions(): string {
        return `
            <div class="speed-selection-container d-flex flex-row align-items-center justify-content-center gap-2">
                <div class="speed-child uc-one w-100">
                    <label for="speed-value-one">From:</label>
                    <select class="form-select" aria-label="First Value Select" name="speed-value-one" id="speedValueOne" title="First Value">
                        ${this.generateOptions(this.staticConversionValues.speedConverterOptions)}
                    </select>
                </div>
                <div class="speed-child uc-two w-100">
                    <label for="speed-value-two">To:</label>
                    <select class="form-select" aria-label="Second Value Select" name="speed-value-two" id="speedValueTwo" title="Second Value">
                        ${this.generateOptions(this.staticConversionValues.speedConverterOptions)}
                    </select>
                </div>
            </div>
        `;
    }

    // Timezone Converter
    private renderTimeConverter(): string {
        return `
            <section id="timeConverter">
                <div class="time-container px-1">
                    <div class="time-inputs input-group mb-3">
                        <span class="input-group-text" id="timeConversionInput">Input</span>
                        <input type="text" class="form-control time-form-control" placeholder="Type here..." aria-label="Type Input" aria-describedby="unitConversionInput"/>
                    </div>
                    <div class="time-inputs-selection mb-3">
                        ${this.renderTimeConverterOptions()}
                    </div>
                    <div class="time-display d-flex flex-column align-items-start justify-content-start mb-3">
                        <label for="timeOutputValue" class="form-label">Results will appear below.</label>
                        <textarea class="time-output-value w-100 form-control fs-3" id="timeOutputValue" title="Result" placeholder="Result" name="result" readonly></textarea>
                        ${this.generateAlerts("timeConvertBtn", "time-alert", "time-alert-message")}
                    </div>
                </div>
            </section>
        `;
    }

    private renderTimeConverterOptions(): string {
        return `
            <div class="time-selection-container d-flex flex-row align-items-center justify-content-center gap-2">
                <div class="time-child uc-one w-100">
                    <label for="time-value-one">From:</label>
                    <select class="form-select" aria-label="First Value Select" name="time-value-one" id="timeValueOne" title="First Value">
                        ${this.generateOptions(this.staticConversionValues.timeConverterOptions)}
                    </select>
                </div>
                <div class="time-child uc-two w-100">
                    <label for="time-value-two">To:</label>
                    <select class="form-select" aria-label="Second Value Select" name="time-value-two" id="timeValueTwo" title="Second Value">
                        ${this.generateOptions(this.staticConversionValues.timeConverterOptions)}
                    </select>
                </div>
            </div>
        `;
    }

    // Currency Converter
    private renderCurrencyConverter(): string {
        return `
                Coming soon...
            `;
    }

    // Function to do conversions
    private universalUnitConversionFromConversionFactors = (inputValue: number, from: string, to: string, conversionFactors: Types.ConversionFactor): number => {
        if (typeof inputValue !== "number" && typeof from !== "string" && typeof to !== "string") {
            throw new Error("Input value must be a number.");
        }

        if (!conversionFactors[from] || !conversionFactors[from][to]) {
            throw new Error("Conversion invalid.");
        }

        // Multiply the input with corresponding "from" > "to" unit with using object keys, values
        return inputValue * conversionFactors[from][to];
    }

    // Function to dynamically generate the <option> values
    private generateOptions = (options: Types.Option[]): string => {
        // Create a new option element with iterating over options object as given input
        return options.map((option) => {
            return `<option value="${option.value}">${option.value}</option>`;
        }).join("");
    };

    // Function to generate alert boxes
    private generateAlerts = (btnId: string, messageDiv: string, messageSubDiv: string): string => {
        return `
            <div class="alerts d-flex flex-row align-content-center justify-content-between gap-2">
                <div>
                    <button type="button" class="btn btn-discovery time-convert-btn rounded-pill shadow-lg fs-4 mt-3" id="${btnId}">Convert</button>
                </div>
                <div class="d-flex flex-row align-content-center justify-content-center w-100 mt-3">
                    <div class="${messageDiv} alert alert-danger transition ease-in-out duration-300 rounded-pill px-2 py-2 mb-0" role="alert" style="opacity: 0;">
                        <h6 class="${messageSubDiv} mb-0"></h6>
                    </div>
                    <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-3 my-0 py-0 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="mb-0">Copied to clipboard.</h6>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.handleNavigation();
        this.appCalculation.openPage("baseConverter", document);
        // Handle tab overflowing & navigation buttons
        const tabMenu = document.querySelector(".converters-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".converters-ulist");

        // Define HTMLElements within the connectedCallback()
        const inputField = document.querySelector(".form-control") as HTMLInputElement;
        const outputTextarea = document.getElementById("ucOutputValue") as HTMLTextAreaElement;
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
        const convertBtn = document.getElementById("ucConvertBtn") as HTMLButtonElement;
        convertBtn.addEventListener("click", () => {
            const inputValue: string = inputField.value;
            const fromUnit: string = valueOneSelect.value;
            const toUnit: string = valueTwoSelect.value;

            try {
                if (checkInputLength(inputValue, ".uc-alert", ".uc-alert-message", "Please provide a value.") === false) {
                    return;
                }

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

        rucConvertBtn.addEventListener("click", () => {
            const inputValue: string = rucInputField.value;
            if (checkInputLength(inputValue, ".ruc-alert", ".ruc-alert-message", "Please provide a value.") === false) {
                return;
            }

            const rucIfParsed = parseFloat(inputValue);
            // Check if input is a number or not
            if (isNaN(rucIfParsed)) {
                this.appCalculation.displayAlert(".ruc-alert", ".ruc-alert-message", "Value must be a number.");
                return;
            }

            const rucValueOneSelect = document.getElementById("rucValueOne") as HTMLOptionElement;
            const rucValueTwoSelect = document.getElementById("rucValueTwo") as HTMLOptionElement;

            // Perform the calculation
            const convertedValue = this.universalUnitConversionFromConversionFactors(rucIfParsed, rucValueOneSelect.value, rucValueTwoSelect.value, this.staticUnitFactors.unitConversionFactors);
            const finalResult = rucOutputTextarea.value = convertedValue.toString();
        });

        // Data Storage Converter
        const datacInputField = document.querySelector(".datac-form-control") as HTMLInputElement;
        const datacOutputTextarea = document.getElementById("datacOutputValue") as HTMLTextAreaElement;
        const datacConvertBtn = document.getElementById("datacConvertBtn") as HTMLButtonElement;

        datacConvertBtn.addEventListener("click", () => {
            const inputValue: string = datacInputField.value;
            if (checkInputLength(inputValue, ".datac-alert", ".datac-alert-message", "Please provide a value") === false) {
                return;
            }

            const datacIfParsed = parseFloat(inputValue);
            if (isNaN(datacIfParsed)) {
                this.appCalculation.displayAlert(".datac-alert", ".datac-alert-message", "Value must be a number.");
                return;
            }
            const datacValueOneSelect = document.getElementById("datacValueOne") as HTMLOptionElement;
            const datacValueTwoSelect = document.getElementById("datacValueTwo") as HTMLOptionElement;

            // Perform the calculation
            const convertedValue = this.universalUnitConversionFromConversionFactors(datacIfParsed, datacValueOneSelect.value, datacValueTwoSelect.value, this.staticUnitFactors.dataStorageConversionFactors);
            const finalResult = datacOutputTextarea.value = convertedValue.toString();
        });

        // Speed Converter
        const speedInputTextarea = document.querySelector(".speed-form-control") as HTMLInputElement;
        const speedOutputTextarea = document.getElementById("speedOutputValue") as HTMLTextAreaElement;

        const speedConvertBtn = document.querySelector("#speedConvertBtn") as HTMLButtonElement;
        speedConvertBtn.addEventListener("click", () => {
            const inputValue: string = speedInputTextarea.value;
            if (checkInputLength(inputValue, ".speed-alert", ".speed-alert-message", "Please provide a value.") === false) {
                return;
            }

            const speedItParsed = parseFloat(inputValue)
            if (isNaN(speedItParsed)) {
                this.appCalculation.displayAlert(".speed-alert", ".speed-alert-message", "Value must be a number.");
                return;
            }

            const speedValueOneSelect = document.getElementById("speedValueOne") as HTMLOptionElement;
            const speedValueTwoSelect = document.getElementById("speedValueTwo") as HTMLOptionElement;

            // Perform the calculation
            const convertedValue = this.universalUnitConversionFromConversionFactors(speedItParsed, speedValueOneSelect.value, speedValueTwoSelect.value, this.staticUnitFactors.speedDataConversionFactors);
            const finalResult = speedOutputTextarea.value = convertedValue.toString();
        });

        // Time Converter
        const timeInputTextarea = document.querySelector(".time-form-control") as HTMLInputElement;
        const timeOutputTextarea = document.getElementById("timeOutputValue") as HTMLTextAreaElement;

        const timeConvertBtn = document.querySelector("#timeConvertBtn") as HTMLButtonElement;
        timeConvertBtn.addEventListener("click", () => {
            const inputValue: string = timeInputTextarea.value;
            if (checkInputLength(inputValue, ".time-alert", ".time-alert-message", "Please provide a value.") === false) {
                return;
            }

            const timeItParsed = parseFloat(inputValue)
            if (isNaN(timeItParsed)) {
                this.appCalculation.displayAlert(".time-alert", ".time-alert-message", "Value must be a number.");
                return;
            }

            const timeValueOneSelect = document.getElementById("timeValueOne") as HTMLOptionElement;
            const timeValueTwoSelect = document.getElementById("timeValueTwo") as HTMLOptionElement;

            // Perform the calculation
            const convertedValue = this.universalUnitConversionFromConversionFactors(timeItParsed, timeValueOneSelect.value, timeValueTwoSelect.value, this.staticUnitFactors.timeDataConversionFactors);
            const finalResult = timeOutputTextarea.value = convertedValue.toString();
        });

        /**
         * HELPER FUNCTIONS
         */

        const checkInputLength = (elem: string, alertDiv: string, alertMessageDiv: string, alertMessage: string): boolean => {
            if (elem.length) {
                return true;
            } else {
                this.appCalculation.displayAlert(alertDiv, alertMessageDiv, alertMessage);
                return false;
            }
        }
    }
}

customElements.define("app-converters", Converters);