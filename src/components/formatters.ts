import { Template } from "./helper.js";
import { AppCalculations } from "./appCalculations.js";

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

export class Formatters extends HTMLElement {
    private template: Template;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string }

    constructor() {
        super();
        this.template = new Template();
        this.appCalculation = new AppCalculations();

        this.Ids = {
            jsonFormatter: "jsonFormatter",
            xmlFormatter: "xmlFormatter",
            htmlFormatter: "htmlFormatter",
            cssFormatter: "cssFormatter",
            javaScriptFormatter: "javaScriptFormatter"
        }

        const template = this.template.createTemplate(this.formattersTemplate());
        this.appendChild(template.content.cloneNode(true));
    }

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

    private formattersTemplate(): string {
        return `
            <ul class="${BASIC_TEMPLATE.classes.ul}">
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.jsonFormatter}">JSON</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.xmlFormatter}">XML</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.htmlFormatter}">HTML</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.cssFormatter}">CSS</button></li>
                <li><button class="${BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.javaScriptFormatter}">JavaScript</button></li>
            </ul>
            <div id="content">
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="jsonFormatter" style="display: none;">
                    ${this.jsonFormatter()}
                </div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="xmlFormatter" style="display: none;">
                    ${this.xmlFormatter()}
                </div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="htmlFormatter" style="display: none;">
                    ${this.htmlFormatter()}
                </div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="cssFormatter" style="display: none;">
                    ${this.cssFormatter()}
                </div>
                <div class="${BASIC_TEMPLATE.classes.componentElement}" id="javaScriptFormatter" style="display: none;">
                    ${this.jsFormatter()}
                </div>
        `;
    }

    private jsonFormatter(): string {
        return `
            <section class="container row mx-0 px-0 d-flex align-content-center justify-content-around position-relative">
                <div id="jsonInput" class="col-5 mx-0 px-0">
                    <div id="jiBtns" class="mb-3">
                        <div class="btn-group d-flex flex-row align-content-center justify-content-start gap-2" role="group" aria-label="JavaScript Formatting Options">
                            <div>
                                <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off"/>
                                <label class="btn btn-default fs-4 rounded-pill shadow-md" for="btnradio1">Minify</label>
                            </div>
                            <div>
                                <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off"/>
                                <label class="btn btn-default fs-4 rounded-pill shadow-md" for="btnradio2">Beautify</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <textarea name="jsonInput" class="form-control shadow-md" id="jsonTextAreaInput" aria-label="json-data" rows="7" placeholder="Input" aria-describedby="textarea-value"></textarea>
                        </div>
                    </div>
                </div>
                <div id="jsonOutput" class="col-6 mx-0 px-0">
                    <div class="btn-group w-100 d-flex flex-row align-content-center justify-content-between gap-2 mb-3" role="group">
                        <button id="jsonFormatBtn" type="button" class="btn btn-outline-discovery fs-4 rounded-pill shadow-lg">Format</button>
                        <button id="jsonCopyBtn" type="button" class="btn btn-outline-discovery fs-4 rounded-pill shadow-lg">Copy</button>
                        <button id="jsonClearBtn" type="button" class="btn btn-outline-discovery fs-4 rounded-pill shadow-lg">Clear</button>
                    </div>
                    <div>
                        <div class="">
                            <textarea name="jsonOutput" class="form-control shadow-md" id="jsonTextAreaOutput" aria-label="json-data" rows="7" placeholder="Output" aria-describedby="textarea-value" readonly></textarea>
                        </div>
                    </div>
                </div>
                <div class="alerts d-flex flex-row align-content-center justify-content-between position-absolute bottom-0 end-0 px-0 py-0">
                    <div class="json-alert alert alert-danger transition ease-in-out duration-300 mt-3 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="json-alert-message mb-0"></h6>
                    </div>
                    <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-3 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="mb-0">Copied to clipboard.</h6>
                    </div>
                </div>
            </section>
        `;
    }

    private xmlFormatter(): string {
        return `
            <section class="container row mx-0 px-0 d-flex align-content-center justify-content-around position-relative">
                <div id="jsonInput" class="col-5 mx-0 px-0">
                    <div id="jiBtns" class="mb-3">
                        <div role="group" aria-label="XML Formatting Button">
                            <div class="w-100">
                                <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" checked/>
                                <label class="btn btn-default fs-4 w-100 rounded-pill shadow-md" for="btnradio3">Beautify</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <textarea name="xmlInput" class="form-control shadow-md" id="xmlTextAreaInput" aria-label="xml-data" rows="7" placeholder="Input" aria-describedby="textarea-value"></textarea>
                        </div>
                    </div>
                </div>
                <div id="jsonOutput" class="col-6 mx-0 px-0">
                    <div class="btn-group w-100 d-flex flex-row align-content-center justify-content-between gap-2 mb-3" role="group">
                        <button id="xmlFormatBtn" type="button" class="btn btn-outline-discovery fs-4 rounded-pill shadow-lg">Format</button>
                        <button id="xmlCopyBtn" type="button" class="btn btn-outline-discovery fs-4 rounded-pill shadow-lg">Copy</button>
                        <button id="xmlClearBtn" type="button" class="btn btn-outline-discovery fs-4 rounded-pill shadow-lg">Clear</button>
                    </div>
                    <div>
                        <div class="">
                            <textarea name="xmlOutput" class="form-control shadow-md" id="xmlTextAreaOutput" aria-label="xml-data" rows="7" placeholder="Output" aria-describedby="textarea-value" readonly></textarea>
                        </div>
                    </div>
                </div>
                <div class="alerts d-flex flex-row align-content-center justify-content-between position-absolute bottom-0 end-0 px-0 py-0">
                    <div class="json-alert alert alert-danger transition ease-in-out duration-300 mt-3 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="json-alert-message mb-0"></h6>
                    </div>
                    <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-3 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="mb-0">Copied to clipboard.</h6>
                    </div>
                </div>
            </section>
        `;
    }

    private htmlFormatter(): string {
        return `x`;
    }

    private cssFormatter(): string {
        return `x`;
    }

    private jsFormatter(): string {
        return `x`;
    }

    /**
     * HELPER FUNCTIONS
     */

    // Function to detect JSON patterns
    private isJson(elem: string): boolean {
        try {
            // Use JSON.parse to detect JSON patterns
            JSON.parse(elem);
            return true;
        } catch (error) {
            console.error("Input is not a valid JSON.", error);
            return false;
        }
    }

    // Function to minify JSON
    private minifyJson(elem: string): string {
        // Trim the whitespace from JSON using stringify()
        try {
            const initJsonValue = JSON.parse(elem);
            const jsonStringified = JSON.stringify(initJsonValue, null, 0);
            return jsonStringified;
        } catch (error) {
            console.error("Error minifying JSON:", error);
            return elem;
        }
    }

    // Function to beautify JSON
    private beautifyJson(elem: string): string {
        try {
            const initJsonValue = JSON.parse(elem);
            const jsonBeautified = JSON.stringify(initJsonValue, null, 2);
            return jsonBeautified;
        } catch (error) {
            console.error("Error beautifying JSON:", error);
            return elem;
        }
    }

    // Function to beautify XML
    private beautifyXml(elem: string): string {
        try {
            // Hold the xml, indendations and level which we'll use to
            // manage nesting levels for UI clarity
            let formattedXml: string = "";
            let indent: string = "";
            let nestingLevel: number = 0;

            // Split the XML string first to be later used as nodes
            // first lead by = https://stackoverflow.com/a/49458964
            elem.split(/>\s*</).forEach((node) => {
                // Case if there are empty nodes
                if (!node.trim()) {
                    return;
                }

                // Case if the node is a closing tag
                if (node.match(/^\/\w/)) {
                    // Decrease nesting
                    nestingLevel--;
                    indent = Array(nestingLevel).fill("  ").join("");
                    formattedXml += indent + "<" + node + ">\r\n";
                }
                // Case if the node is an opening tag
                else if (node.match(/^\w/)) {
                    // Increase nesting
                    nestingLevel++;
                    indent = Array(nestingLevel).fill("  ").join("");
                    formattedXml += indent + "<" + node + ">\r\n";
                }
                // Case if the node is a self-closing tag
                else if (node.match(/^\/$/)) {
                    nestingLevel--;
                    indent = Array(nestingLevel).fill("  ").join("");
                    formattedXml += indent + "/>\r\n";
                }
            });

            return formattedXml;
        } catch (error) {
            console.error("Error beautifying XML:", error);
            return elem;
        }
    }

    connectedCallback(): void {
        this.handleNavigation(); // Set up event listeners for navigation buttons
        this.appCalculation.openPage("jsonFormatter", document);

        /**
         * JSON Section
         */

        const jsonInputs = document.querySelectorAll(`input[name="btnradio"]`) as NodeListOf<HTMLInputElement>;
        jsonInputs.forEach((x) => {
            // Initial check of the buttons
            x.addEventListener("click", () => {
                // Check if new one is checked, disable the previous one
                jsonInputs.forEach((y) => {
                    if (y !== x) {
                        y.checked = false;
                    }
                });
                x.checked = true;

                const jsonFormatBtn = document.querySelector("#jsonFormatBtn") as HTMLButtonElement;
                const jsonInputElement = document.querySelector("#jsonTextAreaInput") as HTMLTextAreaElement;
                const jieOutputArea = document.querySelector("#jsonTextAreaOutput") as HTMLTextAreaElement;
                const jieCopied = jsonInputElement.value;

                if (x.id === "btnradio1") {
                    jsonFormatBtn.addEventListener("click", () => {
                        if (jsonInputElement.value.length >= 1) {
                            // Use string.raw to interpret every escape sequence to make sure we're getting the input right
                            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw#description
                            const jieCopiedString = String.raw`${jieCopied}`;
                            if (this.isJson(jieCopiedString) == true) {
                                const finalResult = this.minifyJson(jieCopiedString);
                                jieOutputArea.value = finalResult;
                            } else {
                                jieOutputArea.value = "Invalid JSON data."
                            }
                        } else {
                            this.appCalculation.displayAlert(".json-alert", ".json-alert-message", "Please provide a value.");
                        }
                    });
                } else if (x.id === "btnradio2") {
                    jsonFormatBtn.addEventListener("click", () => {
                        if (jsonInputElement.value.length >= 1) {
                            const jieCopiedString = String.raw`${jieCopied}`;
                            if (this.isJson(jieCopiedString) == true) {
                                const finalResult = this.beautifyJson(jieCopiedString);
                                jieOutputArea.value = finalResult;
                            } else {
                                jieOutputArea.value = "Invalid JSON data."
                            }
                        } else {
                            this.appCalculation.displayAlert(".json-alert", ".json-alert-message", "Please provide a value.");
                        }
                    });
                }
            });
        });

        const clearJsonBtn = document.querySelector("#jsonClearBtn") as HTMLButtonElement;
        clearJsonBtn.addEventListener("click", () => {
            const jsonData = document.querySelectorAll(`textarea[aria-label="json-data"]`) as NodeListOf<HTMLTextAreaElement>;
            jsonData.forEach((x) => {
                x.value = ""
            });
        });

        const copyJsonBtn = document.querySelector("#jsonCopyBtn") as HTMLButtonElement;
        copyJsonBtn.addEventListener("click", () => {
            const jieOutputArea = document.querySelector("#jsonTextAreaOutput") as HTMLTextAreaElement;
            if (jieOutputArea.value.length >= 1) {
                this.appCalculation.displaySuccess(jieOutputArea.value);
            } else {
                this.appCalculation.displayAlert(".json-alert", ".json-alert-message", "Please provide a value.");
            }
        });

        /**
         * XML Section
         */

        const xmlDataInput = document.querySelector("#xmlTextAreaInput") as HTMLTextAreaElement;
        const xmlDataOutput = document.querySelector("#xmlTextAreaOutput") as HTMLTextAreaElement;
        const formatXmlBtn = document.querySelector("#xmlFormatBtn") as HTMLButtonElement;

        formatXmlBtn.addEventListener("click", () => {
            const data: string = xmlDataInput.value;
            xmlDataOutput.value = this.beautifyXml(data);
        });
    }
}

customElements.define("app-formatters", Formatters);
