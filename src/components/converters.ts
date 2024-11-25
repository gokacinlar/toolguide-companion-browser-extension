import { Template, Overflowing, JSONDataFetching, BASIC_TEMPLATE } from "./helper.js";
import { UnitFactors, ConversionValues, Currencies } from "../static.js";
import AppCalculations from "./appCalculations.js";
import type * as Types from '../types.js';

export default class Converters extends HTMLElement {
    private template: Template;
    private getJson: JSONDataFetching;
    private staticUnitFactors: UnitFactors;
    private staticConversionValues: ConversionValues;
    private staticCurrencyValues: Currencies;
    private overflowing: Overflowing;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    constructor() {
        super();
        this.template = new Template();
        this.getJson = new JSONDataFetching();
        this.staticUnitFactors = new UnitFactors();
        this.staticConversionValues = new ConversionValues();
        this.staticCurrencyValues = new Currencies();
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
            <section class="overflowing-content">
                <div id="currencyBase" class="d-flex flex-row align-items-center justify-content-between">
                    <div>
                        <h4 class="bg-discovery-subtle px-2 py-2 rounded-pill shadow-sm">1 (one) US dollar equals</h4>
                    </div>
                    <div class="currency-refresh-and-source">
                        <h4 class="bg-discovery-subtle px-0 py-0 ps-2 rounded-pill d-flex flex-row align-items-center justify-content-center gap-1 shadow-sm">
                            <span>Last updated</span>
                            <span id="currencyDateUpdated" class="bg-secondary-subtle px-2 py-2 rounded-pill"></span>
                        </h4>
                    </div>
                </div>
                <div id="currencyList" class="shadow-sm border border-1 border-secondary-subtle mt-1 rounded-1 pe-none">
                    <ul class="list-group d-flex flex-row align-items-center justify-content-between px-0 py-0">
                        <li class="list-group-item currency-list-item cli-eur d-flex flex-column align-items-center justify-content-between gap-2">
                            <img src="/images/icons/flags/eu.svg" class="img-fluid currency-flag-icon border border-1 border-secondary-subtle"
                            title="Euro">
                            <span class="cli-display-eur"></span>
                        </li>
                        <li class="list-group-item currency-list-item cli-gbp d-flex flex-column align-items-center justify-content-between gap-2">
                            <img src="/images/icons/flags/gb.svg" class="img-fluid currency-flag-icon border border-1 border-secondary-subtle"
                            title="British Pound">
                            <span class="cli-display-gbp"></span>
                        </li>
                        <li class="list-group-item currency-list-item cli-cad d-flex flex-column align-items-center justify-content-between gap-2">
                            <img src="/images/icons/flags/ca.svg" class="img-fluid currency-flag-icon border border-1 border-secondary-subtle"
                            title="Canadian Dollar">
                            <span class="cli-display-cad"></span>
                        </li>
                        <li class="list-group-item currency-list-item cli-aud d-flex flex-column align-items-center justify-content-between gap-2">
                            <img src="/images/icons/flags/au.svg" class="img-fluid currency-flag-icon border border-1 border-secondary-subtle"
                            title="Australian Dollar">
                            <span class="cli-display-aud"></span>
                        </li>
                        <li class="list-group-item currency-list-item cli-chf d-flex flex-column align-items-center justify-content-between gap-2">
                            <img src="/images/icons/flags/ch.svg" class="img-fluid currency-flag-icon border border-1 border-secondary-subtle"
                            title="Swiss Franc">
                            <span class="cli-display-chf"></span>
                        </li>
                        <li class="list-group-item currency-list-item cli-jpy d-flex flex-column align-items-center justify-content-between gap-2">
                            <img src="/images/icons/flags/jp.svg" class="img-fluid currency-flag-icon border border-1 border-secondary-subtle"
                            title="Japanese Yen">
                            <span class="cli-display-jpy"></span>
                        </li>
                        <li class="list-group-item currency-list-item cli-cny d-flex flex-column align-items-center justify-content-between gap-2">
                            <img src="/images/icons/flags/cn.svg" class="img-fluid currency-flag-icon border border-1 border-secondary-subtle"
                            title="Chinese Yuan">
                            <span class="cli-display-cny"></span>
                        </li>
                        <li class="list-group-item currency-list-item cli-rub d-flex flex-column align-items-center justify-content-between gap-2">
                            <img src="/images/icons/flags/ru.svg" class="img-fluid currency-flag-icon border border-1 border-secondary-subtle"
                            title="Russian Ruble">
                            <span class="cli-display-rub"></span>
                        </li>
                        <li class="list-group-item currency-list-item cli-try d-flex flex-column align-items-center justify-content-between gap-2">
                            <img src="/images/icons/flags/tr.svg" class="img-fluid currency-flag-icon border border-1 border-secondary-subtle"
                            title="Turkish Lira">
                            <span class="cli-display-try"></span>
                        </li>
                    </ul>
                </div>
                <div>
                    <div class="currency-inputs input-group mt-2 mb-2">
                        <span class="input-group-text" id="currencyConversionInput">Input</span>
                        <input type="text" class="form-control currency-form-control" placeholder="Type here..." aria-label="Type Input" aria-describedby="currencyConversionInput"/>
                    </div>
                </div>
                <div id="currencySelectionConversion" class="d-flex flex-column align-items-start justify-content-center mt-2">
                    <label for="cli-select">Please select currencies for conversion:</label>
                    <div class="currency-select-inputs w-100 d-flex flex-row gap-2 align-items-center justify-content-center" name="cli-select">
                        <select class="form-select currency-form-select" aria-label="Currency Value One" id="selectCurrencyOne">
                        </select>
                        <select class="form-select currency-form-select" aria-label="Currency Value Two" id="selectCurrencyTwo">
                        </select>
                    </div>
                </div>
                <div class="currency-display d-flex flex-column align-items-start justify-content-start mb-3">
                    <label for="currencyOutputValue" class="form-label">Results will appear below.</label>
                    <textarea class="currency-output-value w-100 form-control fs-3" id="currencyOutputValue" title="Result" placeholder="Result" name="result" readonly></textarea>
                    ${this.generateAlerts("currencyConvertBtn", "currency-alert", "currency-alert-message")}
                </div>
            </section>
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

    // Get and append the currencies to be shown in the Currency tab
    private getCurrencyData = async (data: string): Promise<Record<string, number>> => {
        const fetchedData = await this.getJson.getJson(data);
        // API returns EUR-based data, so we convert it to represent a USD-based data
        // for more universally reliable currency representation
        const usdBasedCurrencyData = await this.convertEurToUsd(fetchedData.eur);
        // Add additional error handling
        if (!usdBasedCurrencyData || Object.keys(usdBasedCurrencyData).length === 0) {
            console.error("USD-based currency data is empty or invalid.");
        }

        return usdBasedCurrencyData;
    };

    // Get the API date
    private getCurrencyDataDate = async (data: string): Promise<Object> => {
        const fetchedData = await this.getJson.getJson(data);
        return fetchedData.date;
    }

    // First convert the EUR-based data to be USD-based to be comparable as a more universal currency
    private convertEurToUsd = async (eurBasedData: Record<string, number>): Promise<Record<string, number>> => {
        // Extract the EUR to USD conversion rate first
        const eurToUsdRate: number = eurBasedData.usd;
        // Create a new object to store USD-based data
        const usdBasedData: Record<string, number> = {};

        // Iterate through the keys of the EUR-based data and convert to USD
        Object.keys(eurBasedData).forEach((currency) => {
            // Exclude EUR itself, as it's the default currency in the first API data
            if (currency !== "eur") {
                usdBasedData[currency.toUpperCase()] = eurBasedData[currency] / eurToUsdRate;
            }
        });

        // Add USD to the new object with a base value of 1
        usdBasedData.USD = 1;

        return usdBasedData;
    };

    // Add the currency values to be represented in the DOM
    private appendCurrencies = async (data: string): Promise<void> => {
        const fetchedData: Record<string, number> = await this.getCurrencyData(data); // Proper type

        // Target currency span mappings
        const currencyMap: Record<string, string> = {
            eur: "cli-display-eur",
            gbp: "cli-display-gbp",
            cad: "cli-display-cad",
            aud: "cli-display-aud",
            chf: "cli-display-chf",
            jpy: "cli-display-jpy",
            cny: "cli-display-cny",
            rub: "cli-display-rub",
            try: "cli-display-try",
        };

        // Iterate over currencyMap to dynamically append data into our #currencyList
        Object.keys(currencyMap).forEach((currency) => {
            const className: string = currencyMap[currency];
            const targetElement = document.querySelector(`.${className}`) as HTMLUListElement;

            try {
                const currencyValue = fetchedData[currency.toUpperCase()]; // Uppercase for UI clarity
                if (!currencyValue) {
                    console.warn(`Currency value for ${currency.toUpperCase()} not found.`);
                }

                // Additional check if we got the data right in the process
                if (currencyValue !== undefined) {
                    targetElement.textContent = currencyValue.toFixed(2);
                } else {
                    targetElement.textContent = "N/A"; // Show N/A to represent data is missing
                }
            } catch (error) {
                console.error("Error fetching currency data", error);
            }
        });
    };

    // Function to generate currency selections for conversions from array data
    private generateCurrencyOptionsForConversion(arr: Array<string>, target: NodeListOf<HTMLSelectElement>, currencyData: Record<string, number>): void {
        // Extract currency codes from the array to be appended to our <option> elements' values accordingly
        const currencyCodes = arr.map((elem) => elem.split(" - ")[0]); // Split by " - " to get the value after currency code
        const currencyCodesAlt = arr.map((elem) => elem.split(" - ")[1]);
        // Create the option elements and append the currency values accordingly
        currencyCodes.forEach((shortName, longName) => {
            const currencyFullName = currencyCodesAlt[longName]; // Get the corresponding full name of the currency
            const currencyValue = currencyData[shortName]; // Get the corresponidng short name of the currency
            // Format the option text with "CurrencyName (value)" or "N/A"
            const optionText = currencyValue !== undefined ? `${shortName} (${currencyValue.toFixed(2)})` : `${shortName} (N/A)`;

            // Append the option to all target select elements
            target.forEach((selectElem) => {
                const optionElem: HTMLOptionElement = document.createElement("option");
                optionElem.textContent = optionText;
                optionElem.setAttribute("value", shortName);
                optionElem.setAttribute("title", currencyFullName); // Set the title to the full name
                selectElem.appendChild(optionElem);
            });
        });
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

        // Currency Converter
        // Represent the most used currency datas first
        const currencyApiData: string = "https://latest.currency-api.pages.dev/v1/currencies/eur.json";

        this.appendCurrencies(currencyApiData);
        // Append the "date" data with .then syntax, otherwise it returns a "Promise" in console
        this.getCurrencyDataDate(currencyApiData).then((date) => {
            const currencyDateUpdateElement = document.querySelector("#currencyDateUpdated") as HTMLSpanElement;
            // Additional error handling
            if (!currencyDateUpdateElement || typeof date !== "string") {
                console.error("Date element or date format is invalid.");
                return;
            }

            currencyDateUpdateElement.textContent = date.toString();
        }).catch((error) => {
            console.error("Error fetching currency data date:", error);
        });

        const currencyValuesArray: Array<string> = this.staticCurrencyValues.currencyValues;
        const selectCurrencyElem = document.querySelectorAll(".currency-select-inputs > select") as NodeListOf<HTMLSelectElement>;
        // Generate the <option> elements for select input to represent currency data to be later converted
        this.getCurrencyData(currencyApiData).then((currencyData: Record<string, number>) => {
            this.generateCurrencyOptionsForConversion(currencyValuesArray, selectCurrencyElem, currencyData);
        }).catch((error) => {
            console.error("Error receiving data from API:", error);
        });

        const checkAndResetCurrencyOne = (str: string): number[] => {
            // Regex to match patterns inside our option elements' currency data
            // of >> () <<
            const regex: RegExp = /\(([^()]*)\)/g
            // Get all currency value patterns inside parentheses defined by regex
            const matches: Array<string> = Array.from(str.matchAll(regex), m => m[1]);

            if (matches.length === 0 || !matches) {
                throw new Error(`Faulty string: no matches found in "${str}".`)
            }

            // Return the content inside parentheses after parsing it as a floating point number
            // for conversion between select currency elems
            return matches.map((elem: string) => {
                const result: number = parseFloat(elem);
                if (isNaN(result)) {
                    throw new Error(`Invalid number: "${elem}"`);
                } else {
                    return result;
                }
            });
        };

        const currencyConvertBtn = document.querySelector("#currencyConvertBtn") as HTMLButtonElement;
        currencyConvertBtn.addEventListener("click", () => {
            const selectCurrencyOne = document.querySelector("#selectCurrencyOne") as HTMLSelectElement;
            const selectCurrencyTwo = document.querySelector("#selectCurrencyTwo") as HTMLSelectElement;

            // Get selected options from both dropdowns
            const selectedOptionOne = selectCurrencyOne.options[selectCurrencyOne.selectedIndex];
            const selectedOptionTwo = selectCurrencyTwo.options[selectCurrencyTwo.selectedIndex];

            try {
                // Get the user input, output & parse it as a floating point number
                const userInp = document.querySelector(".currency-inputs > input") as HTMLInputElement;
                const userInpFormatted: number = parseFloat(userInp.value);
                const userOutput = document.querySelector(".currency-output-value") as HTMLTextAreaElement;

                if (userInp.value.trim().length === 0) {
                    this.appCalculation.displayAlert(".currency-alert", ".currency-alert-message", "Please provide a value.");
                    userOutput.value = "";
                    return console.error("Please provide a value.");
                } else if (isNaN(userInpFormatted)) {
                    this.appCalculation.displayAlert(".currency-alert", ".currency-alert-message", "Value must be a number.");
                    return console.error("Value must be a number.");
                } else {
                    // Extract numeric values for conversion
                    const valueOne = checkAndResetCurrencyOne(selectedOptionOne.textContent || "");
                    const valueTwo = checkAndResetCurrencyOne(selectedOptionTwo.textContent || "");

                    // Perform the conversion with first indexes of the selected input
                    // User Input / Base * Exchange Rate
                    const conversion: number = userInpFormatted / valueOne[0] * valueTwo[0];
                    const result: string = `${userInpFormatted} ${selectedOptionOne.title} equals ${conversion.toFixed(2)} ${selectedOptionTwo.title}`
                    userOutput.textContent = result;

                    return userOutput;
                }
            } catch (error) {
                console.error("Error during currency conversion:", error);
            }
        });
    }
}

customElements.define("app-converters", Converters);