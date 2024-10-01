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