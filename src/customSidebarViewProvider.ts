import { window, languages, WebviewViewProvider, WebviewView, Webview, Uri, Diagnostic } from "vscode";

export class CustomSidebarViewProvider implements WebviewViewProvider {
    public static readonly viewType = "vscodeSidebar.openview";
    readonly catImages = ["no_error_cat.gif", "a_few_error_cat.gif", "some_error_cat.gif", "many_error_cat.gif"];
    readonly catMessages = ["Purrfection!", "You've got to be kitten me!", "Meowch!", "Are you fur real!"];

    private _view?: WebviewView;
    private _extensionUri: Uri;

    constructor(extensionUri: Uri) {
        this._extensionUri = extensionUri;
    }

    resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true, localResourceRoots: [this._extensionUri] };
        this._updateView();
    }

    private _updateView() {
        if (this._view) {
            this._view.webview.html = this.getHtmlContent(this._view.webview);
        }
    }

    private getHtmlContent(webview: Webview): string {
        const numProblems = this.getDiagnostics().length;
        const catIndex = Math.min(Math.ceil(numProblems / 5), this.catImages.length - 1);
        const imageUrl = webview
            .asWebviewUri(Uri.joinPath(this._extensionUri, "assets", this.catImages[catIndex]))
            .toString();
        const message = this.catMessages[catIndex];

        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <img src="${imageUrl}" alt="Cat face">
                <h1>${message} ${numProblems} errors</h1>
            </body>
        </html>`;
    }

    private getDiagnostics(): Diagnostic[] {
        // Get all diagnostics for the active text editor
        const editor = window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            return languages.getDiagnostics(document.uri);
        }
        return [];
    }

    public updateView() {
        this._updateView();
    }
}
