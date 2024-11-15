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

export const BASIC_TEMPLATE = {
    classes: {
        ul: "app-calc-ul d-flex flex-row gap-2 align-items-center justify-content-start",
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

// Function to get JSON data to be appended into DOM using REST

/*

interface AppVersionNumber {
    version: string;
}

export class AppVersion {
    public async getVersion(): Promise<AppVersionNumber[] | any> {
        // User headers
        const headers: Headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");

        // Create a request object
        const request: RequestInfo = new Request("/manifest.json", {
            method: "GET",
            headers: headers
        });

        try {
            const response = await fetch(request);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData: AppVersionNumber[] = await response.json();
            return jsonData;
        } catch (error) {
            console.error("Could not retrieve JSON: ", error);
            throw error;
        }
    }

    // Function to fetch the version from getVersion() and update the DOM via async
    public async fetchVersion(elem: HTMLElement | null) {
        try {
            const versionData = await this.getVersion();
            if (versionData) {
                const version = JSON.stringify(versionData); // Access the version property ONLY
                if (elem) {
                    elem.textContent = version;
                }
            }
        } catch (error) {
            console.error("Error fetching version:", error);
        }
    }
}

*/