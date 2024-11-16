import { Template, Overflowing, BASIC_TEMPLATE } from "./helper.js";
import AppCalculations from "./appCalculations.js";

export default class Ciphers extends HTMLElement {
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
            caesarsCipher: "caesarsCipher",
            rot13: "rot13"
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
            <div class="position-relative cipher-tab-navigation-buttons">
                <ul class="${BASIC_TEMPLATE.classes.ul} ciphers-ulist">
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.caesarsCipher}">Caesar's Cipher</button></li>
                    <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.rot13}">ROT-13</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="caesarsCipher" style="display: none;">${this.renderCaesarsCipher()}</div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="rot13" style="display: none;">${this.renderRot13()}</div>
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
                            <label for="ccDirectionSelect">Select Shifting Direction</label>
                        </div>
                    </div>
                    <div class="input-group" id="ccOutput">
                        <span class="input-group-text">Message Output</span>
                        <textarea class="form-control" name="cc-textarea" aria-label="Message Output"></textarea>
                    </div>
                    <div>
                        <div class="btn-group d-flex flex-row gap-2" role="group" aria-label="cc-button-group">
                            <button id="ccCipherBtn" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Encode</button>
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

    // ROT-13 Encoding & Decoding
    // Lead: https://hellodevworld.com/365-days-of-coding/rot13-cipher-javascript-solution
    private encodeDecodeRot13(elem: string): string {
        return elem.replace(/[a-z]/gi, (letter) =>
            String.fromCharCode(
                // Get the charcode of current character and replace it if its
                // behind or front of M, which is the midpoint of the 26-letter alphabet
                letter.charCodeAt(0) + (letter.toLowerCase() <= "m" ? 13 : -13)
            )
        );
    }

    // ROT-13
    private renderRot13(): string {
        return `
            <section>
                <div class="d-flex flex-column gap-2">
                    <div class="alert alert-danger mb-0" role="alert">
                        <div class="d-flex align-items-center gap-2">
                            <img src="/images/icons/etc/info-circle-fill.svg" class="img-fluid info-box-icon">
                            <div class="d-flex flex-column gap-2">
                                <p class="mb-0">ROT-13 offers <span class="fw-bold">no cryptographic security.</span>
                                    <span>
                                        <a class="link-info" href="https://en.wikipedia.org/wiki/ROT13#Usage" target="_blank">Check here</a> for more information.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column gap-2">
                        <div class="input-group" id="rot13Input">
                            <span class="input-group-text">Message Input</span>
                            <textarea class="form-control" name="rot13-textarea" aria-label="Message Input"></textarea>
                        </div>
                        <div class="input-group" id="rot13Output">
                            <span class="input-group-text">Message Output</span>
                            <textarea class="form-control" name="rot13-textarea" aria-label="Message Output"></textarea>
                        </div>
                    </div>
                    <div>
                        <div class="btn-group d-flex flex-row gap-2" role="group" aria-label="cc-button-group">
                            <button id="rot13EncodeDecodeBtn" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Encode / Decode</button>
                            <button id="rot13CopyBtn" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Copy</button>
                            <button id="rot13ClearBtn" type="button" class="btn btn-discovery rounded-pill fs-4 shadow-lg">Clear</button>
                        </div>
                    </div>
                    <div class="alerts d-flex flex-row align-content-center justify-content-between">
                        <div class="rot13-alert alert alert-danger transition ease-in-out duration-300 mt-0 mb-0 rounded-pill" role="alert" style="opacity: 0;">
                            <h6 class="rot13-alert-message mb-0"></h6>
                        </div>
                        <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-0 mb-0 rounded-pill" role="alert" style="opacity: 0;">
                            <h6 class="mb-0">Copied to clipboard.</h6>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("caesarsCipher", document);
        // Handle tab overflowing & navigation buttons
        const tabMenu = document.querySelector(".cipher-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".ciphers-ulist");

        // Caesars' Cipher copying & clearing & formatting
        const ccInputValue = document.querySelector("#ccInput > textarea") as HTMLTextAreaElement;
        const ccOutputValue = document.querySelector("#ccOutput > textarea") as HTMLTextAreaElement;
        const ccCipherBtn = document.querySelector("#ccCipherBtn") as HTMLButtonElement;
        ccCipherBtn.addEventListener("click", () => {
            if (ccInputValue.value.length) {
                this.ccEncode();
            } else {
                this.appCalculation.displayAlert(".cc-alert", ".cc-alert-message", "Please provide a value.");
            }
        });

        const ccCopyBtn = document.querySelector("#ccCopyBtn") as HTMLButtonElement;
        ccCopyBtn.addEventListener("click", () => {
            if (ccInputValue.value.length) {
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

        // ROT-13 Encoding & Decoding
        const rot13Input = document.querySelector("#rot13Input > textarea") as HTMLTextAreaElement;
        const rot13Output = document.querySelector("#rot13Output > textarea") as HTMLTextAreaElement;

        const rot13EncodeDecodeBtn = document.querySelector("#rot13EncodeDecodeBtn") as HTMLButtonElement;
        rot13EncodeDecodeBtn.addEventListener("click", () => {
            if (rot13Input.value.length) {
                rot13Output.value = this.encodeDecodeRot13(rot13Input.value)
            } else {
                this.appCalculation.displayAlert(".rot13-alert", ".rot13-alert-message", "Please provide a value.");
            }
        });

        // ROT-13 Copying & Clearing
        const rot13CopyBtn = document.querySelector("#rot13CopyBtn") as HTMLButtonElement;
        rot13CopyBtn.addEventListener("click", () => {
            if (rot13Output.value.length) {
                this.appCalculation.displaySuccess(rot13Output.value);
            } else {
                this.appCalculation.displayAlert(".rot13-alert", ".rot13-alert-message", "Please provide a value.");
            }
        });

        const rot13ClearBtn = document.querySelector("#rot13ClearBtn") as HTMLButtonElement;
        rot13ClearBtn.addEventListener("click", () => {
            rot13Input.value = "";
            rot13Output.value = "";
        });
    }
}

customElements.define("app-ciphers", Ciphers);