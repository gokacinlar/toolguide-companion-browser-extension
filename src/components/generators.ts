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
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.anotherPageId}">Password</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="loremIpsumGenerator" style="display: none;">${this.loremIpsumGeneratorTemplate()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="anotherPageId" style="display: none;">${this.generatePasswordTemplate()}</div>
            </div>
            `;
    }

    // Render the Lorem Ipsum Generator
    private loremIpsumGeneratorTemplate(): string {
        return `
            <section class="${STYLES.converter.div}">
                <div class="input-group mb-3 px-1">
                    <input type="number" class="form-control lorem-value" min="1" max="99" placeholder="How many lines of Lorem do you want? (1-99)" aria-label="How many lines of Lorem do you want? (1-99)" aria-describedby="generateLorem">
                    <button class="btn btn-outline-primary fs-5" type="button" id="generateLorem">Generate</button>
                </div>
                <div class="lorem-textarea d-flex flex-column align-items-start justify-content-start mb-3 px-1">
                    <textarea class="lorem-output-value w-100 form-control fs-5" id="loremOutput" title="Result" placeholder="Result" name="lorem-result" readonly></textarea>
                </div>
                <div class="lorem-actions mb-3 px-1 d-flex flex-row align-content-start justify-content-between gap-2">
                    <div class="lorem-button-actions">
                        <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="copyLorem">Copy</button>
                        <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="clearLorem">Clear</button>
                    </div>
                    <div class="lorem-copied-alert alert alert-success transition ease-in-out duration-300 rounded-pill py-2" role="alert" style="opacity: 0;">
                        <div class="d-flex">
                            <div>
                                Copied to clipboard.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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

    // Render password generator content
    private generatePasswordTemplate(): string {
        return `
            <section>
                <div id="gpControls">
                    <div class="btn-group container column mx-0 px-1 d-flex flex-row align-content-center justify-content-between">
                        <div class="shadow-lg">
                            <input type="checkbox" class="btn-check" id="btn-check" autocomplete="off" checked/>
                            <label class="btn btn-primary fw-medium fs-5" for="btn-check">Lowercase</label>
                        </div>
                        <div class="shadow-lg">
                            <input type="checkbox" class="btn-check" id="btn-check2" autocomplete="off"/>
                            <label class="btn btn-primary fw-medium fs-5" for="btn-check2">Uppercase</label>
                        </div>
                        <div class="shadow-lg">
                            <input type="checkbox" class="btn-check" id="btn-check3" autocomplete="off"/>
                            <label class="btn btn-primary fw-medium fs-5" for="btn-check3">Digits</label>
                        </div>
                        <div class="shadow-lg">
                            <input type="checkbox" class="btn-check" id="btn-check4" autocomplete="off"/>
                            <label class="btn btn-primary fw-medium fs-5" for="btn-check4">Special Characters</label>
                        </div>
                    </div£>
                </div>
                <div>
                    <div class="input-group mb-3 mt-3 px-1">
                        <input type="number" class="form-control password-value" min="1" max="99" placeholder="Password length (1-99)" aria-label="Password length (1-99)" aria-describedby="generatePassword">
                        <button class="btn btn-outline-primary fs-5" type="button" id="generatePassword">Generate</button>
                    </div>
                </div>
                <div>
                    <div class="password-textarea d-flex flex-column align-items-start justify-content-start mb-3 mt-3 px-1">
                        <textarea class="password-output-value w-100 form-control fs-5" id="passwordOutput" title="Result" placeholder="Result" name="password-result" readonly></textarea>
                    </div>
                </div>
                <div class="password-button-actions mb-3 px-1 d-flex flex-row align-content-start justify-content-between gap-2">
                    <div class=""password-button-actions>
                        <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="copyPassword">Copy</button>
                        <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="clearPassword">Clear</button>
                    </div>
                    <div class="copied-alert alert alert-success transition ease-in-out duration-300 rounded-pill py-2" role="alert" style="opacity: 0;">
                        <div class="d-flex">
                            <div>
                                Copied to clipboard.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // Function to generate password
    private generatePassword() {
        // Define passwordLength
        const passwordLengthInput = document.querySelector(".password-value") as HTMLInputElement;
        let passwordLength: number = parseInt(passwordLengthInput.value);

        // Define passwordContent
        const passwordValues: { [key: string]: string } = {
            "lowercase": "abcdefghijklmnopqrstuvwxyz",
            "uppercase": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "numbers": "1234567890",
            "specialCharacters": "!@#$%^&*"
        };

        // Get the selected options from password generation template
        const lowercaseCheckbox = document.querySelector("#btn-check") as HTMLInputElement;
        const uppercaseCheckbox = document.querySelector("#btn-check2") as HTMLInputElement;
        const numbersCheckbox = document.querySelector("#btn-check3") as HTMLInputElement;
        const specialCharactersCheckbox = document.querySelector("#btn-check4") as HTMLInputElement;

        let passwordContent: string = "";

        // Add the conditions of user selected inputs according to passwordValues
        if (lowercaseCheckbox.checked) {
            passwordContent += passwordValues["lowercase"];
        }
        if (uppercaseCheckbox.checked) {
            passwordContent += passwordValues["uppercase"];
        }
        if (numbersCheckbox.checked) {
            passwordContent += passwordValues["numbers"];
        }
        if (specialCharactersCheckbox.checked) {
            passwordContent += passwordValues["specialCharacters"];
        }

        // Check if at least one option is selected
        if (passwordContent.length === 0) {
            alert("Please select at least one option.");
            return;
        }

        // Check if password length is provided and is a number
        if (isNaN(passwordLength) || passwordLength < 1 || passwordLength > 99) {
            alert("Please provide a password length between 1 and 99.");
            return;
        }

        // Generate the password
        let password: string = "";
        for (let i = 0; i < passwordLength; i++) {
            // Same as in lorem generator
            const randomIndex = Math.floor(Math.random() * passwordContent.length);
            password += passwordContent[randomIndex];
        }

        // Display the generated password
        const passwordOutput = document.querySelector("#passwordOutput") as HTMLTextAreaElement;
        passwordOutput.value = password;
    }

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("loremIpsumGenerator", document);

        /**
         * HELPER FUNCTIONS
         */

        // Function to clear given inputs' content
        const clearContent = (clear: any): void => {
            clear.value = "";
        }

        // Function to copy content from textareas
        const copyContentFromTextArea = (target: HTMLElement, data: HTMLTextAreaElement): void => {
            target.addEventListener("click", function () {
                const targetDataValue = data.value;
                if (targetDataValue.length >= 1) {
                    navigator.clipboard.writeText(targetDataValue).then(() => {
                        const displaySuccess = document.querySelector(".copied-alert") as HTMLElement;
                        displaySuccess.style.display = "inline-block";
                        displaySuccess.style.opacity = "1";
                        setTimeout(() => {
                            displaySuccess.style.opacity = "0";
                        }, 2000);
                    });
                } else {
                    alert("Could not copy: Please provide a value.");
                    return;
                }
            });
        }

        /**
         * CLASS ACTIONS ARE CALLED HERE
         */

        // Run the generation of lorem when the extension loads in the connectedCallBack
        const generateLoremBtn = document.querySelector("#generateLorem") as HTMLButtonElement;
        const loremValue = document.querySelector(".lorem-value") as HTMLInputElement;
        const loremOutput = document.querySelector("#loremOutput") as HTMLTextAreaElement;
        const passwordOutput = document.querySelector("#passwordOutput") as HTMLTextAreaElement;

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

        // Password Generation
        const generatePasswordBtn = document.querySelector("#generatePassword") as HTMLButtonElement;
        generatePasswordBtn.addEventListener("click", () => {
            this.generatePassword();
        });

        // Function to copy Lorem Ipsum from Output textarea
        const copyLoremOutput = document.querySelector("#copyLorem") as HTMLButtonElement;
        copyContentFromTextArea(copyLoremOutput, loremOutput);

        const copyPasswordOutput = document.querySelector("#copyPassword") as HTMLButtonElement;
        copyContentFromTextArea(copyPasswordOutput, passwordOutput);

        // Function to clear textarea values
        const clearLoremOutput = document.querySelector("#clearLorem") as HTMLButtonElement;
        clearLoremOutput.addEventListener("click", function () {
            clearContent(loremOutput);
        });

        const clearPasswordOutput = document.querySelector("#clearPassword") as HTMLButtonElement;
        clearPasswordOutput.addEventListener("click", function () {
            clearContent(passwordOutput);
        });
    }
}

customElements.define("app-generators", Generators);