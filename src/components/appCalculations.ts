import { Template } from "./helper.js";

interface BasicTemplate { [key: string]: string }

const BASIC_TEMPLATE: { [key: string]: BasicTemplate } = {
    classes: {
        ul: "app-calc-ul d-flex flex-row gap-2 align-items-center justify-content-start",
        button: "app-calc-nav-button btn btn-discovery w-100 fs-5 shadow-md rounded-3",
        componentElement: "app-calc-component-element py-2 my-2",
        calcButtons: "calc-button btn btn-primary rounded-pill fs-4 w-100 shadow-sm",
        calcButtonsExtra: "calc-keys btn btn-discovery rounded-pill fs-4 fw-medium w-100 shadow-sm"
    }
}

export class AppCalculations extends HTMLElement {
    private template: Template;
    private Ids: { [key: string]: string }

    constructor() {
        super();
        this.template = new Template();

        this.Ids = {
            basicCalculator: "basicCalculator",
            anotherPageId: "anotherPageId"
        }

        const styles = `
            @import url(/src/lib/css/fastbootstrap.css);
            @import url(/assets/css/custom.css);
        `;

        const template = this.template.createTemplate(styles, this.appCalculations());
        this.attachShadow({ mode: "open" });
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    // Render the main template
    public appCalculations(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.basicCalculator}">Basic Calculator</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.anotherPageId}">Another Page</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="basicCalculator" style="display: none;">${this.basicCalculator()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="anotherPageId" style="display: none;">${this.anotherPage()}</div>
            </div>
        `;
    }

    // Function to open corresponding data-page in DOM through buttons
    private handleNavigation() {
        const navButtons = this.shadowRoot?.querySelectorAll<HTMLButtonElement>(".app-calc-nav-button");

        if (navButtons) {
            navButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const pageName = button.getAttribute("data-page");
                    this.openPage(pageName);
                });
            });
        }
    }

    // Function to enable tab switching
    public openPage(pageName: string | null): void {
        // Hide all tab content first
        const tabcontent = Array.from(this.shadowRoot?.querySelectorAll(".app-calc-component-element") as NodeListOf<HTMLElement>);
        if (tabcontent) {
            tabcontent.forEach((content: HTMLElement) => {
                content.style.display = "none";
            });
        }

        // Remove active class from all navigation buttons next
        const tabNavigation = Array.from(this.shadowRoot?.querySelectorAll(".app-calc-nav-button") as NodeListOf<HTMLElement>)
        if (tabNavigation) {
            tabNavigation.forEach((button: HTMLElement) => {
                button.classList.remove("active");
            });
        }

        // Show the selected page based on user selection through buttons
        const blockElem = this.shadowRoot?.getElementById(pageName || "");
        if (blockElem) {
            blockElem.style.display = "block";
        } else {
            console.warn(`Element with id "${pageName}" not found.`);
        }

        // Add active class to the corresponding navigation button to display the content
        const activeButton = this.shadowRoot?.querySelector<HTMLButtonElement>('.app-calc-nav-button[data-page="' + pageName + '"]');
        if (activeButton) {
            activeButton.classList.add("active");
        } else {
            console.warn(`Button with data-page="${pageName}" not found.`);
        }
    }

    // Calculator itself
    public basicCalculator(): string {
        return `
            <div class="container d-flex flex-column gap-3">
                <div class="row justify-content-start">
                    <div class="col-6">
                    <input type="text" class="calc-output-result w-100 h-100 rounded-2 border-none fs-4 fw-medium px-1" aria-label="Calculation Results" disabled="true">
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
            </div>
        `;
    }

    public anotherPage(): string {
        return `
            <div>
                <h2>Another Content!</h2>
                <p>This is the content for the Another Content component.</p>
            </div>
        `;
    }

    private keyPressDetection() {
        document.addEventListener("keydown", (e) => {
            const keyPressed: Event | string = e.key;
            const validKeys: string = "1234567890/*-+.";
            const calcOutput: HTMLInputElement | null | undefined = this.shadowRoot?.querySelector(".calc-output-result");

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
        const calcButtons: NodeListOf<HTMLButtonElement> = this.shadowRoot!.querySelectorAll(".calc-button, .calc-keys");
        calcButtons.forEach((elem: HTMLButtonElement) => {
            const calcButtonsData = elem.getAttribute("data-value");

            if (calcButtonsData) {
                elem.addEventListener("click", () => {
                    const calcOutput = this.shadowRoot?.querySelector<HTMLInputElement>(".calc-output-result");
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
                });
            }
        });
    }

    connectedCallback() {
        this.handleNavigation(); // Set up event listeners for navigation buttons
        this.openPage("basicCalculator"); // Open the default page
        this.printData();
        this.keyPressDetection();
    }
}

customElements.define("app-calculations", AppCalculations);