import { Template, Overflowing, JSONDataFetching } from "./helper.js";
import { ElementStyling } from "../static.js";
import { Footer } from "./footer.js";
import { IpInformation } from "./sys_info.js";
import AppCalculations from "./app_calculations.js";

export default class HomePage extends HTMLElement {
    private template: Template;
    private overflowing: Overflowing;
    private staticElementStylings: ElementStyling;
    private appCalculation: AppCalculations;

    private homepageContent: HomePageContent;
    private homePageHeader: HomePageHeader;

    constructor() {
        super();

        this.staticElementStylings = new ElementStyling();
        this.overflowing = new Overflowing();
        this.template = new Template()
        this.appCalculation = new AppCalculations();


        this.homepageContent = new HomePageContent();
        this.homePageHeader = new HomePageHeader();

        const template = this.template.createTemplate(this.homepageContent.content());
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(): void {
        // HomePageHeader
        this.homepageContent.content();
        this.homePageHeader.getWeatherInfFromIp();
        this.homePageHeader.connectedCallback();
    }
}

class HomePageContent {
    private homePageHeader: HomePageHeader;
    constructor() {
        this.homePageHeader = new HomePageHeader();
    }

    public content(): string {
        return `
            <section>
                <header id="hp-header">${this.homePageHeader.headerTemplate()}</header>
                <section>
                    <article id="hp-body"></article>
                    <aside id="hp-body-aside"></aside>
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
                <div class="bg-dark rounded-3 d-flex flex-row align-items-start justify-content-between">
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

}

class HomePageAside {

}

class HomePageFooter {

}

customElements.define("app-homepage", HomePage);