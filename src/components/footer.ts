import { Template, IMAGE_SOURCES, IMAGE_SOURCES_ALTERNATIVES } from "./helper.js";
import type * as Types from '../types.js';

const STYLES = {
    footerStyling: "footer-content py-2 px-2 my-1 mx-1 mb-2 d-flex flex-row align-content-center align-items-center justify-content-between rounded-3 shadow-lg"
};

export class Footer extends HTMLElement {
    private templateHelper: Template;
    private version: { [key: string]: string };

    constructor() {
        super();
        this.templateHelper = new Template();

        this.version = {
            number: "v1.0.0",
        }

        const template = this.templateHelper.createTemplate(this.renderFooter());
        this.appendChild(template.content.cloneNode(true));
    }

    private renderFooter(): string {
        return `
            <footer class="${STYLES.footerStyling}">
                <section>
                    ${this.renderFooterRight()}
                </section>
                <section>
                    ${this.renderFooterLeft()}
                </section>
            </footer>
        `;
    }

    private renderFooterRight(): string {
        return `
            <div class="d-flex flex-row gap-2 bg-dark rounded-pill px-2 py-2 mx-0 my-0 shadow-lg pe-none">
                <div id="versionNumber">
                    <h5 class="d-flex flex-row align-items-center justify-content-start text-white mb-0 rounded-pill bg-discovery py-1 px-1 gap-1 shadow-sm">
                        <img src="${IMAGE_SOURCES.auxiliary.version}" class="footer-auxiliary-icon">
                        ${this.version.number}
                    </h5>
                </div>
                <div id="clock">
                    <h5 class="mb-0 bg-discovery text-white py-1 px-1 rounded-pill shadow-sm" id="footerClock"></h5>
                </div>
            </div>
        `;
    }

    private renderFooterLeft(): string {
        // Get the users' browser name data
        const userAgent = navigator.userAgent;

        // Define the array of browser specific icons in this scope to be later used
        const webstoreSources = {
            Edge: IMAGE_SOURCES_ALTERNATIVES.edge,
            Opera: IMAGE_SOURCES_ALTERNATIVES.opera,
            Firefox: IMAGE_SOURCES_ALTERNATIVES.firefox,
        };

        // Find the matching browser key in the user agent string
        const matchingKey = Object.keys(webstoreSources).find(key => userAgent.indexOf(key) > -1);

        // Get the corresponding browser specific icon source, if not, set default to the generic webstore icon
        let webstoreSource = IMAGE_SOURCES.webstore;
        if (matchingKey) {
            webstoreSource = (webstoreSources as { [key: string]: Types.ImageSource })[matchingKey];
        }

        return `
            <div>
                ${this.renderImageLink(IMAGE_SOURCES.support, "Support")}
                ${this.renderImageLink(IMAGE_SOURCES.source, "Website")}
                ${this.renderImageLink(webstoreSource, "Webstore")}
                ${this.renderImageLink(IMAGE_SOURCES.github, "GitHub")}
            </div>
        `;
    }

    // Function to render images in Footer"s Right Side
    private renderImageLink(image: Types.ImageSource, title: string): string {
        // Add "text-decoration: none", "color: transparent" to <a> element because it will try to display a dot in
        // its content since we do not use any text in it. Browser will try to populate it
        // https://stackoverflow.com/a/52566572
        return `
            <a href="${image.ref}" aria-label="${title}" target="_blank" style="text-decoration: none; color: transparent;">
                <img src="${image.src}" class="footer-links img-fluid" title="${title}" alt="${title} Icon">
            </a>
        `;
    }

    // Function to display time in H + M + S in the Footer
    public clockTime(elem: HTMLHeadElement): void {
        const clock = new Date();
        let h = clock.getHours();
        let m = clock.getMinutes();
        let s = clock.getSeconds();

        m = this.checkTime(m);
        s = this.checkTime(s);

        const renderClock = (): string => {
            return `
                ${h + ":" + m + ":" + s}
            `;
        }

        elem.innerHTML = renderClock();
    }

    // Add zeroes if the number is less than 10 for UI clarity
    public checkTime(i: number | any): number {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    connectedCallback() {
        const clock = document.querySelector("#footerClock") as HTMLElement;
        this.clockTime(clock); // Call the function for immediate appearance in the UI
        setInterval(() => this.clockTime(clock), 1000);
    }
}

customElements.define("app-footer", Footer);
