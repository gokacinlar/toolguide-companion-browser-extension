// Create a template content to be appended to Shadow DOM
export class Template {
    public createTemplate(styles: string, content: any): HTMLTemplateElement {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                ${styles}
            </style>
            ${content}
        `;
        return template;
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