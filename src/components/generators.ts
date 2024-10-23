import { Template } from "./helper.js";
import { AppCalculations } from "./appCalculations.js";

interface BasicTemplate { [key: string]: string };
interface Styles { [key: string]: string };

const BASIC_TEMPLATE: { [key: string]: BasicTemplate } = {
    classes: {
        ul: "app-calc-ul d-flex flex-row gap-2 align-items-center justify-content-start",
        button: "component-tab-nav-button btn btn-discovery w-100 fs-5 shadow-md rounded-3",
        componentElement: "component-tab-content-element py-2 my-2",
        calcButtons: "calc-button btn btn-primary rounded-pill fs-4 w-100 shadow-sm",
        calcButtonsExtra: "calc-keys btn btn-discovery rounded-pill fs-4 fw-medium w-100 shadow-sm"
    }
}

const STYLES: { [key: string]: Styles } = {
    converter: {
        div: "container row mx-0 px-0"
    }
}

export class Generators extends HTMLElement {
    private template: Template;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    constructor() {
        super();
        this.template = new Template();
        this.appCalculation = new AppCalculations();

        this.Ids = {
            loremIpsumGenerator: "loremIpsumGenerator",
            anotherPageId: "anotherPageId"
        }

        const template = this.template.createTemplate(this.generators());
        this.appendChild(template.content.cloneNode(true));
    };

    // Function to open corresponding data-page in DOM through buttons
    public handleNavigation() {
        const navButtons = document.querySelectorAll<HTMLButtonElement>(".component-tab-nav-button");

        if (navButtons) {
            navButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const pageName = button.getAttribute("data-page");
                    this.appCalculation.openPage(pageName, document);
                });
            });
        }
    }

    // Render the main template
    public generators(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.loremIpsumGenerator}">Lorem</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.anotherPageId}">Another Page</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="loremIpsumGenerator" style="display: none;">${this.loremIpsumGeneratorTemplate()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="anotherPageId" style="display: none;">${this.anotherPage()}</div>
            </div>
            `;
    }

    // Render the Lorem Ipsum Generator
    private loremIpsumGeneratorTemplate(): string {
        return `
            <div class="${STYLES.converter.div}">
                <div class="input-group mb-3 px-1">
                    <input type="number" class="form-control lorem-value" min="1" max="99" placeholder="How many lines of Lorem do you want? (1-99)" aria-label="How many lines of Lorem do you want? (1-99)" aria-describedby="generateLorem">
                    <button class="btn btn-outline-primary fs-5" type="button" id="generateLorem">Generate</button>
                </div>
                <div class="lorem-textarea d-flex flex-column align-items-start justify-content-start mb-3 px-1">
                    <textarea class="lorem-output-value w-100 form-control fs-5" id="loremOutput" title="Result" placeholder="Result" name="lorem-result"></textarea>
                </div>
                <div class="lorem-actions mb-3 px-1">
                    <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="clearLorem">Clear</button>
                </div>
            </div>
            `;
    }

    // Function to generate Lorem Ipsum with given line numbers in TypeScript
    // thanks to: https://blog.lipsumhub.com/generate-lorem-ipsum-in-js/
    private generateLorem(loremValue: number): string {
        const loremSentences: Array<string> = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        ];

        let result: string = "";
        for (let i = 0; i < loremValue; i++) {
            const randomIndex = Math.floor(Math.random() * loremSentences.length);
            result += `${loremSentences[randomIndex]} `;
        }
        return result;
    }


    private anotherPage(): string {
        return `
            <div>
                <h2>Another Content!</h2>
                <p>This is the content for the Another Content component.</p>
            </div>
        `;
    }

    connectedCallback() {
        this.handleNavigation();
        this.appCalculation.openPage("loremIpsumGenerator", document);

        // Run the generation of lorem when the extension loads in the connectedCallBack
        const generateLoremBtn = document.querySelector("#generateLorem") as HTMLButtonElement;
        const loremValue = document.querySelector(".lorem-value") as HTMLInputElement;
        const loremOutput = document.querySelector("#loremOutput") as HTMLTextAreaElement;

        generateLoremBtn.addEventListener("click", () => {
            // Check if input value is provided between acceptable parameters
            // Parse Input string to integer value
            const inputValue = parseInt(loremValue.value);
            if (isNaN(inputValue) || inputValue < 1 || inputValue > 99) {
                loremOutput.value = "Please provide a value between 1 and 99.";
            } else {
                loremOutput.value = this.generateLorem(inputValue);
            }
        });

        // Function to clear Lorem Ipsum Output textarea
        const clearLoremOutput = document.querySelector("#clearLorem") as HTMLButtonElement;
        clearLoremOutput.addEventListener("click", () => {
            loremOutput.value = "";
        });
    }

}

customElements.define("app-generators", Generators);