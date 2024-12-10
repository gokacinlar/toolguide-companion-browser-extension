import { Template, Overflowing } from "./helper.js";
import { ElementStyling } from "../static.js";
import AppCalculations from "./app_calculations.js";
import type * as Types from '../types.js';

export default class SystemInformation extends HTMLElement {
    private template: Template;
    private staticElementStylings: ElementStyling;
    private overflowing: Overflowing;
    private appCalculation: AppCalculations;
    private Ids: { [key: string]: string };

    private sysInf = new SysInfo();
    private netInf = new NetInfo();

    constructor() {
        super();
        this.template = new Template();
        this.staticElementStylings = new ElementStyling();
        this.overflowing = new Overflowing();
        this.appCalculation = new AppCalculations();
        this.Ids = {
            systemInfo: "systemInfo",
            netInfo: "netInfo"
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
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.netInfo}">Network Information</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="systemInfo" style="display: none;">${this.sysInf.systemInformation()}</div>
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="netInfo" style="display: none;">${this.netInf.networkInformation()}</div>
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

        // Call Network Information elements
        // NetworkInformation API only works in Chrome for now
        // https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/type#browser_compatibility
        // thus add a fallback: https://stackoverflow.com/a/54038434/26540420
        if (navigator.userAgent.indexOf("Chrome") != -1) {
            // Add online and offline event listeners globally
            const alertDiv = document.querySelector("#alertDiv") as HTMLDivElement;
            const isConnectedMessage = document.querySelector("#isConnected") as HTMLHeadingElement;

            // Attach online and offline event listeners
            window.addEventListener("offline", () => {
                console.log("Offline event triggered");
                this.netInf.updateAlertStatus(alertDiv, false);
                isConnectedMessage.textContent = "Computer is NOT connected to network.";
            });

            window.addEventListener("online", () => {
                console.log("Online event triggered");
                isConnectedMessage.textContent = "Computer is connected to network.";
                this.netInf.updateNetworkStatus(); // Refresh network status
            });

            // Initial network status update
            this.netInf.updateNetworkStatus();
        }
    }
}

// System Information Class
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
    public getCpuInfo = (): void => {
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
    public getGpuInfo = (): Object | null => {
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

// System Netwrok Class
class NetInfo {
    networkInformation(): string {
        return `
            <section class="overflowing-content container column px-1">
                <div>
                    <div id="alertDiv" class="alert mb-0" role="alert">
                        <div class="d-flex flex-row align-items-center justify-content-start gap-4 my-0 py-0 fs-5">
                            <div>
                                <span>
                                    <img class="img-fluid help-icon-min" src="/images/icons/etc/check-circle.svg">
                                </span>
                            </div>
                            <div>
                                <h4 id="isConnected" class="mb-0"></h4>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column mt-3">
                        <div class="input-group mb-3 container column px-0">
                            <span class="input-group-text col-3" id="netQuality">Network Quality</span>
                            <input type="text" class="form-control" placeholder="(e.g., 4g, 3g, 2g etc.)" aria-label="Network Quality" aria-describedby="netQuality" readonly/>
                            <span class="input-group-text">
                                <a href="https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType" class="link-info" target="_blank">?</a>
                            </span>
                        </div>
                        <div class="input-group mb-3 container column px-0">
                            <span class="input-group-text col-3" id="downSpeed">Download Speed</span>
                            <input type="text" class="form-control" placeholder="Effective bandwith in mbps" aria-label="Download Speed" aria-describedby="downSpeed" readonly/>
                            <span class="input-group-text">
                                <a href="https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlink" class="link-info" target="_blank">?</a>
                            </span>
                        </div>
                        <div class="input-group mb-3 container column px-0">
                            <span class="input-group-text col-3" id="rtt">Round-trip Time</span>
                            <input type="text" class="form-control" placeholder="approximate MS" aria-label="Round-trip Time" aria-describedby="rtt" readonly/>
                            <span class="input-group-text">
                                <a href="https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/rtt" class="link-info" target="_blank">?</a>
                            </span>
                        </div>
                        <div class="input-group mb-3 container column px-0">
                            <span class="input-group-text col-3" id="dataSaver">Data Saver Mode</span>
                            <input type="text" class="form-control" placeholder="enabled or disabled" aria-label="Data Saver Mode" aria-describedby="dataSaver" readonly/>
                            <span class="input-group-text">
                                <a href="https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData" class="link-info" target="_blank">?</a>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // Update network status and append data
    public updateNetworkStatus = (): void => {
        try {
            const navigatorWithConnection = navigator as Types.NavigatorExtended;

            // Check if Network Information API is supported
            const connection = navigatorWithConnection.connection;
            if (!connection) {
                console.error("Network Information API is not supported in this browser.");
                return;
            }

            // Retrieve connection properties
            const { effectiveType = "unknown", downlink = 0, rtt = 0, saveData = false } = connection;

            // Populate input fields
            const netQuality = document.querySelector(`input[aria-describedby="netQuality"]`) as HTMLInputElement;
            const downSpeed = document.querySelector(`input[aria-describedby="downSpeed"]`) as HTMLInputElement;
            const rttValue = document.querySelector(`input[aria-describedby="rtt"]`) as HTMLInputElement;
            const dataSaver = document.querySelector(`input[aria-describedby="dataSaver"]`) as HTMLInputElement;

            netQuality.value = effectiveType;
            downSpeed.value = `${downlink} Mbps`;
            rttValue.value = `${rtt} ms`;
            dataSaver.value = saveData ? "Enabled" : "Disabled";
        } catch (error: unknown) {
            console.error("Error during measuring internet connection:", error instanceof Error ? error.message : error);
        }
    };

    // Manipulate alert div if network is connected or disconnected
    public updateAlertStatus = (element: HTMLDivElement, isConnected: boolean): void => {
        console.log(`Updating alert status. Connected: ${isConnected}`);
        if (isConnected) {
            element.classList.remove("alert-warning");
            element.classList.add("alert-success");
        } else {
            element.classList.remove("alert-success");
            element.classList.add("alert-warning");
        }
    };
}

customElements.define("app-sysinfo", SystemInformation);