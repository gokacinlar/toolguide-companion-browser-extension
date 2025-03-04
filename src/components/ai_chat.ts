import { Template, Overflowing, UIElems } from "./helper.js";
import { ElementStyling } from "../static.js";
import AppCalculations from "./app_calculations.js";
import type * as Types from '../types.js';

export default class AiChat extends HTMLElement {
    private template: Template;
    private overflowing: Overflowing;
    private staticElementStylings: ElementStyling;
    private appCalculation: AppCalculations;
    private Ids: Types.Ids;
    private chatGpt: ChatGPT;

    constructor() {
        super();

        this.staticElementStylings = new ElementStyling();
        this.overflowing = new Overflowing();
        this.template = new Template()
        this.appCalculation = new AppCalculations();
        this.chatGpt = new ChatGPT();

        this.Ids = {
            chatGpt: "chatGpt",
        }

        const template = this.template.createTemplate(this.aiChat());
        this.appendChild(template.content.cloneNode(true));
    }

    // Function to open corresponding data-page in DOM through buttons
    public handleNavigation() {
        const navButtons = document.querySelectorAll<HTMLButtonElement>(".component-tab-nav-button");

        if (navButtons) {
            navButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const pageName = button.getAttribute("data-page");
                    this.appCalculation.openPage(pageName, document); // Use the optional chaining operator to ensure shadowRoot is not null
                });
            });
        }
    }

    // Render the main template
    public aiChat(): string {
        return `
            <div class="position-relative converters-tab-navigation-buttons">
                <ul class="${this.staticElementStylings.BASIC_TEMPLATE.classes.ul} converters-ulist">
                    <li><button class="${this.staticElementStylings.BASIC_TEMPLATE.classes.button}" data-page="${this.Ids.chatGpt}">ChatGPT</button></li>
                </ul>
            </div>
            <div id="content">
                <div class="${this.staticElementStylings.BASIC_TEMPLATE.classes.componentElement}" id="chatGpt" style="display: none;">${this.chatGpt.template()}</div>
            </div>
        `;
    }

    connectedCallback(): void {
        this.handleNavigation();
        this.appCalculation.openPage("chatGpt", document);
        // Handle tab overflowing & navigation buttons
        const tabMenu = document.querySelector(".converters-tab-navigation-buttons") as HTMLDivElement;
        this.overflowing.handleTabOverFlowing(tabMenu, ".converters-ulist");

        // AI Chat interface
        this.chatGpt.template();
        // Initialize the chatGpt
        this.chatGpt.initChat();
    }
}


class ChatGPT {
    public template(): string {
        return `
            <section class="overflowing-content">
                <div id="chatGptOutputArea" class="border border-discovery-subtle border-2 rounded-2 mb-3 p-2"></div>
                <div>
                    <div class="input-group container px-0">
                        <textarea id="chat-input" class="form-control chatgpt-input-area" aria-label="ChatBot Prompt Area" placeholder="Type your message..."></textarea>
                        <button id="send-button" class="btn btn-outline-discovery col-2 fs-5" type="button">Prompt</button>
                        <button id="clear-button" class="btn btn-outline-discovery col-2 fs-5" type="button">Clear</button>
                        <button id="copy-button" class="btn btn-outline-discovery col-2 fs-5" type="button">Copy</button>
                    </div>
                </div>
            </section>
        `;
    }

    public initChat(): void {
        document.addEventListener("DOMContentLoaded", () => {
            const chatOutput = document.getElementById("chatGptOutputArea") as HTMLDivElement;
            const chatInput = document.getElementById("chat-input") as HTMLTextAreaElement;

            const sendButton = document.getElementById("send-button") as HTMLButtonElement;
            const clearButton = document.getElementById("clear-button") as HTMLButtonElement;
            const copyButton = document.getElementById("copy-button") as HTMLButtonElement;

            sendButton.addEventListener("click", async () => {
                const userMessage = chatInput.value.trim();
                if (!userMessage) {
                    return;
                }

                // Manage displaying the inputs & outputs
                chatOutput.innerHTML += `<div class="user-message">You: ${userMessage}</div>`;
                chatInput.value = "";

                try {
                    const response = await fetch("http://localhost:3000/webhook", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: userMessage })
                    });

                    const data = await response.json();
                    chatOutput.innerHTML += `<div class="bot-message">ChatGPT: ${data.message}</div>`;
                } catch (error) {
                    chatOutput.innerHTML += `<div class="error-message">Error: Could not reach the server.</div>`;
                }
            });

            clearButton.addEventListener("click", () => {
                chatOutput.innerHTML = "";
            });

            copyButton.addEventListener("click", () => {
                navigator.clipboard.writeText(chatOutput.innerText);
            });
        });
    }
}

customElements.define('app-aichat', AiChat);