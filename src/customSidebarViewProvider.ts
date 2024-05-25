import { window, languages, WebviewViewProvider, WebviewView, Webview, Uri, Diagnostic } from "vscode";

export class CustomSidebarViewProvider implements WebviewViewProvider {
    public static readonly viewType = "vscodeSidebar.openview";
    readonly catImages = [
        ["lvl1cat1", "lvl1cat2", "lvl1cat3", "lvl1cat4", "lvl1cat5"],
        ["lvl2cat1", "lvl2cat2", "lvl2cat3", "lvl2cat4", "lvl2cat5"],
        ["lvl3cat1", "lvl3cat2", "lvl3cat3", "lvl3cat4", "lvl3cat5"],
        ["lvl4cat1", "lvl4cat2", "lvl4cat3", "lvl4cat4", "lvl4cat5"],
        ["lvl5cat1", "lvl5cat2", "lvl5cat3", "lvl5cat4"],
        ["lvl6cat1", "lvl6cat2"],
    ];
    readonly catMessages = [
        "Purrfection!",
        "You've got to be kitten me!",
        "Meowch!",
        "Purrhaps you could refactor this!",
        "This is a catastrophe!",
        "Are you fur real!",
    ];

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
        const levelCats = this.catImages[catIndex];
        const randomCat = levelCats[Math.floor(Math.random() * levelCats.length)];
        const imageUrl = webview
            .asWebviewUri(Uri.joinPath(this._extensionUri, "assets", `${randomCat}.gif`))
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
                <h1>${message}</h1>
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
