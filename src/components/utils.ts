import { Template, Overflowing } from "./helper.js";
import { ElementStyling } from "../static.js";
import AppCalculations from "./appCalculations.js";
import { parse } from "../../node_modules/mathjs/types/index.js";

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
                <ul class="${this.staticElementStylings.BASIC_TEMPLATE.classes.ul} formatters-ulist">
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.urlParser}">URL Parser</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="urlParser" style="display: none;">
                    ${this.urlParserTemplate()}
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
                ${this.generateUrlParsingOutput("puDomain", "Domain", "puSubdomain", "Subdom.")}
                ${this.generateUrlParsingOutput("puScheme", "Protocol", "puHost", "Host")}
                ${this.generateUrlParsingOutput("puPath", "Path", "puQuery", "Query")}
                ${this.generateUrlParsingOutput("puHash", "Hash", "puTld", "TLD")}
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
    private generateUrlParsingOutput = (id: string, name: string, id2: string, name2: string): string => {
        return `
            <div class="d-flex flex-row align-items-center justify-content-between gap-2">
                <div class="input-group container column px-0">
                    <span class="input-group-text col-4" id="${id}">${name}</span>
                    <input type="text" class="form-control" aria-label="${name}" aria-describedby="${id}" readonly>
                </div>
                <div class="input-group container column px-0">
                    <span class="input-group-text col-4" id="${id2}">${name2}</span>
                    <input type="text" class="form-control" aria-label="${name2}" aria-describedby="${id2}" readonly>
                </div>
            </div>
        `;
    }

    // Function to parse URLs
    private parseUrl(url: string) {
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

                    console.log(value);
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

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("urlParser", document);
        const tabMenu = document.querySelector(".formatters-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".formatters-ulist");

        // URL Parsing
        const parseUrlBtn = document.querySelector("#parseUrlBtn") as HTMLButtonElement;
        parseUrlBtn.addEventListener("click", () => {
            const urlParseInput = document.querySelector(`input[aria-describedby="parseUrlInput"]`) as HTMLInputElement;
            const stringifiedInput = urlParseInput.value.toString();
            if (!stringifiedInput.length) {
                this.appCalculation.displayAlert(".parse-url-alert", ".parse-url-alert-message", "Please provide a value.");
            } else {
                this.parseUrl(urlParseInput.value);
            }
        });
    }
}

customElements.define("app-utils", Utilities);