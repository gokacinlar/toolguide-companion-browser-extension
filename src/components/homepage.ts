import { Template, Overflowing, UIElems } from "./helper.js";
import { ElementStyling } from "../static.js";
import AppCalculations from "./app_calculations.js";
import type * as Types from '../types.js';

export default class HomePage extends HTMLElement {
    private template: Template;
    private overflowing: Overflowing;
    private staticElementStylings: ElementStyling;
    private appCalculation: AppCalculations;
    private Ids: Types.Ids;

    private homepageContent: HomePageContent;
    private HomePageHeader: HomePageHeader;

    constructor() {
        super();

        this.staticElementStylings = new ElementStyling();
        this.overflowing = new Overflowing();
        this.template = new Template()
        this.appCalculation = new AppCalculations();

        this.homepageContent = new HomePageContent();
        this.HomePageHeader = new HomePageHeader();

        this.Ids = {
            chatGpt: "chatGpt",
        }

        const template = this.template.createTemplate(this.homepageContent.content());
        this.appendChild(template.content.cloneNode(true));
    }
}

class HomePageContent {
    public content(): string {
        return `

        `;
    }
}

class HomePageHeader {

}

class HomePageBody {

}

class HomePageFooter {

}

customElements.define("app-homepage", HomePage);