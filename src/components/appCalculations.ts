import { Template } from "./helper.js";

interface BasicTemplate { [key: string]: string }

const BASIC_TEMPLATE: { [key: string]: BasicTemplate } = {
    classes: {
        ul: "app-calc-ul d-flex flex-row gap-2 align-items-center justify-content-start",
        button: "component-tab-nav-button btn btn-discovery w-100 fs-5 shadow-md rounded-3",
        componentElement: "component-tab-content-element py-2 my-2",
        calcButtons: "calc-button btn btn-primary rounded-pill fs-1 w-100 shadow-sm px-3 py-3",
        calcButtonsExtra: "calc-keys btn btn-discovery rounded-pill fs-1 fw-medium w-100 shadow-sm px-3 py-3"
    }
}

export class AppCalculations extends HTMLElement {
    private listenersSetUp: boolean = false; // Set flag for event listeners in the basicCalculator()
    private template: Template;
    private Ids: { [key: string]: string }

    constructor() {
        super();
        this.template = new Template();

        this.Ids = {
            basicCalculator: "basicCalculator",
            colorCodeCalculator: "colorCodeCalculator",
            financialCalculator: "financialCalculator"
        }

        const template = this.template.createTemplate(this.appCalculations());
        this.appendChild(template.content.cloneNode(true));
    }

    // Render the main template
    public appCalculations(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.basicCalculator}">Basic Calculator</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.colorCodeCalculator}">Color Code</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.financialCalculator}">Financial</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="basicCalculator" style="display: none;">
                    ${this.basicCalculator()}
                </div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="colorCodeCalculator" style="display: none;">
                    ${this.colorCodeCalculator()}
                </div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="financialCalculator" style="display: none;">
                    ${this.financialCalculator()}
                </div>
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
                    this.openPage(pageName, document);
                });
            });
        }
    }

    // Function to enable tab switching
    // In AppCalculations class
    public openPage(pageName: string | null, document: Document): void {
        // Hide all tab content first
        const tabcontent = Array.from(document.querySelectorAll(".component-tab-content-element") as NodeListOf<HTMLElement>);
        if (tabcontent) {
            tabcontent.forEach((content: HTMLElement) => {
                content.style.display = "none";
            });
        }

        // Remove active class from all navigation buttons next
        const tabNavigation = Array.from(document.querySelectorAll(".component-tab-nav-button") as NodeListOf<HTMLElement>)
        if (tabNavigation) {
            tabNavigation.forEach((button: HTMLElement) => {
                button.classList.remove("active");
            });
        }

        // Show the selected page based on user selection through buttons
        const blockElem = document.getElementById(pageName || "");
        if (blockElem) {
            blockElem.style.display = "block";
        } else {
            console.warn(`Element with id "${pageName}" not found.`);
        }

        // Add active class to the corresponding navigation button to display the content
        const activeButton = document.querySelector<HTMLButtonElement>('.component-tab-nav-button[data-page="' + pageName + '"]');
        if (activeButton) {
            activeButton.classList.add("active");
        } else {
            console.warn(`Button with data-page="${pageName}" not found.`);
        }
    }


    // Calculator itself
    private basicCalculator(): string {
        return `
            <section class="calculator-itself container d-flex flex-column gap-3 px-1" tabindex="0">
                <div class="row justify-content-start">
                    <div class="col-6">
                    <input type="text" class="calc-output-result w-100 h-100 rounded-2 border-opacity-25 shadow-lg fs-4 fw-medium px-1" aria-label="Calculation Results" disabled="true">
                    </div>
                    <div class="col-2">
                        <button type="button" data-value="AC" data-action="clear" class="${BASIC_TEMPLATE.classes.calcButtonsExtra}">AC</button>
                    </div>
                </div>
                <div class="d-flex flex-column gap-3">
                    <div class="row justify-content-start">
                        <div class="col-2">
                            <button type="button" data-value="7" class="${BASIC_TEMPLATE.classes.calcButtons}">7</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="8" class="${BASIC_TEMPLATE.classes.calcButtons}">8</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="9" class="${BASIC_TEMPLATE.classes.calcButtons}">9</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="/" data-action="divide" class="${BASIC_TEMPLATE.classes.calcButtonsExtra}">/</button>
                        </div>
                    </div>
                    <div class="row justify-content-start">
                        <div class="col-2">
                            <button type="button" data-value="4" class="${BASIC_TEMPLATE.classes.calcButtons}">4</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="5" class="${BASIC_TEMPLATE.classes.calcButtons}">5</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="6" class="${BASIC_TEMPLATE.classes.calcButtons}">6</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="*" data-action="multiply" class="${BASIC_TEMPLATE.classes.calcButtonsExtra}">*</button>
                        </div>
                    </div>
                    <div class="row justify-content-start">
                        <div class="col-2">
                            <button type="button" data-value="1" class="${BASIC_TEMPLATE.classes.calcButtons}">1</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="2" class="${BASIC_TEMPLATE.classes.calcButtons}">2</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="3" class="${BASIC_TEMPLATE.classes.calcButtons}">3</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="-" data-action="subtract" class="${BASIC_TEMPLATE.classes.calcButtonsExtra}">-</button>
                        </div>
                    </div>
                    <div class="row justify-content-start">
                        <div class="col-2">
                            <button type="button" data-value="0" class="${BASIC_TEMPLATE.classes.calcButtons}">0</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="." class="${BASIC_TEMPLATE.classes.calcButtons}">.</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="=" class="${BASIC_TEMPLATE.classes.calcButtonsExtra}">=</button>
                        </div>
                        <div class="col-2">
                            <button type="button" data-value="+" data-action="add" class="${BASIC_TEMPLATE.classes.calcButtonsExtra}">+</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // Color Code Calculator Template
    private colorCodeCalculator(): string {
        return `
            <section>
                <div class="container column mx-0 px-1">
                    <div class="cc-inputs input-group mb-3">
                        <span class="input-group-text" id="hexValue">HEX</span>
                        <input id="hexValueInput" type="text" class="form-control" placeholder="Hex Value" aria-label="Hex Value" aria-describedby="hexValue"/>
                    </div>
                    <div class="cc-inputs input-group mb-3">
                        <span class="input-group-text" id="rgbValue">RGB</span>
                        <input type="number" class="form-control" maxlength="255" minlength="0" placeholder="Red" aria-label="RGB Color Value: Red" aria-describedby="rgbValue"/>
                        <input type="number" class="form-control" maxlength="255" minlength="0" placeholder="Green" aria-label="RGB Color Value: Green" aria-describedby="rgbValue"/>
                        <input type="number" class="form-control" maxlength="255" minlength="0" placeholder="Blue" aria-label="RGB Color Value: Blue" aria-describedby="rgbValue"/>
                    </div>
                    <div class="cc-converter-btn mb-3 btn-group w-100">
                        <button class="btn btn-outline-primary fs-5" type="button" id="hexToRgb">HEX to RGB</button>
                        <button class="btn btn-outline-primary fs-5" type="button" id="RgbToHex">RGB to HEX</button>
                    </div>
                    <div class="color-code-button-actions d-flex flex-row align-content-start justify-content-between">
                        <div>
                            <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="copyHex">Copy HEX Value</button>
                            <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="copyRgb">Copy RGB Value</button>
                        </div>
                        <div>
                            <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="clearColorBoth">Clear</button>
                        </div>
                    </div>
                    <div class="alerts d-flex flex-row align-content-center justify-content-between">
                        <div class="color-code-alert alert alert-danger transition ease-in-out duration-300 mt-3 rounded-pill" role="alert" style="opacity: 0;">
                            <h6 class="color-code-alert-message mb-0"></h6>
                        </div>
                        <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-3 rounded-pill" role="alert" style="opacity: 0;">
                            <h6 class="mb-0">Copied to clipboard.</h6>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // Financial Calculator
    private financialCalculator(): string {
        return `
            <section>
                <div class="container row mx-0 px-0 gx-2">
                    <div class="col-6 px-0">
                        <div>
                            <h3 class="bg-success-subtle px-1 py-1 rounded-4 text-center pe-none">Inflation Calculator</h3>
                        </div>
                        <div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">₺ or $</span>
                                <input id="infRateOne" type="number" class="form-control" min="1" aria-label="Kıyaslanacak Fiyat" placeholder="First Price"/>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">₺ or $</span>
                                <input id="infRateTwo" type="number" class="form-control" min="1" aria-label="Güncel Fiyat"/ placeholder="Second Price">
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">%</span>
                                <input id="infRateActual" type="number" class="form-control" min="1" aria-label="Enflasyon Oranı" placeholder="Inflation Rate"/>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">Output:</span>
                                <input id="infRateOutput" class="form-control" type="number" aria-label="Inflation Calculation Output" readonly/>
                            </div>
                            <div>
                                <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="calcInf">Calculate</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 px-0">
                        <div>
                            <h3 class="bg-success-subtle px-1 py-1 rounded-4 text-center pe-none">Interest Calculator</h3>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // Function to perform the inflation calculation
    private inflationCalculation(prevPrice: number, currPrice: number, infRate: number): number {
        // First check if previous price is acceptable
        if (prevPrice <= 1) {
            throw new Error(`Previous price must be bigger than "zero (0)".`);
        }
        // Check if inflation rate is acceptable
        if (infRate <= 0) {
            throw new Error(`Inflation rate must be bigger than "zero (0)".`)
        }

        // Actual calculation
        // ((T – B) / B) x 100
        const infRateCalculation: number = ((currPrice - prevPrice) / prevPrice) * 100;
        const adjustedRate: number = infRateCalculation - infRate;

        return adjustedRate;
    }

    // Function to detect hex value from given inputs' value
    private detectHexValue(target: HTMLInputElement): boolean {
        const targetValue: string = target.value;
        // Check if target value is string or not first
        if (typeof targetValue !== "string" || targetValue.trim() === "") {
            return false;
        }
        // Define regex data to hold hex value to be later used
        const hexRegex: RegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        // Return a bool with .test if target is hex or not
        if (hexRegex.test(targetValue) === true) {
            return hexRegex.test(targetValue);
        } else {
            console.error("Value is not HEX");
            return false;
        }
    }

    private detectRgbValue(r: HTMLInputElement, g: HTMLInputElement, b: HTMLInputElement): boolean {
        // Check if inputs are populated, if not, do not proceed
        if (!r.value || !g.value || !b.value) {
            return false;
        }

        // Parse inputs as integers
        const rValue: number = parseInt(r.value);
        const gValue: number = parseInt(g.value);
        const bValue: number = parseInt(b.value);

        // Check if values are numbers or not
        if (isNaN(rValue) || isNaN(gValue) || isNaN(bValue)) {
            return false;
        }

        // Check if these values are valid RGB codes
        if (rValue < 0 || rValue > 255 || gValue < 0 || gValue > 255 || bValue < 0 || bValue > 255) {
            return false;
        }

        // Ensure that the numbers in each input are maxed at three digits
        // using padStart, which defines max length of an output
        // https://www.codecademy.com/resources/docs/javascript/strings/padStart
        r.value = rValue.toString().padStart(3, "0");
        g.value = gValue.toString().padStart(3, "0");
        b.value = bValue.toString().padStart(3, "0");

        console.log(r.value, g.value, b.value);

        return true;
    }

    // Function to convert HEX(ademical) code to RGB values
    private convertToRgbFromHex(hexValue: any): Array<number> {
        let hexRgbArray: string[] | null = hexValue.slice(1).match(/.{1,2}/g);
        if (!hexRgbArray) {
            throw new Error("Invalid hex color code");
        }

        // Convert Hexademical value to Decimal with base 16
        let rgbOutput: Array<number> = [
            parseInt(hexRgbArray[0], 16),
            parseInt(hexRgbArray[1], 16),
            parseInt(hexRgbArray[2], 16)
        ];
        this.getIndex(rgbOutput);
        return rgbOutput;
    }

    // Function to convert RGB value to HEX value
    // thanks: https://stackoverflow.com/a/39040285
    private componentToHex(elem: any) {
        let hex: string = elem.toString(16);
        // Add single digit to prevent a missing digit from Hex value
        // to make sure the resulting string is always two characters long
        return hex.length == 1 ? "0" + hex : hex;
    }

    private rgbToHex(r: number, g: number, b: number, target: HTMLInputElement): string {
        return target.value = this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    // Function to detect keypress events and do things
    private keyPressDetection(): void {
        const calculatorDiv = document.querySelector(".calculator-itself") as HTMLElement;
        calculatorDiv.addEventListener("keydown", (e) => {
            const keyPressed: Event | string = e.key;
            const validKeys: string = "1234567890/*-+.";
            const calcOutput = document.querySelector(".calc-output-result") as HTMLInputElement;

            if (calcOutput) {
                if (keyPressed === "Enter") {
                    const result = this.calculate(calcOutput.value);
                    calcOutput.value = result !== null ? result.toString() : "Error";
                } else if (keyPressed === "Escape") {
                    calcOutput.value = "";
                } else if (validKeys.includes(keyPressed)) {
                    calcOutput.value += keyPressed;
                } else if (keyPressed === "Delete") {
                    calcOutput.value = "";
                }
            }
        });
    }

    private calculate(expression: string): number | null {
        const numbers: number[] = [];
        const operators: string[] = [];
        let currentNum: string = "";

        // Perform the operation locally instead of using mathjs
        const applyOperator = (a: number, b: number, operator: string) => {
            switch (operator) {
                case "+": return a + b;
                case "-": return a - b;
                case "*": return a * b;
                case "/":
                    if (b !== 0) return a / b;
                    alert("Division by zero.");
                    return null;
                default: return null;
            }
        };

        for (let char of expression) {
            // Use regex to detect the numerical value in the string (AI)
            if (/\d/.test(char) || char === ".") {
                currentNum += char;
            } else if (["+", "-", "*", "/"].includes(char)) {
                if (currentNum) {
                    numbers.push(Number(currentNum));
                    currentNum = "";
                }
                operators.push(char);
            }
        }

        if (currentNum) {
            numbers.push(Number(currentNum));
        }

        let result: number | null = numbers[0];

        // Get the corresponding operator to perform the calculation
        for (let i = 0; i < operators.length; i++) {
            const operator = operators[i];
            const nextNum = numbers[i + 1];

            result = applyOperator(result, nextNum, operator);
            if (result === null) {
                return null; // Handle the division by zero
            }
        }

        return result;
    }

    // Update the printData method to include the "=" button functionality
    private printData() {
        const calcButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".calc-button, .calc-keys");
        calcButtons.forEach((elem: HTMLButtonElement) => {
            const calcButtonsData = elem.getAttribute("data-value");

            if (calcButtonsData) {
                const handleClick = () => {
                    const calcOutput = document.querySelector(".calc-output-result") as HTMLInputElement;
                    if (calcOutput) {
                        if (calcButtonsData === "=") {
                            const result = this.calculate(calcOutput.value);
                            calcOutput.value = result !== null ? result.toString() : "Error";
                        } else if (calcButtonsData === "AC") {
                            calcOutput.value = ""; // Clear the output on AC
                        } else {
                            calcOutput.value += calcButtonsData; // Append the button value to the output
                        }
                    }
                };

                elem.addEventListener("click", handleClick);
            }
        });
    }

    /**
     * HELPER FUNCTIONS
     */

    // Get the index numbers & values of the Hex value
    private getIndex = (array: Array<number>): void => {
        const [r, g, b]: Array<number> = array;
        this.processRgbValues(r, g, b);
    }

    // Console.log them
    private processRgbValues = (r: number, g: number, b: number): void => {
        const rInput = document.querySelector(`input[placeholder="Red"]`) as HTMLInputElement;
        const gInput = document.querySelector(`input[placeholder="Green"]`) as HTMLInputElement;
        const bInput = document.querySelector(`input[placeholder="Blue"]`) as HTMLInputElement;

        // Stringify the input & add the desired length to it
        if (rInput && gInput && bInput) {
            rInput.value = r.toString().padStart(3, "0");
            gInput.value = g.toString().padStart(3, "0");
            bInput.value = b.toString().padStart(3, "0");
        }
    }


    // Function to display alert message if inputs are empty
    private displayAlert = (message: string) => {
        const colorCodeAlertDiv = document.querySelector(".color-code-alert") as HTMLDivElement;
        const colorCodeAlertDivMessage = document.querySelector(".color-code-alert-message") as HTMLHeadingElement;
        colorCodeAlertDiv.style.opacity = "1";
        colorCodeAlertDivMessage.textContent = message;
        setTimeout(() => {
            colorCodeAlertDiv.style.opacity = "0";
        }, 2000);
    }

    connectedCallback() {
        // Check event listener for basicCalculator components to prevent
        // duplicatation leading to addition of multiple inputs to .calc-output-result
        if (!this.listenersSetUp) {
            this.handleNavigation(); // Set up event listeners for navigation buttons
            this.openPage("basicCalculator", document);
            this.printData();
            this.keyPressDetection();
            this.listenersSetUp = true;
        }

        /**
         * CLASS ACTIONS ARE CALLED HERE
         */

        const getHex = document.querySelector("#hexToRgb") as HTMLButtonElement;
        const inp = document.querySelector("#hexValueInput") as HTMLInputElement;
        let numberSign = "#";

        // Add the "#" symbol when first clicked into the input section
        inp.addEventListener("click", function () {
            if (!inp.value.includes(numberSign)) {
                inp.value = numberSign + inp.value;
            }
        });

        // Trigger the removal of "#" symbol if user pastes a HEX code starting with it
        inp.addEventListener("paste", function (e) {
            setTimeout(function () {
                // Check if string starts with "#"
                if (inp.value.startsWith(numberSign + numberSign)) {
                    // Extract the "#" using subString method
                    inp.value = inp.value.substring(1);
                }
            }, 0);
        });

        // Listen for conversion to RGB from HEX
        getHex.addEventListener("click", () => {
            if (!this.detectHexValue(inp)) {
                this.displayAlert("Uncomplete HEX value detected (min. 6 digits).");
            } else {
                const rgbArray = this.convertToRgbFromHex(inp.value);
                if (rgbArray) {
                    this.getIndex(rgbArray);
                }
            }
        });

        // Define RGB input elements
        const r = document.querySelector(`input[placeholder="Red"]`) as HTMLInputElement;
        const g = document.querySelector(`input[placeholder="Green"]`) as HTMLInputElement;
        const b = document.querySelector(`input[placeholder="Blue"]`) as HTMLInputElement;

        const getRgb = document.querySelector("#RgbToHex") as HTMLButtonElement;
        getRgb.addEventListener("click", () => {
            if (r && g && b) {
                if (!r.value || !g.value || !b.value) {
                    this.displayAlert("Please provide a value!");
                } else {
                    // Parse the string to integer to make it viable as an input for
                    // rgbToHex function
                    const rValue = parseInt(r.value);
                    const gValue = parseInt(g.value);
                    const bValue = parseInt(b.value);
                    if (isNaN(rValue) || isNaN(gValue) || isNaN(bValue)) {
                        this.displayAlert("Invalid RGB values");
                    } else {
                        this.rgbToHex(rValue, gValue, bValue, inp);
                    }
                }
            } else {
                console.error("One or more color input elements has not been found.");
            }
        });

        const clearColorCodes = document.querySelector("#clearColorBoth") as HTMLButtonElement;
        clearColorCodes.addEventListener("click", function () {
            clearInput(inp);
            const inputDivs = document.querySelectorAll(`input[aria-describedby="rgbValue"]`) as NodeListOf<HTMLInputElement>;
            inputDivs.forEach((x) => {
                clearInput(x);
            });
        });

        const clearInput = (elem: HTMLInputElement) => {
            elem.value = "";
        };

        // Hex Value copying
        const copyHexBtn = document.querySelector("#copyHex") as HTMLButtonElement;
        copyHexBtn.addEventListener("click", () => {
            const inputValueLength: string = inp.value;
            if (inputValueLength.length === 0) {
                this.displayAlert("Please provide an HEX value.");
            }

            const valueAdjusted = numberSign + inp.value;
            if (inp.value && !inp.value.startsWith(numberSign)) {
                navigator.clipboard.writeText(valueAdjusted).then(() => {
                    const displaySuccess = document.querySelector(".color-code-success") as HTMLElement;
                    displaySuccess.style.opacity = "1";
                    setTimeout(() => {
                        displaySuccess.style.opacity = "0";
                    }, 2000);
                });
            } else if (inp.value.startsWith(numberSign)) {
                navigator.clipboard.writeText(inp.value).then(() => {
                    const displaySuccess = document.querySelector(".color-code-success") as HTMLElement;
                    displaySuccess.style.opacity = "1";
                    setTimeout(() => {
                        displaySuccess.style.opacity = "0";
                    }, 2000);
                });
            }
        });

        // Inflation calculation
        const infCalculatorBtn = document.querySelector("#calcInf") as HTMLButtonElement;
        infCalculatorBtn.addEventListener("click", () => {
            const firstVal = document.querySelector("#infRateOne") as HTMLInputElement;
            const secondVal = document.querySelector("#infRateTwo") as HTMLInputElement;
            const infRate = document.querySelector("#infRateActual") as HTMLInputElement;
            const infRateOutput = document.querySelector("#infRateOutput") as HTMLInputElement;

            const result = this.inflationCalculation(parseFloat(firstVal.value), parseFloat(secondVal.value), parseFloat(infRate.value))
            infRateOutput.value = result.toString();
        });
    }
}

customElements.define("app-calculations", AppCalculations);