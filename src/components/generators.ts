import { Template, Overflowing, JSONDataFetching, UIElems } from "./helper.js";
import { LoremContent, ElementStyling, JSONData } from "../static.js";
import AppCalculations from "./appCalculations.js";

export default class Generators extends HTMLElement {
    private template: Template;
    private staticElementStylings: ElementStyling;
    private jsonDataSrc: JSONData;
    private jsonFetching: JSONDataFetching;
    private lorem: LoremContent;
    private uiElems: UIElems;
    private overflowing: Overflowing;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    constructor() {
        super();
        this.template = new Template();
        this.staticElementStylings = new ElementStyling();
        this.jsonDataSrc = new JSONData();
        this.jsonFetching = new JSONDataFetching();
        this.lorem = new LoremContent();
        this.uiElems = new UIElems();
        this.overflowing = new Overflowing();
        this.appCalculation = new AppCalculations();
        this.Ids = {
            loremIpsumGenerator: "loremIpsumGenerator",
            passwordGenerator: "passwordGenerator",
            randJson: "randJson"
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
            <div class="position-relative generators-tab-navigation-buttons">
                <ul class="${this.staticElementStylings.BASIC_TEMPLATE.classes.ul} generators-ulist">
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.loremIpsumGenerator}">Lorem</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.passwordGenerator}">Password</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.randJson}">Random JSON</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="loremIpsumGenerator" style="display: none;">${this.loremIpsumGeneratorTemplate()}</div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="passwordGenerator" style="display: none;">${this.generatePasswordTemplate()}</div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="randJson" style="display: none;">${this.generateJsonGenerationTemplate()}</div>
            </div>
            `;
    }

    // Render the Lorem Ipsum Generator
    private loremIpsumGeneratorTemplate(): string {
        return `
            <section class="container row mx-0 px-0">
                <div class="input-group mb-3 px-1">
                    <input type="number" class="form-control lorem-value" min="1" max="99" placeholder="How many lines of Lorem do you want? (1-99)" aria-label="How many lines of Lorem do you want? (1-99)" aria-describedby="generateLorem">
                    <button class="btn btn-outline-primary fs-5" type="button" id="generateLorem">Generate</button>
                </div>
                <div class="lorem-textarea d-flex flex-column align-items-start justify-content-start mb-3 px-1">
                    <textarea class="lorem-output-value w-100 form-control fs-5" id="loremOutput" title="Result" placeholder="Result" name="lorem-result" readonly></textarea>
                </div>
                <div class="lorem-actions mb-0 px-1 d-flex flex-row align-content-start justify-content-between gap-2">
                    <div class="lorem-button-actions">
                        <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="copyLorem">Copy</button>
                        <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="clearLorem">Clear</button>
                    </div>
                    <div class="d-flex flex-row align-content-center justify-content-between">
                        <div class="d-inline-block lorem-alert alert alert-danger transition ease-in-out duration-300 rounded-pill px-2 py-2" role="alert" style="opacity: 0;">
                            <h6 class="lorem-alert-message mb-0"></h6>
                        </div>
                        <div class="d-inline-block lorem-copied-alert alert alert-success transition ease-in-out duration-300 rounded-pill px-2 py-2" role="alert" style="opacity: 0;">
                            <div>
                                <h6 class="lorem-alert-message mb-0">Copied to clipboard.</h6>
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
        const loremSentences: Array<string> = this.lorem.loremSentences;
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
            <section class="position-relative">
                <div class="password-initial-div">
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
                        <div class="password-button-actions">
                            <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="copyPassword">Copy</button>
                            <button class="btn btn-discovery fs-5 rounded-pill" type="button" id="clearPassword">Clear</button>
                        </div>
                        <div class="d-flex flex-row align-content-center justify-content-between">
                            <div class="d-inline-block password-alert alert alert-danger transition ease-in-out duration-300 rounded-pill px-2 py-2" role="alert" style="opacity: 0;">
                                <h6 class="password-alert-message mb-0"></h6>
                            </div>
                            <div class="d-inline-block password-copied-alert alert alert-success transition ease-in-out duration-300 rounded-pill px-2 py-2" role="alert" style="opacity: 0;">
                                <div>
                                    <h6 class="lorem-alert-message mb-0">Copied to clipboard.</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div class="weak-password-detector alert alert-warning position-absolute top-50 start-50 translate-middle w-75 z-50" role="alert" style="display: none>
                <div class="d-flex flex-column gap-4 w-100">
                    <div class="d-flex flex-column gap-2">
                        <h6 class="mb-0">Important warning!</h6>
                        <p class="mb-0">Please use a strong password, including not only letters but <span class="fw-semibold">digits & special characters.</span></p>
                        <p class="mb-0">Minimum of 14 characters long password is recommended.</p>
                        <button id="closeWarning" class="btn btn-default">Close</button>
                    </div>
                </div>
            </div>
        `;
    }

    private generateJsonGenerationTemplate(): string {
        return `
            <section>
                <div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="limitRandJson">Limit</span>
                        <input type="number" min="1" max="99" class="form-control" placeholder="How many random JSON data do you want? (1-99)"
                        aria-label="How many random JSON data do you want? (1-99)" aria-describedby="limitRandJson"/>
                    </div>
                </div>
                <div class="d-flex flex-row align-items-center justify-content-center gap-2">
                    <div class="w-100">
                        <button id="generateRandJsonBtn" class="btn btn-discovery fs-4 w-100 rounded-pill">Get Randomized JSON Data</button>
                    </div>
                    <div>
                        <a href="https://jsonplaceholder.typicode.com/" target="_blank" title="Randomized JSON API Data">
                        <img src="/images/icons/question-mark.svg" class="img-fluid help-icon-min"></a>
                    </div>
                </div>
                <div>
                    <div class="rand-json-textarea d-flex flex-column align-items-start justify-content-start mb-3 mt-3 px-1">
                        <textarea class="rand-json-output-value w-100 form-control fs-5" id="randJsonOutput" title="Result" placeholder="Result" name="rand-json-result" readonly></textarea>
                        <div>
                            ${this.uiElems.generateAlerts("copyRandJson", "Copy", "rand-json-alert", "rand-json-alert-message")}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // Function to fetch Random JSON data, limit its size on desirable length and append it
    private fetchRandJsonAndModify = async (modifyingRate: number): Promise<any[]> => {
        const jsonDataSrc = this.jsonDataSrc.jsonDataSrc;

        try {
            const jsonDataFetch = await Promise.all(Object.values(jsonDataSrc).map((url) => this.jsonFetching.getJson(url)));
            // Get, randomize and limit our data with our desired input
            const modifiedData = jsonDataFetch.map((data) => {
                const result = data.slice(0, modifyingRate);
                return this.randomizeAndShuffleJsonData(result);
            });
            return modifiedData;
        } catch (error: unknown) {
            console.error("Error during data fetch:", error);
            throw error; // For Promise<any[]>
        }
    };

    // Function to randomize our array we got with JSON fetching
    // using Fisher–Yates shuffle algorithm
    private randomizeAndShuffleJsonData = (arr: Array<string>) => {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Function to generate password
    private generatePassword = (): void => {
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
            this.appCalculation.displayAlert("password-alert", "password-alert-message", "Please select an option.");
            return;
        }

        // Check if password length is provided and is a number
        if (isNaN(passwordLength) || passwordLength < 1 || passwordLength > 99) {
            this.appCalculation.displayAlert(".password-alert", ".password-alert-message", "Please provide a value.");
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

        /**  OPTINAL: Check password strength
        let result = this.checkPasswordStrength(passwordOutput.value);
        console.log(`Digits: ${result.digitPercentage}%`);
        console.log(`Letters: ${result.letterPercentage}%`);
        console.log(`Special Characters: ${result.specialCharacterPercentage}%`);

        if (passwordOutput.value.length < 12 && (result.digitPercentage < 10) && (result.specialCharacterPercentage < 10)) {
            const weakPasswordWarningDiv: any = document.querySelector(".weak-password-detector");
            weakPasswordWarningDiv.style.display = "block";
        }
        */
    }

    // Function to check password strength
    private checkPasswordStrength = (text: any): any => {
        // Check if password filed is empty
        if (text.length === 0) {
            return {
                digitPercentage: 0,
                letterPercentage: 0,
                specialCharacterPercentage: 0
            };
        }

        let totalChars: number = text.length;
        let digits: number = 0;
        let letters: number = 0;
        let specialCharacters: number = 0;

        // Search for digits & letters in the password output
        for (let i = 0; i < totalChars; i++) {
            let char: any = text[i];
            if (!isNaN(char)) {
                digits++;
            } else if (char.match(/[a-zA-Z]/)) {
                letters++;
            } else if (char.match(/[^a-zA-Z0-9]/)) {
                specialCharacters++;
            }
        }

        // Calculate them to show in percentage manners
        let digitPercentage: number = (digits / totalChars) * 100;
        let letterPercentage: number = (letters / totalChars) * 100;
        let specialCharacterPercentage: number = (specialCharacters / totalChars) * 100;

        // Return a string representation
        return {
            digitPercentage: digitPercentage.toFixed(2),
            letterPercentage: letterPercentage.toFixed(2),
            specialCharacterPercentage: specialCharacterPercentage.toFixed(2)
        };
    }

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("loremIpsumGenerator", document);
        // Handle tab overflowing & navigation buttons
        const tabMenu = document.querySelector(".generators-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".generators-ulist");

        /**
         * HELPER FUNCTIONS
         */

        // Function to clear given inputs' content
        const clearContent = (clear: any): void => {
            clear.value = "";
        }

        // Function to copy content from textareas
        const copyContentFromTextArea = (target: HTMLElement, data: HTMLTextAreaElement, element: string): void => {
            target.addEventListener("click", () => {
                const targetDataValue = data.value;
                if (targetDataValue.length >= 1) {
                    navigator.clipboard.writeText(targetDataValue).then(() => {
                        const displaySuccess = document.querySelector(element) as HTMLElement;
                        displaySuccess.style.opacity = "1";
                        setTimeout(() => {
                            displaySuccess.style.opacity = "0";
                        }, 2000);
                    });
                } else {
                    this.appCalculation.displayAlert(".lorem-alert", ".lorem-alert-message", "Please provide a value.");
                    return;
                }
            });
        }

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
        copyContentFromTextArea(copyLoremOutput, loremOutput, ".lorem-copied-alert");

        const copyPasswordOutput = document.querySelector("#copyPassword") as HTMLButtonElement;
        copyContentFromTextArea(copyPasswordOutput, passwordOutput, ".password-copied-alert");

        // Function to clear textarea values
        const clearLoremOutput = document.querySelector("#clearLorem") as HTMLButtonElement;
        clearLoremOutput.addEventListener("click", function () {
            clearContent(loremOutput);
        });

        const clearPasswordOutput = document.querySelector("#clearPassword") as HTMLButtonElement;
        clearPasswordOutput.addEventListener("click", function () {
            clearContent(passwordOutput);
        });

        // Remove the warning div
        const removeweakPasswordWarningDiv = document.querySelector("#closeWarning") as HTMLButtonElement;
        const weakPasswordWarningDiv = document.querySelector(".weak-password-detector") as HTMLDivElement;
        const mainPlaceHolder = document.querySelector(".password-initial-div");

        // Add warning div to sessionStorage to prevent appearing again
        // Check if the warning div is removed before
        if (sessionStorage.getItem("dismissedWarning") === "true") {
            weakPasswordWarningDiv.remove();
            mainPlaceHolder?.classList.remove("disabled-div");
        } else {
            if (weakPasswordWarningDiv) {
                mainPlaceHolder?.classList.add("disabled-div");
            }
        }

        removeweakPasswordWarningDiv.addEventListener("click", () => {
            weakPasswordWarningDiv.remove();
            mainPlaceHolder?.classList.remove("disabled-div");
            sessionStorage.setItem("dismissedWarning", "true");
        });

        // Random JSON data generator
        const copyRandJsonOutputBtn = document.querySelector("#copyRandJson") as HTMLButtonElement;
        const randJsonGenerateBtn = document.querySelector("#generateRandJsonBtn") as HTMLButtonElement;
        const randJsonOutput = document.querySelector("#randJsonOutput") as HTMLTextAreaElement;
        randJsonGenerateBtn.addEventListener("click", async () => {
            const randJsonLimit = document.querySelector(`input[aria-describedby="limitRandJson"]`) as HTMLInputElement;

            if (!randJsonLimit.value.length) {
                this.appCalculation.displayAlert(".rand-json-alert", ".rand-json-alert-message", "Please provide a value.");
                return;
            }

            try {
                const result = await this.fetchRandJsonAndModify(parseInt(randJsonLimit.value));
                randJsonOutput.value = JSON.stringify(result, null, 1);
            } catch (error: unknown) {
                console.error("Error generating random JSON:", error);
                randJsonOutput.value = "An error occurred. Check console for details.";
            }
        });

        copyRandJsonOutputBtn.addEventListener("click", () => {
            if (randJsonOutput.value === "") {
                this.appCalculation.displayAlert(".rand-json-alert", ".rand-json-alert-message", "Please provide a value.");
            } else {
                this.appCalculation.displaySuccess(randJsonOutput.value);
            }
        })
    }
}

customElements.define("app-generators", Generators);