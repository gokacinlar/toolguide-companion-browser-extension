import { Template, Overflowing } from "./helper.js";
import { ElementStyling } from "../static.js";
import AppCalculations from "./app_calculations.js";

export default class SystemInformation extends HTMLElement {
    private template: Template;
    private staticElementStylings: ElementStyling;
    private overflowing: Overflowing;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    private sysInf = new SysInfo();

    constructor() {
        super();
        this.template = new Template();
        this.staticElementStylings = new ElementStyling();
        this.overflowing = new Overflowing();
        this.appCalculation = new AppCalculations();
        this.Ids = {
            systemInfo: "systemInfo",
        }

        const template = this.template.createTemplate(this.sysInfo());
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

    // Render the main template
    private sysInfo(): string {
        return `
            <div class="web-dev-tab-navigation-buttons">
                <ul class="${this.staticElementStylings.BASIC_TEMPLATE.classes.ul} sysinformation-ulist">
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.systemInfo}">System Information</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="systemInfo" style="display: none;">${this.sysInf.systemInformation()}</div>
            </div>
        `;
    }

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("systemInfo", document);
        // Handle tab overflowing & navigation buttons
        const tabMenu = document.querySelector(".web-dev-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".sysinformation-ulist");

        // Call System Information elements
        this.sysInf.getCpuInfo();
        this.sysInf.getGpuInfo();
        this.sysInf.getRamInfo();
        this.sysInf.getDisplayInfo();
        this.sysInf.getStorageInfo();
    }
}

class SysInfo {
    systemInformation(): string {
        return `
            <section class="overflowing-content">
                <div class="container column px-1 d-flex flex-column gap-2">
                    <div class="input-group input-group-prefix input-group-lg container column px-0">
                        <input type="text" class="form-control ps-2 ps-2" aria-label="CPU Information" aria-describedby="cpuInfo" readonly>
                            <div class="d-flex bd-h-32 text-primary">
                                <div class="vr border border-secondary-subtle border-1 opacity-25"></div>
                            </div>
                        <span class="input-group-text col-2" id="cpuInfo">CPU</span>
                    </div>
                    <div class="input-group input-group-prefix input-group-lg container column px-0">
                        <input type="text" class="form-control ps-2" aria-label="Graphics Card Information" aria-describedby="gpuInfo" readonly>
                            <div class="d-flex bd-h-32 text-primary">
                                <div class="vr border border-secondary-subtle border-1 opacity-25"></div>
                            </div>
                        <span class="input-group-text col-2" id="gpuInfo">GPU</span>
                    </div>
                    <div class="input-group input-group-prefix input-group-lg container column px-0">
                        <input type="text" class="form-control ps-2" aria-label="RAM Information" aria-describedby="ramInfo" readonly>
                        <div class="d-flex bd-h-32 text-primary">
                                <div class="vr border border-secondary-subtle border-1 opacity-25"></div>
                        </div>
                        <span class="input-group-text col-2" id="ramInfo">RAM</span>
                    </div>
                    <div class="input-group input-group-prefix input-group-lg container column px-0">
                        <input type="text" class="form-control ps-2" aria-label="Storage Information" aria-describedby="storageInfo" readonly>
                        <div class="d-flex bd-h-32 text-primary">
                            <div class="vr border border-secondary-subtle border-1 opacity-25"></div>
                        </div>
                        <span class="input-group-text col-2" id="storageInfo">Storage</span>
                    </div>
                    <div class="input-group input-group-prefix input-group-lg container column px-0">
                        <input type="text" class="form-control ps-2" aria-label="Display Information" aria-describedby="displayInfo" readonly>
                        <div class="d-flex bd-h-32 text-primary">
                            <div class="vr border border-secondary-subtle border-1 opacity-25"></div>
                        </div>
                        <span class="input-group-text col-2" id="displayInfo">Display</span>
                    </div>
                </div>
            </section>
        `;
    }

    // Function to get CPU Information
    getCpuInfo = (): void => {
        if (chrome && chrome.system && chrome.system.cpu) {
            chrome.system.cpu.getInfo(cpuInfo => {
                if (!cpuInfo) {
                    console.error("Failed to get CPU information.");
                    return;
                }
                else {
                    const cpuDisplay = document.querySelector(`input[aria-describedby="cpuInfo"]`) as HTMLInputElement;
                    cpuDisplay.value = `${cpuInfo.modelName} | ${cpuInfo.archName}`;
                }
            });
        } else {
            console.error("Chrome Extension APIs are not available.");
        }
    };

    // Function to get GPU info using WebGL
    getGpuInfo = (): Object | null => {
        // WebGL Context Setup
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (!gl) {
            console.error("WebGL not supported.");
            return null;
        }

        const glWebGL = gl as WebGLRenderingContext;
        const debugInfo = glWebGL.getExtension("WEBGL_debug_renderer_info");
        if (!debugInfo) {
            console.warn("WEBGL_debug_renderer_info extension is not supported.");
            return null;
        }

        const vendor = glWebGL.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = glWebGL.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        if (!vendor || !renderer) {
            console.error("Failed to get GPU information.");
            return null;
        }

        const gpuDisplay = document.querySelector(`input[aria-describedby="gpuInfo"]`) as HTMLInputElement;
        return gpuDisplay.value = renderer;;
    }

    // Function to get RAM information (both total & available)
    public getRamInfo = (): void => {
        if (chrome && chrome.system && chrome.system.memory) {
            chrome.system.memory.getInfo(memInfo => {
                const availableCapacityGB: number = parseFloat(this.convertBytesToGb(memInfo.availableCapacity));
                const totalCapacityGB: number = parseFloat(this.convertBytesToGb(memInfo.capacity));

                // Get the USED memory
                const usedMemoryGB = totalCapacityGB - availableCapacityGB;

                const ramDisplay = document.querySelector(`input[aria-describedby="ramInfo"]`) as HTMLInputElement;
                ramDisplay.value = `Total RAM: ${totalCapacityGB.toFixed(2)} GB | Available RAM: ${usedMemoryGB.toFixed(2)} GB`;
            });
        } else {
            console.error("Chrome Extension APIs are not available.");
        }
    }

    // Function to get display information
    public getDisplayInfo = (): void => {
        if (chrome && chrome.system && chrome.system.display) {
            chrome.system.display.getInfo(displayInfo => {
                displayInfo.forEach((display, index) => {
                    const displayJsonInfoProperties: Record<string, any> = {
                        "Monitor Name": display.name,
                        "Width (px)": display.bounds.width,
                        "Height (px)": display.bounds.height,
                    };

                    const displayInfoDisplay = document.querySelector(`input[aria-describedby="displayInfo"]`) as HTMLInputElement;
                    const displayInfoString = Object.keys(displayJsonInfoProperties)
                        .map(key => `${key}: ${displayJsonInfoProperties[key]}`).join(" ");
                    displayInfoDisplay.value = `Display ${index + 1}: ${displayInfoString}`;
                });
            });
        } else {
            console.error("Chrome Extension APIs are not available.");
        }
    }

    // Function to get storage information
    public getStorageInfo = (): void => {
        // Hold our total capacity number to be later used as addition to calculate total space
        let totalCapacityGB: number = 0;
        // Get the storage data within
        // https://developer.chrome.com/docs/extensions/reference/api/system/storage#type-StorageUnitInfo
        if (chrome && chrome.system && chrome.system.storage) {
            chrome.system.storage.getInfo(storageInfo => {
                if (storageInfo) {
                    storageInfo.forEach(storageObj => {
                        // API returns data in bytes format, we need to convert it to GB
                        const storageCapacityGB: string = this.convertBytesToGb(storageObj.capacity);
                        // Addition here
                        totalCapacityGB += parseFloat(storageCapacityGB);
                    });
                } else {
                    console.warn("Error retrieving Storage Information.");
                }

                const storageDisplay = document.querySelector(`input[aria-describedby="storageInfo"]`) as HTMLInputElement;
                storageDisplay.value = `Total Space: ${totalCapacityGB.toFixed(2)} GB`;
            });
        } else {
            console.error("Chrome Extension APIs are not available.");
        }
    }

    // Helper functions
    // Function to convert byte data to gb
    private convertBytesToGb(bytes: number) {
        return (bytes / (1024 ** 3)).toFixed(2);
    }
}

customElements.define("app-sysinfo", SystemInformation);