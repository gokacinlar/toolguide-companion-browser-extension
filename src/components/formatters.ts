import { Template, Overflowing } from "./helper.js";
import { ElementStyling } from "../static.js";
import AppCalculations from "./app_calculations.js";

export default class Formatters extends HTMLElement {
    private template: Template;
    private staticElementStylings: ElementStyling;
    private overflowing: Overflowing;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string }

    constructor() {
        super();
        this.template = new Template();
        this.staticElementStylings = new ElementStyling();
        this.overflowing = new Overflowing();
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
            <div class="position-relative formatters-tab-navigation-buttons">
                <ul class="${this.staticElementStylings.BASIC_TEMPLATE.classes.ul} formatters-ulist">
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.jsonFormatter}">JSON</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.xmlFormatter}">XML</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.htmlFormatter}">HTML</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.cssFormatter}">CSS</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.javaScriptFormatter}">JavaScript</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="jsonFormatter" style="display: none;">
                    ${this.jsonFormatter()}
                </div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="xmlFormatter" style="display: none;">
                    ${this.xmlFormatter()}
                </div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="htmlFormatter" style="display: none;">
                    ${this.htmlFormatter()}
                </div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="cssFormatter" style="display: none;">
                    ${this.cssFormatter()}
                </div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="javaScriptFormatter" style="display: none;">
                    ${this.jsFormatter()}
                </div>
        `;
    }

    private jsonFormatter(): string {
        return `
            <section class="container row mx-0 px-0 d-flex align-content-center justify-content-around position-relative">
                <div id="jsonInput" class="col-5 mx-0 px-0">
                    <div id="jiBtns" class="mb-3">
                        <div class="btn-group d-flex flex-row align-content-center justify-content-between gap-2" role="group" aria-label="JavaScript Formatting Options">
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
                                <input type="radio" class="btn-check" name="btnradio-xml" id="btnradio3" autocomplete="off" checked/>
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
        return `Coming soon...`;
    }

    private cssFormatter(): string {
        return `Coming soon...`;
    }

    private jsFormatter(): string {
        return `Coming soon...`;
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

    // Function to detect XML patterns
    private isXml(xmlStringInput: string): boolean {
        // Parse the input string as XML using DOMParser()
        // instead of regex: /<([^>]+)>/g
        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(xmlStringInput, "application/xml");

        // Check if the parsed document has a parsererror
        return !parsedDoc.querySelector("parsererror");
    }

    // Function to beautify XML
    private beautifyXml(elem: string): string {
        // Use XML parsing library instead of regex
        // it removes any headache https://stackoverflow.com/a/47317538
        // not working in firefox: https://stackoverflow.com/questions/51989864/undefined-undefined-error-when-calling-xsltprocessor-prototype-importstylesheet
        const xmlDoc = new DOMParser().parseFromString(elem, "application/xml");
        // Detect the parseerror output and display a simple error message instead of whole context
        const parserError = xmlDoc.querySelector("parsererror");
        // Return error message if XML parsing fails
        if (parserError) {
            return `Invalid XML: ${parserError.textContent?.trim()}`;
        }

        // Create XSLT document for formatting XML
        const xsltDoc = new DOMParser().parseFromString(`
        <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
            <xsl:output method="xml" indent="yes"/>
            <xsl:strip-space elements="*"/>
            <xsl:template match="node()|@*">
                <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>
            </xsl:template>
        </xsl:stylesheet>`, "application/xml");

        // Produce the XML document & initialize it
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);

        // Apply transformation to beautify the XML
        const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        return new XMLSerializer().serializeToString(resultDoc);
    }

    connectedCallback(): void {
        this.handleNavigation(); // Set up event listeners for navigation buttons
        this.appCalculation.openPage("jsonFormatter", document);
        // Handle tab overflowing & navigation buttons
        const tabMenu = document.querySelector(".formatters-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".formatters-ulist");

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
            if (this.isXml(data)) {
                xmlDataOutput.value = this.beautifyXml(data);
            } else {
                xmlDataOutput.value = "Invalid XML data.";
                console.error("Invalid XML data.");
                return;
            }
        });
    }
}

customElements.define("app-formatters", Formatters);
