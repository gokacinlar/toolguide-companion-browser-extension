import { Template, Overflowing } from "./helper.js";
import { ElementStyling } from "../static.js";
import AppCalculations from "./app_calculations.js";

export default class Utilities extends HTMLElement {
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
            urlParser: "urlParser",
            regexTester: "regexTester"
        }

        const template = this.template.createTemplate(this.utilsTemplate());
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

    private utilsTemplate(): string {
        return `
            <div class="position-relative formatters-tab-navigation-buttons">
                <ul class="${this.staticElementStylings.BASIC_TEMPLATE.classes.ul} utils-ulist">
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.urlParser}">URL Parser</button></li>
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.regexTester}">Regex Tester</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="urlParser" style="display: none;">
                    ${this.urlParserTemplate()}
                </div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="regexTester" style="display: none;">
                    ${this.regexTesterTemplate()}
                </div>
        `;
    }

    // URL Parser template
    private urlParserTemplate(): string {
        return `
            <section>
                <div>
                    <div class="input-group mb-3 px-0">
                        <span class="input-group-text" id="parseUrlInput">URL</span>
                        <input type="text" class="form-control" placeholder="Paste URL here..."
                        aria-label="Paste URL here..." aria-describedby="parseUrlInput"/>
                        <button class="btn btn-discovery fs-4" type="button" id="parseUrlBtn">Parse URL</button>
                    </div>
                </div>
                <div class="container column px-0 d-flex flex-column gap-2">
                    ${this.generateUrlParsingOutput("puDomain", "Domain", "Address directing to where your website is located.",
            "puSubdomain", "Subdom.", "A prefix added to a domain name to separate a section of your website.")}
                    ${this.generateUrlParsingOutput("puScheme", "Protocol", "HTTPS to ensure secure communications.",
                "puHost", "Host", "It is the part of the URL that identifies the domain name.")}
                    ${this.generateUrlParsingOutput("puPath", "Path", "It is a part of the URL that identifies the specific file on the server.",
                    "puQuery", "Query", "It is the part of the URL that contains data to be passed to the server as part of the request.")}
                    ${this.generateUrlParsingOutput("puHash", "Hash", "It is the part of the URL that identifies a specific section within a resource.",
                        "puTld", "TLD", "It is Top-Level Domain. Last part of the domain.")}
                </div>
                <div class="alerts d-flex flex-row align-content-center justify-content-between mt-3">
                    <div class="parse-url-alert alert alert-danger transition ease-in-out duration-300 mt-0 mb-0 px-2 py-2 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="parse-url-alert-message mb-0"></h6>
                    </div>
                    <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-0 mb-0 px-2 py-2 rounded-pill" role="alert" style="opacity: 0;">
                        <h6 class="mb-0">Copied to clipboard.</h6>
                    </div>
                </div>
            </section>
        `;
    }

    // Generate data display output elements
    private generateUrlParsingOutput = (id: string, name: string, title1: string, id2: string, name2: string, title2: string): string => {
        return `
            <div class="d-flex flex-row align-items-center justify-content-between gap-2">
                <div class="input-group url-parse-div container column px-0">
                    <span title="${title1}" class="input-group-text col-4" id="${id}">${name}</span>
                    <input type="text" class="form-control" aria-label="${name}" aria-describedby="${id}" readonly>
                </div>
                <div class="input-group url-parse-div container column px-0">
                    <span title="${title2}" class="input-group-text col-4" id="${id2}">${name2}</span>
                    <input type="text" class="form-control" aria-label="${name2}" aria-describedby="${id2}" readonly>
                </div>
            </div>
        `;
    }

    // Function to parse URLs
    private parseUrl(url: string): void {
        if (this.isUrlPatternMatching(url) === false) {
            this.appCalculation.displayAlert(".parse-url-alert", ".parse-url-alert-message", "Invalid URL detected.");
            console.error("Invalid URL detected.");
            return;
        } else {
            try {
                const absoluteUrl: URL = new URL(url);
                // Define the mapping between URL parts and DOM elements
                const outputMapping: { [key: string]: keyof URL } = {
                    puDomain: "hostname",
                    puSubdomain: "hostname",
                    puScheme: "protocol",
                    puHost: "host",
                    puPath: "pathname",
                    puQuery: "search",
                    puHash: "hash",
                    puTld: "hostname"
                };

                Object.keys(outputMapping).forEach((key) => {
                    const targetElement = document.querySelector(`input[aria-describedby="${key}"]`) as HTMLInputElement;
                    if (targetElement) {
                        // Define our manageable value variable to be manipulated
                        let value: string;

                        // If subdomain is detected, split the URL with including sd as first value
                        if (key === "puSubdomain") {
                            // Split the URL first
                            const parts = absoluteUrl.hostname.split(".");
                            // Extract the subdomain
                            value = parts.length > 2 ? parts.slice(0, -2).join(".") : "N/A";
                        } else if (key === "puTld") {
                            // Extract TLD, same logic
                            const parts = absoluteUrl.hostname.split(".");
                            value = parts.length > 1 ? parts[parts.length - 1] : "N/A";
                        } else {
                            const urlPart = absoluteUrl[outputMapping[key] as keyof URL];
                            value = typeof urlPart === "string" ? urlPart : urlPart ? urlPart.toString() : "N/A";
                        }
                        targetElement.value = value;

                        if (!targetElement.value.length) {
                            targetElement.value = "-"
                        }
                    } else {
                        console.warn(`DOM element with class "${key}" not found.`);
                    }
                });
            } catch (error: unknown) {
                console.error("Error parsing URL:", error);
            }
        }
    }

    // Check if our URL contains literally URL patterns with simply
    // taking protocol as our base checking point
    public isUrlPatternMatching(elem: string): boolean {
        const URL_PROTOCOLS: Array<string> = ["http://", "https://"];
        // Validate input URL & search of literal URL pattern with our protocol as base
        if (elem.startsWith(URL_PROTOCOLS[0]) || elem.startsWith(URL_PROTOCOLS[1])) {
            return true;
        } else {
            return false;
        }
    }

    // Check if protocol is HTTPS or not
    private checkHttpsStatus = (elem: HTMLInputElement): boolean => {
        const pattern: RegExp = /^https:/; // Match only `https`
        return pattern.test(elem.value.trim());
    }

    // Regex Tester Template
    private regexTesterTemplate(): string {
        return `
            <section class="overflowing-content">
                <div class="d-flex flex-column">
                    <div>
                        <label for="textToBeTested" class="form-label fs-6">Please paste your target text below:</label>
                        <div class="input-group mb-3 container column px-0">
                            <span class="input-group-text col-2" id="regExpTestString">Text</span>
                            <input type="text" class="form-control" id="textToBeTested" aria-describedby="regExpTestString"/>
                        </div>
                    </div>
                    <div>
                        <label for="regexPattern" class="form-label fs-6">Please paste your <span class="text-decoration-underline decoration-1">
                        Regex Pattern</span> below:</label>
                        <div class="input-group mb-3 container column px-0">
                            <span class="input-group-text col-2" id="regExpPattern">Regex</span>
                            <input type="text" class="form-control" id="regexPattern" aria-describedby="regExpPattern"/>
                        </div>
                    </div>
                    <div class="regex-test-btn-div">
                        <button id="testRegexBtn" class="btn btn-discovery rounded-pill fs-4 shadow-lg w-100">Test Regex</button>
                        <div id="regexTestResult" class="mt-3 w-100 fs-5"></div>
                    </div>
                    <div class="alerts d-flex flex-row align-content-center justify-content-between mt-3">
                        <div class="regex-tester-alert alert alert-danger transition ease-in-out duration-300 mt-0 mb-0 px-2 py-2 rounded-pill" role="alert" style="opacity: 0;">
                            <h6 class="regex-tester-alert-message mb-0"></h6>
                        </div>
                        <div class="color-code-success alert alert-success transition ease-in-out duration-300 mt-0 mb-0 px-2 py-2 rounded-pill" role="alert" style="opacity: 0;">
                            <h6 class="mb-0">Copied to clipboard.</h6>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("urlParser", document);
        const tabMenu = document.querySelector(".formatters-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".utils-ulist");

        // URL Parsing
        this.initUrlParsing();

        // Regex Tester
        this.initRegexTester();
    }

    initUrlParsing(): void {
        const parseUrlBtn = document.querySelector("#parseUrlBtn") as HTMLButtonElement;
        parseUrlBtn.addEventListener("click", () => {
            // Trim the input spaces first & clear the console
            console.clear();
            const inputElements = document.querySelectorAll("url-parse-div > input") as NodeListOf<HTMLInputElement>;
            inputElements.forEach((x) => {
                x.value = "";
            });
            const urlParseInput = document.querySelector(`input[aria-describedby="parseUrlInput"]`) as HTMLInputElement;
            const stringifiedInput = urlParseInput.value.toString();
            if (!stringifiedInput.length) {
                this.appCalculation.displayAlert(".parse-url-alert", ".parse-url-alert-message", "Please provide a value.");
            } else {
                this.parseUrl(urlParseInput.value);
                const urlParsingProtocolInputStatus = document.querySelector(`input[aria-describedby="puScheme"]`) as HTMLInputElement;
                if (this.checkHttpsStatus(urlParsingProtocolInputStatus) === false) {
                    urlParsingProtocolInputStatus.setAttribute("title", "This URL has an unencrypted HTTP connection.");
                    urlParsingProtocolInputStatus.classList.add("border-danger");
                } else {
                    urlParsingProtocolInputStatus.removeAttribute("title");
                    urlParsingProtocolInputStatus.classList.remove("border-danger");
                }
            }
        });
    }

    initRegexTester(): void {
        const testRegexBtn = document.querySelector("#testRegexBtn") as HTMLButtonElement;
        testRegexBtn.addEventListener("click", () => {
            const textToBeTestedInput = document.querySelector(`input[aria-describedby="regExpTestString"]`) as HTMLInputElement;
            const regexPatternInput = document.querySelector(`input[aria-describedby="regExpPattern"]`) as HTMLInputElement;
            // Convert the inputs to strings first
            const textToBeTested = textToBeTestedInput.value.toString();
            const regexPattern = regexPatternInput.value.toString();

            if (!textToBeTested.length || !regexPattern.length) {
                this.appCalculation.displayAlert(".regex-tester-alert", ".regex-tester-alert-message", "Please provide both text and regex pattern.");
            } else {
                try {
                    const regex: RegExp = new RegExp(regexPattern, "g");
                    const testResult = regex.test(textToBeTested);
                    // Use a Div because input doesn't recognize styled fonts
                    const regexTestResultDiv = document.querySelector("#regexTestResult") as HTMLDivElement;
                    // Highlight the matching string with bold font
                    const highlightedText = textToBeTested.replace(regex, (match) => `<u><b>${match}</b></u>`);
                    regexTestResultDiv.innerHTML = `Regex Test Result: ${highlightedText}`;
                } catch (error: unknown) {
                    // Catch if any error occurs
                    const regexTestResultDiv = document.querySelector("#regexTestResult") as HTMLDivElement;
                    regexTestResultDiv.innerHTML = `Error: ${error}`;
                }
            }
        });
    }
}

customElements.define("app-utils", Utilities);