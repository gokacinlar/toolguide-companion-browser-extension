import { Template } from "./helper.js";
import { AppCalculations } from "./appCalculations.js";

interface BasicTemplate { [key: string]: string }

const BASIC_TEMPLATE: { [key: string]: BasicTemplate } = {
    classes: {
        ul: "app-calc-ul d-flex flex-row gap-2 align-items-center justify-content-start",
        button: "component-tab-nav-button btn btn-discovery w-100 fs-5 shadow-md rounded-3",
        componentElement: "component-tab-content-element py-2 my-2",
        calcButtons: "calc-button btn btn-primary rounded-pill fs-4 w-100 shadow-sm",
        calcButtonsExtra: "calc-keys btn btn-discovery rounded-pill fs-4 fw-medium w-100 shadow-sm"
    }
}

export class Ciphers extends HTMLElement {
    private template: Template;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    constructor() {
        super();
        this.template = new Template();
        this.appCalculation = new AppCalculations();

        this.Ids = {
            caesarsCipher: "caesarsCipher"
        }

        const template = this.template.createTemplate(this.ciphers());
        this.appendChild(template.content.cloneNode(true));
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

    // Render the main template
    private ciphers(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.caesarsCipher}">Caesar's Cipher</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="caesarsCipher" style="display: none;">${this.renderCaesarsCipher()}</div>
            </div>
        `;
    }

    // Ceaser's Cipher
    private renderCaesarsCipher(): string {
        return `
            <section>
                <div class="d-flex flex-column gap-2">
                    <div class="input-group" id="ccInput">
                        <span class="input-group-text">Message Input</span>
                        <textarea class="form-control" name="cc-textarea" aria-label="Message Input"></textarea>
                    </div>
                    <div class="d-flex flex-row align-items-center justify-content-center gap-2">
                        <div class="form-floating w-100">
                            <input type="number" class="form-control" id="ccShiftInput" aria-label="Shifting Value" value="3">
                            <label for="ccShiftInput">Select Shifting Value (def. 3)</label>
                        </div>
                        <div class="form-floating w-100">
                            <select class="form-select" id="ccDirectionSelect" aria-label="Direction">
                                <option value="right" selected>Right</option>
                                <option value="left">Left</option>
                            </select>
                            <label for="ccDirectionSelect">Select Ciphering Direction</label>
                        </div>
                    </div>
                    <div class="input-group" id="ccOutput">
                        <span class="input-group-text">Message Output</span>
                        <textarea class="form-control" name="cc-textarea" aria-label="Message Output"></textarea>
                    </div>
                    <div>
                        <div class="btn-group d-flex flex-row gap-2" role="group" aria-label="cc-button-group">
                            <button id="ccCipherBtn" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Cipher</button>
                            <button id="ccCopyBtn" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Copy</button>
                            <button id="ccClearBtn" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Clear</button>
                        </div>
                    </div>
                    <div class="alerts d-flex flex-row align-content-center justify-content-between">
                        <div class="cc-alert alert alert-danger transition ease-in-out duration-300 mt-0 mb-0 rounded-pill" role="alert" style="opacity: 0;">
                            <h6 class="cc-alert-message mb-0"></h6>
                        </div>
                        <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-0 mb-0 rounded-pill" role="alert" style="opacity: 0;">
                            <h6 class="mb-0">Copied to clipboard.</h6>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    private ccEncode(): void {
        // Define the base alphabet
        const alphabet: string = "abcdefghijklmnopqrstuvwxyz";

        // Define the elements
        const ccInput = document.querySelector("#ccInput > textarea") as HTMLTextAreaElement;
        const ccOutPut = document.querySelector("#ccOutput > textarea") as HTMLTextAreaElement;
        const ccDirectionSelect = document.querySelector("#ccDirectionSelect") as HTMLSelectElement;
        const ccShiftSelect = document.querySelector("#ccShiftInput") as HTMLInputElement;

        // Get the data
        const shift: number = parseInt(ccShiftSelect.value);
        const direction: string = ccDirectionSelect.value;
        const message: string = ccInput.value.toLowerCase(); // Lowercase it for UI clarity

        let formattedAlphabet: string = "";
        for (let i = 0; i < message.length; i++) {
            // Get our input character in message
            const char: string = message[i];
            // Correlate the input w/ our index alphabet
            const index: number = alphabet.indexOf(char);

            // If index is found in our alphabet
            if (index !== -1) {
                let newIndex: number;
                // Check if user input requires right & left shifting
                if (direction === "right") {
                    newIndex = (index + shift) % alphabet.length;
                } else {
                    newIndex = (index - shift + alphabet.length) % alphabet.length
                }
                formattedAlphabet += alphabet[newIndex];
            } else {
                formattedAlphabet += char;
            }
        }
        ccOutPut.value = formattedAlphabet;
    }

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("caesarsCipher", document);

        // Caesars' Cipher copying & clearing & formatting
        const ccInputValue = document.querySelector("#ccInput > textarea") as HTMLTextAreaElement;
        const ccOutputValue = document.querySelector("#ccOutput > textarea") as HTMLTextAreaElement;
        const ccCipherBtn = document.querySelector("#ccCipherBtn") as HTMLButtonElement;
        ccCipherBtn.addEventListener("click", () => {
            if (ccInputValue.value.length >= 1) {
                this.ccEncode();
            } else {
                this.appCalculation.displayAlert(".cc-alert", ".cc-alert-message", "Please provide a value.");
            }
        });

        const ccCopyBtn = document.querySelector("#ccCopyBtn") as HTMLButtonElement;
        ccCopyBtn.addEventListener("click", () => {
            if (ccInputValue.value.length >= 1) {
                this.appCalculation.displaySuccess(ccOutputValue.value);
            } else {
                this.appCalculation.displayAlert(".cc-alert", ".cc-alert-message", "Please provide a value.");
            }
        });

        const ccClearBtn = document.querySelector("#ccClearBtn") as HTMLButtonElement;
        ccClearBtn.addEventListener("click", () => {
            ccInputValue.value = "";
            ccOutputValue.value = "";
        });
    }
}

customElements.define("app-ciphers", Ciphers);