import { Template, Overflowing, JSONDataFetching, HomePageElems } from "./helper.js";
import { ElementStyling } from "../static.js";
import { Footer } from "./footer.js";
import { IpInformation } from "./sys_info.js";
import AppCalculations from "./app_calculations.js";

export default class HomePage extends HTMLElement {
    private template: Template;

    private homepageContent: HomePageContent;
    private homePageHeader: HomePageHeader;
    private homePageBody: HomePageBody

    constructor() {
        super();
        this.template = new Template()

        this.homepageContent = new HomePageContent();
        this.homePageHeader = new HomePageHeader();
        this.homePageBody = new HomePageBody();

        const template = this.template.createTemplate(this.homepageContent.content());
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(): void {
        // HomePageHeader
        this.homepageContent.content();
        this.homePageHeader.getWeatherInfFromIp();
        this.homePageHeader.connectedCallback();

        // HomePageBody
        this.homePageBody.startCpuMonitoring();
        this.homePageBody.calculateRamUsage();
    }
}

class HomePageContent {
    private homePageHeader: HomePageHeader;
    private homePageBody: HomePageBody;
    private homePageAside: HomePageAside;
    constructor() {
        this.homePageHeader = new HomePageHeader();
        this.homePageBody = new HomePageBody();
        this.homePageAside = new HomePageAside();
    }

    public content(): string {
        return `
            <section>
                <header id="hp-header">${this.homePageHeader.headerTemplate()}</header>
                <section id="hp-body-container" class="container px-0 mt-2 d-flex flex-row justify-content-between gap-1">
                    <article id="hp-body" class="col-8 shadow-sm">${this.homePageBody.hpbBodyTemplate()}</article>
                    <aside id="hp-body-aside" class="w-100 shadow-sm">${this.homePageAside.hpbAsideTemplate()}</aside>
                </section>
                <footer id="hp-footer"></footer>
            </section>
        `;
    }
}

class HomePageHeader {
    private footer: Footer;
    private ipInfo: IpInformation;

    constructor() {
        this.footer = new Footer();
        this.ipInfo = new IpInformation();
    }

    public headerTemplate(): string {
        return `
            <section>
                <div class="hp-bg rounded-3 d-flex flex-row align-items-start justify-content-between">
                    <div>
                        <img class="hp-logo m-1" src="/images/logo/final-icon-without-text.png" class="shadow-sm"
                        alt="Toolguide Companion Logo" title="Toolguide Companion"/>
                    </div>
                    <div>
                        <div class="d-flex flex-column justify-content-between align-items-end pe-2">
                            <h4 class="hp-clock text-white mb-0"></h4>
                            <h4 class="hp-weather text-white mb-0"></h4>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // This is an unreliable way for weather forecasts but in client-side
    // since, such as, using a vpn or a proxy changes the ip and
    // thus location itself but there is not much option to get the
    // weather forecast for free (we can use openweather api anyways)
    // we keep the costs zero in this hood!
    public async getWeatherInfFromIp(): Promise<void> {
        const weatherElement = document.querySelector(".hp-weather") as HTMLHeadingElement;
        weatherElement.innerHTML = `<span class="spinner"></span>`;

        try {
            const ip = await this.ipInfo.getIpAddress();
            const latlongResponse = await fetch(`https://ipapi.co/${ip}/latlong/`);
            const latlongText = await latlongResponse.text();

            if (!latlongText.includes(",")) {
                throw new Error("Invalid latlong response format");
            }

            const [lat, lon] = latlongText.trim().split(",");
            const encodedLatLon = encodeURIComponent(`${lat},${lon}`);
            const weatherResponse = await fetch(`https://wttr.in/${encodedLatLon}?format=%C+%t`, {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "text/plain"
                }
            });

            if (!weatherResponse.ok) {
                throw new Error(`Weather API error: ${weatherResponse.status} ${weatherResponse.statusText}`);
            }

            const weatherText = await weatherResponse.text();
            weatherElement.textContent = `Weather: ${weatherText}`;
        } catch (error) {
            console.error("Error fetching weather information:", error);
            weatherElement.textContent = "Error during weather fetch. See console.";
        }
    }

    connectedCallback(): void {
        const hpClock = document.querySelector(".hp-clock") as HTMLHeadingElement;
        setInterval(() => this.footer.clockTime(hpClock), 1000);
    }
}

class HomePageBody {
    private homepageElems: HomePageElems;
    constructor() {
        this.homepageElems = new HomePageElems();
    }

    public hpbBodyTemplate(): string {
        return `
            <section>
                <div id="hp-body-content" class="hp-bg hpb-widgets grid-container rounded-3 p-1">
                    <article class="border rounded-2 p-1">
                    </article>
                    <article class="border rounded-2 p-1">

                    </article>
                    <article class="border rounded-2 p-1">

                    </article>
                    <article class="border rounded-2 p-1">
                        ${this.hpbSystemGraphInfo()}
                    </article>
                </div>
            </section>
        `;
    }

    public hpbSystemGraphInfo(): string {
        return `
            <div class="cpu-usage-visualized d-flex flex-column align-items-start justify-content-around gap-1">
                <div class="w-100">
                    <label for="cpuVis" class="text-white">CPU Usage: <span class="hbpSg-label"></span></label>
                    <div class="progress pb-bar-parent bg-dark-subtle d-flex flex-row gap-1 mb-4" role="progressbar" aria-label="CPU Usage">
                        <div id="cpuVis" class="progress-bar progress-bar-striped progress-bar-animated bg-info"></div>
                    </div>
                    <label for="ramVis" class="text-white">RAM Usage: <span class="hbpSg-label-ram"></span></label>
                    <div class="progress pb-bar-parent bg-dark-subtle d-flex flex-row gap-1" role="progressbar" aria-label="RAM Usage">
                        <div id="ramVis" class="progress-bar progress-bar-striped progress-bar-animated bg-info"></div>
                    </div>
                </div>
            </div>
        `;
    }

    public previousCpuTimes: any = null;
    public calculateCpuUsage(processors: any) {
        // Reset the cpu times first
        let totalKernelTime = 0, totalUserTime = 0, totalIdleTime = 0, totalTime = 0;

        if (!this.previousCpuTimes) {
            this.previousCpuTimes = processors.map((proc: { usage: { kernel: number, user: number, idle: number, total: number } }) =>
                ({ ...proc.usage }));
            return 0; // Initial call returns 0% usage
        }

        // Calculate the total cpu times for each category
        processors.forEach((proc: { usage: { kernel: number, user: number, idle: number, total: number } }, index: number) => {
            const prevProc = this.previousCpuTimes[index];
            const kernelDiff = proc.usage.kernel - prevProc.kernel;
            const userDiff = proc.usage.user - prevProc.user;
            const idleDiff = proc.usage.idle - prevProc.idle;
            const totalDiff = kernelDiff + userDiff + idleDiff;

            totalKernelTime += kernelDiff;
            totalUserTime += userDiff;
            totalIdleTime += idleDiff;
            totalTime += totalDiff;

            this.previousCpuTimes[index] = { ...proc.usage };
        });

        return totalTime ? ((totalKernelTime + totalUserTime) / totalTime) * 100 : 0;
    }

    // Visual representation of the CPU usage
    public updateCpuUsage(): void {
        chrome.system.cpu.getInfo(cpuInfo => {
            const usagePercentage = this.calculateCpuUsage(cpuInfo.processors).toFixed(2);
            const progressBar = document.querySelector(".pb-bar-parent") as HTMLDivElement;
            const progressBarLabel = document.querySelector(".hbpSg-label") as HTMLLabelElement;
            const progressBarChild = document.querySelector("#cpuVis") as HTMLDivElement;
            if (progressBar) {
                progressBarChild.style.width = `${usagePercentage}%`;
                progressBarLabel.innerText = `${usagePercentage}%`;
                this.updateProgressBarClass(progressBarChild, parseFloat(usagePercentage));
                progressBar.setAttribute("aria-valuenow", usagePercentage);
            }
        });
    }

    public updateProgressBarClass(progressBar: HTMLDivElement | HTMLProgressElement, usagePercentage: number) {
        const progressBarStyling = {
            basicStyling: "progress-bar progress-bar-striped progress-bar-animated",
            bgp: "bg-primary",
            bgw: "bg-warning",
            bgd: "bg-danger"
        };

        if (usagePercentage < 50) {
            progressBar.setAttribute("class", `${progressBarStyling.basicStyling} ${progressBarStyling.bgp}`);
        } else if (usagePercentage >= 50 && usagePercentage <= 75) {
            progressBar.setAttribute("class", `${progressBarStyling.basicStyling} ${progressBarStyling.bgw}`);
        } else {
            progressBar.setAttribute("class", `${progressBarStyling.basicStyling} ${progressBarStyling.bgd}`);
        }
    }

    public startCpuMonitoring(): void {
        setInterval(() => this.updateCpuUsage(), 500);
    }

    // Function to get memory usage
    public calculateRamUsage(): void {
        const ramProgressBar = document.getElementById("ramVis") as HTMLProgressElement;
        const ramProgressBarLabel = document.querySelector(".hbpSg-label-ram") as HTMLLabelElement;

        const refreshRamUsage = () => {
            chrome.system.memory.getInfo(memInfo => {
                const availableCapacityGB = this.homepageElems.convertBytesToGb(memInfo.availableCapacity);
                const totalCapacityGB = this.homepageElems.convertBytesToGb(memInfo.capacity);
                const usedMemoryGB: number = parseFloat(totalCapacityGB) - parseFloat(availableCapacityGB);
                const usedMemoryPercentage = (usedMemoryGB / parseFloat(totalCapacityGB)) * 100;

                ramProgressBar.style.width = `${usedMemoryPercentage.toFixed(2)}%`;
                ramProgressBar.textContent = `${usedMemoryPercentage.toFixed(2)}% used`;
                ramProgressBarLabel.textContent = `${usedMemoryPercentage.toFixed(2)}%`;
                this.updateProgressBarClass(ramProgressBar, usedMemoryPercentage);
            });
        }

        setInterval(refreshRamUsage, 500);
    }
}

class HomePageAside {
    public hpbAsideTemplate(): string {
        return `
            <section>
                <div id="hp-aside-content" class="hp-bg rounded-3">

                </div>
            </section>
        `;
    }
}

class HomePageFooter {

}

customElements.define("app-homepage", HomePage);