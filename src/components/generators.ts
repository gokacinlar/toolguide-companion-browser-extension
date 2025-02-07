import { Template, Overflowing, JSONDataFetching, UIElems } from "./helper.js";
import { LoremContent, ElementStyling, JSONData } from "../static.js";
import AppCalculations from "./app_calculations.js";

export default class Generators extends HTMLElement {
    private template: Template;
    private staticElementStylings: ElementStyling;
    private jsonDataSrc: JSONData;
    private jsonFetching: JSONDataFetching;
    private lorem: LoremContent;
    private uiElems: UIElems;
    private overflowing: Overflowing;
    private appCalculation: AppCalculations;
    private sha256: Sha256Generator;
    private sha512: Sha512Generator;
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
        this.sha256 = new Sha256Generator();
        this.sha512 = new Sha512Generator();
        this.appCalculation = new AppCalculations();
        this.Ids = {
            loremIpsumGenerator: "loremIpsumGenerator",
            passwordGenerator: "passwordGenerator",
            randJson: "randJson",
            randQuote: "randQuote",
            sha256Generator: "sha256Generator",
            sha512Generator: "sha512Generator"
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
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.randQuote}">Random Quote</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.sha256Generator}">SHA-256</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.sha512Generator}">SHA-512</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="loremIpsumGenerator" style="display: none;">${this.loremIpsumGeneratorTemplate()}</div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="passwordGenerator" style="display: none;">${this.generatePasswordTemplate()}</div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="randJson" style="display: none;">${this.generateJsonGenerationTemplate()}</div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="randQuote" style="display: none;">${this.generateRandomQuoteTemplate()}</div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="sha256Generator" style="display: none;">${this.sha256.sha256Template()}</div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="sha512Generator" style="display: none;">${this.sha512.sha512Template()}</div>
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
                    <div class="input-group mb-3 px-1">
                        <span class="input-group-text" id="limitRandJson">Limit</span>
                        <input type="number" min="1" max="99" class="form-control" placeholder="How many random JSON data do you want? (1-99)"
                        aria-label="How many random JSON data do you want? (1-99)" aria-describedby="limitRandJson"/>
                    </div>
                </div>
                <div class="d-flex flex-row align-items-center justify-content-center gap-2 px-1">
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

    // Generate Random Quote template
    private generateRandomQuoteTemplate(): string {
        return `
            <section class="overflowing-content">
                <div class="d-flex flex-row align-items-center justify-content-center gap-2 px-1">
                    <div class="w-100">
                        <button id="generateRandQuoteBtn" class="btn btn-discovery fs-4 w-100 rounded-pill">Get A Random Quote</button>
                    </div>
                    <div>
                        <a href="https://random-quotes-freeapi.vercel.app/" target="_blank" title="Random Quote Data">
                        <img src="/images/icons/question-mark.svg" class="img-fluid help-icon-min"></a>
                    </div>
                </div>
                <div>
                    <div class="rand-quote-textarea d-flex flex-column align-items-start justify-content-start mb-3 mt-3 px-1">
                        <textarea class="rand-json-output-value w-100 form-control fs-5" id="randQuoteOutput" title="Quote" placeholder="Result" name="rand-json-result" readonly></textarea>
                        <div class="mt-1 w-100">
                            <label for="quoteAuthor" class="form-label fs-6">Quote by:</label>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" id="quoteAuthor" aria-describedby="quoteAuthor" readonly/>
                            </div>
                        </div>
                        <div>
                            ${this.uiElems.generateAlerts("copyRandQuote", "Copy", "rand-quote-alert", "rand-quote-alert-message")}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // Function to fetch random quote and append it to the Random Quote Template
    private fetchRandomQuote = async (): Promise<any[]> => {
        try {
            const apiUrl: string = "https://random-quotes-freeapi.vercel.app/api/random";
            const jsonDataFetch = await this.jsonFetching.getJson(apiUrl);
            const randQuoteSection = document.querySelector("#randQuoteOutput") as HTMLTextAreaElement;
            const randQuoteAuthor = document.querySelector("#quoteAuthor") as HTMLInputElement;

            if (jsonDataFetch) {
                randQuoteSection.value = jsonDataFetch.quote;
                randQuoteAuthor.value = jsonDataFetch.author;
                return jsonDataFetch;
            } else {
                randQuoteSection.value = "An error occured. Please see console.";
                randQuoteAuthor.value = "An error occured. Please see console.";
                console.error("Error retrieving JSON data.");
                return jsonDataFetch;
            }
        } catch (error: unknown) {
            console.error("Error during data fetch:", error);
            throw error; // For Promise<any[]>
        }
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
                if (targetDataValue.length) {
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

        // Random Quote
        const generateRandQuoteBtn = document.querySelector("#generateRandQuoteBtn") as HTMLButtonElement;
        generateRandQuoteBtn.addEventListener("click", () => {
            this.fetchRandomQuote();
        });

        const randQuoteSection = document.querySelector("#randQuoteOutput") as HTMLTextAreaElement;
        const randQuoteAuthor = document.querySelector("#quoteAuthor") as HTMLInputElement;
        const copyRandQuoteBtn = document.querySelector("#copyRandQuote") as HTMLButtonElement;
        copyRandQuoteBtn.addEventListener("click", () => {
            if (!randQuoteSection.value.length || !randQuoteAuthor.value.length) {
                this.appCalculation.displayAlert(".rand-quote-alert", ".rand-quote-alert-message", "Please provide a value.");
                return;
            }

            const quoteWithAuthor: string = `${randQuoteSection.value} - ${randQuoteAuthor.value}`
            this.appCalculation.displaySuccess(quoteWithAuthor);
        });

        // SHA-256 Generator by using WebCrypto API
        // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
        this.sha256.sha256Template();
        this.sha256.connectedCallback();

        // SHA-512 Generator
        this.sha512.sha512Template();
        this.sha512.connectedCallback();
    }
}

class Sha256Generator {
    private appCalculation: AppCalculations;

    constructor() {
        this.appCalculation = new AppCalculations;
    }

    public sha256Template(): string {
        return `
            <section>
                <div>
                    <label for="sha-256-string-input" class="form-label fs-6">Please enter text here...</label>
                    <div class="input-group mb-3 container px-0">
                        <span class="input-group-text col-2" id="sha256StringInp">Text</span>
                        <textarea name="sha-256-textarea" id="sha-256-string-input" class="form-control" aria-label="SHA-256 String Input Area"
                        aria-describedby="sha256StringInp"></textarea>
                    </div>
                </div>
                <div>
                    <label for="sha-256-string-output" class="form-label fs-6">SHA-256 Output...</label>
                    <div class="input-group mb-3 container px-0">
                        <span class="input-group-text col-2" id="sha256StringOutp">SHA-256</span>
                        <input type="text" class="form-control" id="sha-256-string-output" aria-describedby="sha256StringOutp" readonly>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="btn-group d-flex flex-row gap-2" role="group" aria-label="cc-button-group">
                        <button id="hashTheString" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Hash</button>
                        <button id="copySha256" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Copy Hash</button>
                    </div>
                </div>
                <div class="alerts d-flex flex-row align-content-center justify-content-between">
                    <div class="sha-256-alert alert alert-danger transition ease-in-out duration-300 mt-0 mb-0 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="sha-256-alert-message mb-0"></h6>
                    </div>
                    <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-0 mb-0 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="mb-0">Copied to clipboard.</h6>
                    </div>
                </div>
            </section>
        `;
    }

    // Function to hash string based on SHA-256 algorithm
    public async hashString(string: string) {
        const uInt8Message = new TextEncoder().encode(string);
        // This is the part where hashing happens
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", uInt8Message);
        // Convert buffer to byte array
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("") // Convert bytes to hex string
        return hashHex;
    }

    connectedCallback(): void {
        const hashBtn = document.getElementById("hashTheString") as HTMLButtonElement;
        const stringToBeHashed = document.getElementById("sha-256-string-input") as HTMLTextAreaElement;
        const hashOutput = document.getElementById("sha-256-string-output") as HTMLInputElement;

        hashBtn.addEventListener("click", async () => {
            if (!stringToBeHashed.value.length) {
                this.appCalculation.displayAlert(".sha-256-alert", ".sha-256-alert-message", "Unable to hash (no text).");
            } else {
                hashOutput.value = await this.hashString(stringToBeHashed.value);
            }

        })

        const copyHashBtn = document.getElementById("copySha256") as HTMLButtonElement;
        copyHashBtn.addEventListener("click", () => {
            if (!stringToBeHashed.value.length) {
                this.appCalculation.displayAlert(".sha-256-alert", ".sha-256-alert-message", "Please provide a text.");
            } else {
                this.appCalculation.displaySuccess(hashOutput.value);
            }
        });
    }
}

class Sha512Generator {
    private appCalculation: AppCalculations;

    constructor() {
        this.appCalculation = new AppCalculations;
    }

    public sha512Template(): string {
        return `
            <section>
                <div>
                    <label for="sha-512-string-input" class="form-label fs-6">Please enter text here...</label>
                    <div class="input-group mb-3 container px-0">
                        <span class="input-group-text col-2" id="sha512StringInp">Text</span>
                        <textarea name="sha-512-textarea" id="sha-512-string-input" class="form-control" aria-label="SHA-512 String Input Area"
                        aria-describedby="sha512StringInp"></textarea>
                    </div>
                </div>
                <div>
                    <label for="sha-512-string-output" class="form-label fs-6">SHA-512 Output...</label>
                    <div class="input-group mb-3 container px-0">
                        <span class="input-group-text col-2" id="sha512StringOutp">SHA-512</span>
                        <input type="text" class="form-control" id="sha-512-string-output" aria-describedby="sha512StringOutp" readonly>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="btn-group d-flex flex-row gap-2" role="group" aria-label="cc-button-group">
                        <button id="hashTheStringSha512" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Hash</button>
                        <button id="copySha512" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Copy Hash</button>
                    </div>
                </div>
                <div class="alerts d-flex flex-row align-content-center justify-content-between">
                    <div class="sha-512-alert alert alert-danger transition ease-in-out duration-300 mt-0 mb-0 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="sha-512-alert-message mb-0"></h6>
                    </div>
                    <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-0 mb-0 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="mb-0">Copied to clipboard.</h6>
                    </div>
                </div>
            </section>
        `;
    }

    // Function to hash string based on SHA-512 algorithm
    public async hashString(string: string): Promise<string> {
        const uInt8Message = new TextEncoder().encode(string);
        // This is the part where hashing happens
        const hashBuffer = await window.crypto.subtle.digest("SHA-512", uInt8Message);
        // Convert buffer to byte array
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("") // Convert bytes to hex string
        return hashHex;
    }

    connectedCallback(): void {
        const hashBtn = document.getElementById("hashTheStringSha512") as HTMLButtonElement;
        const stringToBeHashed = document.getElementById("sha-512-string-input") as HTMLTextAreaElement;
        const hashOutput = document.getElementById("sha-512-string-output") as HTMLInputElement;

        hashBtn.addEventListener("click", async () => {
            if (!stringToBeHashed.value.length) {
                this.appCalculation.displayAlert(".sha-512-alert", ".sha-512-alert-message", "Unable to hash (no text).");
            } else {
                hashOutput.value = await this.hashString(stringToBeHashed.value);
            }

        })

        const copyHashBtn = document.getElementById("copySha512") as HTMLButtonElement;
        copyHashBtn.addEventListener("click", () => {
            if (!stringToBeHashed.value.length) {
                this.appCalculation.displayAlert(".sha-512-alert", ".sha-512-alert-message", "Please provide a text.");
            } else {
                this.appCalculation.displaySuccess(hashOutput.value);
            }
        });
    }
}

customElements.define("app-generators", Generators);
