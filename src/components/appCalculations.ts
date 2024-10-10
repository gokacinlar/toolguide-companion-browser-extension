import { Template } from "./helper.js";
import { create, all } from 'mathjs'; // Import Math.js

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
    private math: any;

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
                    <input type="text" class="calc-output-result w-100 h-100 rounded-2 border-none" aria-label="Calculation Results" disabled="true">
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
                            <button type="button" data-value="-" data-action"subtract" class="${BASIC_TEMPLATE.classes.calcButtonsExtra}">-</button>
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
            const keyPressed = e.key;
            const validKeys = "123456789/*-+";
            if (!validKeys.includes(keyPressed)) {
                e.preventDefault();
            } else {
                const calcOutput = this.shadowRoot?.querySelector<HTMLInputElement>(".calc-output-result");
                if (calcOutput) {
                    calcOutput.value += keyPressed; // Append the keyPressed instead of the event
                }
            }
        });
    }

    private calculate() {
        const calcOutput = this.shadowRoot?.querySelector<HTMLInputElement>(".calc-output-result");
        if (calcOutput) {
            try {
                // Use Math.js to evaluate the expression in the output field
                // Fixme
                const result = this.math.evaluate(calcOutput.value);
                calcOutput.value = result.toString();
            } catch (error) {
                console.error("Error evaluating expression:", error);
                calcOutput.value = "Calculation Error";
            }
        }
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
                            this.calculate(); // Call calculate when "=" is pressed
                        } else {
                            calcOutput.value += calcButtonsData; // Append the button value to the output
                        }
                    }
                });
            }
        });
    }

    // Use connectedCallback to manage tab switching
    connectedCallback() {
        this.handleNavigation(); // Set up event listeners for navigation buttons
        this.openPage("basicCalculator"); // Open the default page
        this.printData();
        this.keyPressDetection();
    }
}

customElements.define("app-calculations", AppCalculations);
