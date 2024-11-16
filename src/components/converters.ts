import { Template, Overflowing, BASIC_TEMPLATE } from "./helper.js";
import AppCalculations from "./appCalculations.js";

// Define conversionFactor interface for conversionFactors arg
interface ConversionFactor {
    [unit1: string]: { [unit2: string]: number };
}

export default class Converters extends HTMLElement {
    private template: Template;
    private overflowing: Overflowing;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    constructor() {
        super();
        this.template = new Template();
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
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.currencyConverter}">Currency</button></li>
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.timeZoneConverter}">Time</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="baseConverter" style="display: none;">${this.renderBaseConverter()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="unitConverter" style="display: none;">${this.renderUnitConverter()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="dataStorageConverter" style="display: none;">${this.renderDataConverterTemplate()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="speedConverter" style="display: none;">${this.renderSpeedConverter()}</div>
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
                        <button class="btn btn-discovery uc-convert-btn rounded-pill shadow-lg fs-4 mt-3" id="ucConvertBtn">Convert</button>
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
                        <div class="alerts d-flex flex-row align-content-center justify-content-between gap-2">
                            <div>
                                <button class="btn btn-discovery ruc-convert-btn rounded-pill shadow-lg fs-4 mt-3" id="rucConvertBtn">Convert</button>
                            </div>
                            <div class="d-flex flex-row align-content-center justify-content-center w-100 mt-3">
                                <div class="ruc-alert alert alert-danger transition ease-in-out duration-300 rounded-pill px-2 py-2 mb-0" role="alert" style="opacity: 0;">
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
                        <option value="Inch">Inch</option>
                        <option value="Feet">Feet</option>
                        <option value="Yard">Yard</option>
                        <option value="Mile">Mile</option>
                    </select>
                </div>
                <div class="ruc-child uc-two w-100">
                    <label for="ruc-value-two">To:</label>
                    <select class="form-select" aria-label="Second Value Select" name="ruc-value-two" id="rucValueTwo" title="Second Value">
                        <option value="Millimeter">Millimeter</option>
                        <option value="Centimeter">Centimeter</option>
                        <option value="Meter">Meter</option>
                        <option value="Kilometer">Kilometer</option>
                        <option value="Inch">Inch</option>
                        <option value="Feet">Feet</option>
                        <option value="Yard">Yard</option>
                        <option value="Mile">Mile</option>
                    </select>
                </div>
            </div>
        `;
    }
    // Define a general object to hold the unitConversion values
    private unitConversionFactors: ConversionFactor = {
        "Millimeter": {
            "Centimeter": 0.1,
            "Meter": 0.001,
            "Kilometer": 0.000001,
            "Inch": 0.0393701,
            "Feet": 0.00328084,
            "Yard": 0.00109361,
            "Mile": 6.2137e-7
        },
        "Centimeter": {
            "Millimeter": 10,
            "Meter": 0.01,
            "Kilometer": 0.00001,
            "Inch": 0.393701,
            "Feet": 0.0328084,
            "Yard": 0.0109361,
            "Mile": 6.2137e-6
        },
        "Meter": {
            "Millimeter": 1000,
            "Centimeter": 100,
            "Kilometer": 0.001,
            "Inch": 39.3701,
            "Feet": 3.28084,
            "Yard": 1.09361,
            "Mile": 0.000621371
        },
        "Kilometer": {
            "Millimeter": 1000000,
            "Centimeter": 100000,
            "Meter": 1000,
            "Inch": 39370.1,
            "Feet": 3280.84,
            "Yard": 1093.61,
            "Mile": 0.621371
        },
        "Inch": {
            "Millimeter": 25.4,
            "Centimeter": 2.54,
            "Meter": 0.0254,
            "Kilometer": 0.0000254,
            "Feet": 0.0833333,
            "Yard": 0.0277778,
            "Mile": 1.5783e-5
        },
        "Feet": {
            "Millimeter": 304.8,
            "Centimeter": 30.48,
            "Meter": 0.3048,
            "Kilometer": 0.0003048,
            "Inch": 12,
            "Yard": 0.333333,
            "Mile": 0.000189394
        },
        "Yard": {
            "Millimeter": 914.4,
            "Centimeter": 91.44,
            "Meter": 0.9144,
            "Kilometer": 0.0009144,
            "Inch": 36,
            "Feet": 3,
            "Mile": 0.000568182
        },
        "Mile": {
            "Millimeter": 1.609e+6,
            "Centimeter": 160934,
            "Meter": 1609.34,
            "Kilometer": 1.60934,
            "Inch": 63360,
            "Feet": 5280,
            "Yard": 1760
        }
    }

    // Data storage conversion values
    private dataStorageConversionFactors: ConversionFactor = {
        "Bits": {
            "Bytes": 0.125,
            "Kilobytes": 0.000125,
            "Megabytes": 0.000000125,
            "Gigabytes": 0.000000000125,
            "Terabytes": 0.000000000000125,
            "Petabytes": 0.000000000000000125
        },
        "Bytes": {
            "Bits": 8,
            "Kilobytes": 0.001,
            "Megabytes": 0.000001,
            "Gigabytes": 0.000000001,
            "Terabytes": 0.000000000001,
            "Petabytes": 0.000000000000001
        },
        "Kilobytes": {
            "Bits": 8192,
            "Bytes": 1024,
            "Megabytes": 0.001,
            "Gigabytes": 0.000001,
            "Terabytes": 0.000000001,
            "Petabytes": 0.000000000001
        },
        "Megabytes": {
            "Bits": 8388608,
            "Bytes": 1048576,
            "Kilobytes": 1024,
            "Gigabytes": 0.001,
            "Terabytes": 0.000001,
            "Petabytes": 0.000000001
        },
        "Gigabytes": {
            "Bits": 8589934592,
            "Bytes": 1073741824,
            "Kilobytes": 1048576,
            "Megabytes": 1024,
            "Terabytes": 0.001,
            "Petabytes": 0.000001
        },
        "Terabytes": {
            "Bits": 8796093022208,
            "Bytes": 1099511627776,
            "Kilobytes": 1073741824,
            "Megabytes": 1048576,
            "Gigabytes": 1024,
            "Petabytes": 0.001
        },
        "Petabytes": {
            "Bits": 9007199254740992,
            "Bytes": 1125899906842624,
            "Kilobytes": 1099511627776,
            "Megabytes": 1073741824,
            "Gigabytes": 1048576,
            "Terabytes": 1024
        }
    };

    private universalUnitConversionFromConversionFactors = (inputValue: number, from: string, to: string, conversionFactors: ConversionFactor): number => {
        if (typeof inputValue !== "number" && typeof from !== "string" && typeof to !== "string") {
            this.appCalculation.displayAlert(".ruc-alert", ".ruc-alert-message", "Input value must be a number.");
            throw new Error("Input value must be a number.");
        }

        if (!conversionFactors[from] || !conversionFactors[from][to]) {
            this.appCalculation.displayAlert(".ruc-alert", ".ruc-alert-message", "Conversion invalid.");
            throw new Error("Conversion invalid.");
        }

        // Multiply the input with corresponding "from" > "to" unit with using object keys, values
        return inputValue * conversionFactors[from][to];
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
                        <div class="alerts d-flex flex-row align-content-center justify-content-between gap-2">
                            <div>
                                <button class="btn btn-discovery datac-convert-btn rounded-pill shadow-lg fs-4 mt-3" id="datacConvertBtn">Convert</button>
                            </div>
                            <div class="d-flex flex-row align-content-center justify-content-center w-100 mt-3">
                                <div class="datac-alert alert alert-danger transition ease-in-out duration-300 rounded-pill px-2 py-2 mb-0" role="alert" style="opacity: 0;">
                                    <h6 class="datac-alert-message mb-0"></h6>
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

    private renderDataConverterOptions(): string {
        return `
            <div class="datac-selection-container d-flex flex-row align-items-center justify-content-center gap-2">
                <div class="datac-child uc-one w-100">
                    <label for="datac-value-one">From:</label>
                    <select class="form-select" aria-label="First Value Select" name="datac-value-one" id="datacValueOne" title="First Value">
                        <option value="Bits">Bits</option>
                        <option value="Bytes">Bytes</option>
                        <option value="Kilobytes">Kilobytes</option>
                        <option value="Megabytes">Megabytes</option>
                        <option value="Gigabytes">Gigabytes</option>
                        <option value="Terabytes">Terabytes</option>
                        <option value="Petabytes">Petabytes</option>
                    </select>
                </div>
                <div class="datac-child uc-two w-100">
                    <label for="datac-value-two">To:</label>
                    <select class="form-select" aria-label="Second Value Select" name="datac-value-two" id="datacValueTwo" title="Second Value">
                        <option value="Bits">Bits</option>
                        <option value="Bytes">Bytes</option>
                        <option value="Kilobytes">Kilobytes</option>
                        <option value="Megabytes">Megabytes</option>
                        <option value="Gigabytes">Gigabytes</option>
                        <option value="Terabytes">Terabytes</option>
                        <option value="Petabytes">Petabytes</option>
                    </select>
                </div>
            </div>
        `;
    }

    // Speed Converter
    private renderSpeedConverter(): string {
        return `
            Coming soon...
        `;
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
        // Handle tab overflowing & navigation buttons
        const tabMenu = document.querySelector(".converters-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".converters-ulist");

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

        rucConvertBtn.addEventListener("click", () => {
            const rucIfParsed = parseFloat(rucInputField.value);
            // Check if input is a number or not
            if (isNaN(rucIfParsed)) {
                this.appCalculation.displayAlert(".ruc-alert", ".ruc-alert-message", "Value must be a number.");
                return;
            }
            const rucValueOneSelect = document.getElementById("rucValueOne") as HTMLInputElement;
            const rucValueTwoSelect = document.getElementById("rucValueTwo") as HTMLInputElement;

            // Perform the calculation
            const convertedValue = this.universalUnitConversionFromConversionFactors(rucIfParsed, rucValueOneSelect.value, rucValueTwoSelect.value, this.unitConversionFactors);
            const finalResult = rucOutputTextarea.value = convertedValue.toString();
        });

        // Data Storage Converter
        const datacInputField = document.querySelector(".datac-form-control") as HTMLInputElement;
        const datacOutputTextarea = document.getElementById("datacOutputValue") as HTMLTextAreaElement;
        const datacConvertBtn = document.getElementById("datacConvertBtn") as HTMLButtonElement;

        datacConvertBtn.addEventListener("click", () => {
            const datacIfParsed = parseFloat(datacInputField.value)
            if (isNaN(datacIfParsed)) {
                this.appCalculation.displayAlert(".ruc-alert", ".ruc-alert-message", "Value must be a number.");
                return;
            }
            const datacValueOneSelect = document.getElementById("datacValueOne") as HTMLInputElement;
            const datacValueTwoSelect = document.getElementById("datacValueTwo") as HTMLInputElement;

            // Perform the calculation
            const convertedValue = this.universalUnitConversionFromConversionFactors(datacIfParsed, datacValueOneSelect.value, datacValueTwoSelect.value, this.dataStorageConversionFactors);
            const finalResult = datacOutputTextarea.value = convertedValue.toString();
        });
    }
}

customElements.define("app-converters", Converters);