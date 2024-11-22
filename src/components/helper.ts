import type * as Types from "../types.js";

// Create a template content to be appended to every Light DOM
export class Template {
    public createTemplate(content: any): HTMLTemplateElement {
        const template = document.createElement("template");
        template.innerHTML = `
            ${content}
        `;
        return template;
    }
}

// Handle tab overflowing in components
export class Overflowing {
    // Detect overflowing
    public isOverFlowing(target: HTMLElement): boolean {
        if (target.scrollWidth > target.offsetWidth) {
            return true;
        }
        return false;
    }

    // Add the movement menu
    public handleTabOverFlowing(elem: HTMLDivElement, target: string): HTMLElement {
        const tabSwitchingBtnDiv = `
            <div class="tab-switching-buttons-container">
                <div class="position-absolute top-0 start-0 d-flex flex-row align-items-center justify-content-between">
                    <button type="button" id="leftBtn" class="btn btn-default rounded-pill px-1 py-1 z-1" title="Back" style="visibility: hidden;"><img src="/images/icons/nav/left-arrow.svg" class="img-fluid tab-nav-icon"></button>
                </div>
                <div class="position-absolute top-0 end-0 d-flex flex-row align-items-center justify-content-between">
                    <button type="button" id="rightBtn" class="btn btn-default rounded-pill px-1 py-1 z-1" title="Forward"><img src="/images/icons/nav/right-arrow.svg" class="img-fluid tab-nav-icon"></button>
                </div>
            </div>
    `;
        const domifiedDiv: Document = new DOMParser().parseFromString(tabSwitchingBtnDiv, "text/html");
        const navMenu = document.querySelector(target) as HTMLUListElement;

        if (this.isOverFlowing(navMenu) == true) {
            const childNode = domifiedDiv.querySelector(".tab-switching-buttons-container");
            // Avoid null checking error
            if (childNode) {
                elem.appendChild(childNode);

                // Add listeners for right & left button for content movement
                // and for button appearence
                const leftBtn = document.querySelector("#leftBtn") as HTMLButtonElement;
                const rightBtn = document.querySelector("#rightBtn") as HTMLButtonElement;

                // If we use Math.ceil or Math.floor to handle already existing floating-point errors
                // measured in the px format in our element, it doesn't work very good.
                // Instead we apply a tolerance value of 1px and base our calculations on that
                const scrollTolerance = 1;
                rightBtn.addEventListener("click", () => {
                    navMenu.scrollLeft += 200;
                    // Use Math.abs to get the absolute value
                    const atRightEnd = Math.abs(navMenu.scrollLeft + navMenu.clientWidth - navMenu.scrollWidth) < scrollTolerance;
                    rightBtn.style.visibility = atRightEnd ? "hidden" : "visible";
                    leftBtn.style.visibility = "visible";
                });

                leftBtn.addEventListener("click", () => {
                    navMenu.scrollLeft -= 200;

                    const atLeftEnd = navMenu.scrollLeft <= scrollTolerance;
                    leftBtn.style.visibility = atLeftEnd ? "hidden" : "visible";
                    rightBtn.style.visibility = "visible";
                });

                navMenu.addEventListener("scroll", () => {
                    const atRightEnd = Math.abs(navMenu.scrollLeft + navMenu.clientWidth - navMenu.scrollWidth) < scrollTolerance;
                    const atLeftEnd = navMenu.scrollLeft <= scrollTolerance;

                    rightBtn.style.visibility = atRightEnd ? "hidden" : "visible";
                    leftBtn.style.visibility = atLeftEnd ? "hidden" : "visible";
                });
            }
        }
        return elem;
    }
}

export class JSONDataFetching {
    public async getJson(requestTarget: string): Promise<Types.JSONValue[] | any> {
        // Add extra security
        const webAccessDomains = [
            "https://latest.currency-api.pages.dev/",
            "https://cdn.jsdelivr.net"
        ];

        if (!webAccessDomains.some((allowedDomain) => requestTarget.startsWith(allowedDomain))) {
            throw new Error("Untrusted Domain");
        }

        // User headers to define content type & acceptable content parameters
        const headers: Headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");

        // Create a request object
        const request: RequestInfo = new Request(requestTarget, {
            method: "GET",
            headers: headers
        });

        try {
            const response = await fetch(request);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData: Types.JSONValue[] = await response.json();
            // Check if returned data is a valid JSON object or not
            if (!jsonData && typeof jsonData !== "object") {
                throw new Error("Invalid JSON structure");
            }
            return jsonData;
        } catch (error) {
            console.error("Could not retrieve JSON: ", error);
            throw error;
        }
    }
}

export const BASIC_TEMPLATE = {
    classes: {
        ul: "app-calc-ul d-flex flex-row flex-nowrap gap-2 align-items-center justify-content-start position-relative overflow-x-visible",
        button: "component-tab-nav-button btn btn-discovery w-100 fs-4 shadow-lg rounded-3",
        componentElement: "component-tab-content-element py-2 my-2",
        calcButtons: "calc-button btn btn-primary rounded-pill fs-3 w-100 shadow-md px-3 py-3",
        calcButtonsExtra: "calc-keys btn btn-discovery rounded-pill fs-3 fw-medium w-100 shadow-lg px-3 py-3"
    }
}

/**
 * MAIN
 */

export const STYLINGS: {
    [key: string]: { [value: string]: string; };
} = {
    welcome: {
        div: "d-flex flex-column align-items-center justify-content-center gap-2 px-4 py-4",
        imgPath: "/images/icons/robot.svg"
    },
    documentStyling: {
        main: "d-flex flex-column align-content-center justify-content-start",
        mainPlaceholder: "info-placeholder d-flex flex-column align-items-center justify-content-center gap-2"
    },
    ids: {
        dynamicContent: "dynamicContent"
    }
}

/**
 * ASIDE
 */

export const BUTTON_TEMPLATE: {
    [key: string]: { [value: string]: string; };
} = {
    calculation: {
        name: "Calculators",
        imgSrc: "/images/icons/aside/calculators.svg"
    },
    converters: {
        name: "Converters",
        imgSrc: "/images/icons/aside/converters.svg"
    },
    formatters: {
        name: "Formatters",
        imgSrc: "/images/icons/aside/formatters.svg"
    },
    generators: {
        name: "Generators",
        imgSrc: "/images/icons/aside/generators.svg"
    },
    utilities: {
        name: "Utilities",
        imgSrc: "/images/icons/aside/utilities.svg"
    },
    webdev: {
        name: "Web Dev.",
        imgSrc: "/images/icons/aside/webdev.svg"
    },
    ciphers: {
        name: "Ciphers",
        imgSrc: "/images/icons/aside/ciphers.svg"
    }
}

/**
 * FOOTER
 */

export const IMAGE_SOURCES: {
    [key: string]: { [value: string]: string; };
} = {
    source: {
        src: "/images/icons/website.svg",
        ref: ""
    },
    github: {
        src: "/images/icons/github.svg",
        ref: "https://github.com/gokacinlar/dev-toolguide"
    },
    webstore: {
        src: "/images/icons/chrome-webstore.svg",
        ref: ""
    },
    support: {
        src: "/images/icons/support.svg",
        ref: "https://buymeacoffee.com/gokacinlar"
    },
    auxiliary: {
        version: "/images/icons/gear.svg"
    }
};

export const IMAGE_SOURCES_ALTERNATIVES: {
    [key: string]: { [value: string]: string; };
} = {
    firefox: {
        src: "/images/icons/firefox-webstore.svg",
        ref: "https://dervisoksuzoglu.net"
    },
    opera: {
        src: "/images/icons/opera-webstore.svg",
        ref: ""
    },
    edge: {
        src: "/images/icons/edge-webstore.svg",
        ref: ""
    }
}