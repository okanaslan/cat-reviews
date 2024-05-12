import * as vscode from "vscode";

export class CustomSidebarViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "vscodeSidebar.openview";

    private _view?: vscode.WebviewView;
    private _extensionUri: vscode.Uri;

    constructor(extensionUri: vscode.Uri) {
        this._extensionUri = extensionUri;
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext<unknown>,
        token: vscode.CancellationToken,
    ): void | Thenable<void> {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        this._updateView();
    }

    private _updateView() {
        if (this._view) {
            this._view.webview.html = this.getHtmlContent(this._view.webview);
        }
    }

    private getHtmlContent(webview: vscode.Webview): string {
        const diagnostics = this.getDiagnostics();
        const numProblems = diagnostics.length;

        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "main.js"));

        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "reset.css"));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "vscode.css"));

        const stylesheetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "main.css"));

        let imageUrl = "";
        let message = "";
        if (numProblems === 0) {
            imageUrl = webview
                .asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "0errors.png"))
                .toString();
            message = "you make the cat very happy!";
        } else if (numProblems >= 1 && numProblems < 3) {
            imageUrl = webview
                .asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "3errors.png"))
                .toString();
            message = "(uh oh)";
        } else if (numProblems >= 3 && numProblems < 6) {
            imageUrl = webview
                .asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "6errors.png"))
                .toString();
            message = "eughh what's that...";
        } else if (numProblems >= 6 && numProblems < 10) {
            imageUrl = webview
                .asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "10errors.png"))
                .toString();
            message = "dude look at what you've done-";
        } else {
            imageUrl = webview
                .asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "10errors.png"))
                .toString();
            message = "uhm hello friend, just letting you know, there's code in your bugs";
        }

        const errorMessages = diagnostics.map((diagnostic) => {
            const lineNumber = diagnostic.range.start.line + 1;
            return `<li id="individualErrors">[Line ${lineNumber}]: ${diagnostic.message}</li>`;
        });

        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src * data:;">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="stylesheet" href="https://unpkg.com/modern-css-reset/dist/reset.min.css" />
            <link href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;700&display=swap" rel="stylesheet">

            <link href="${styleResetUri}" rel="stylesheet">
            <link href="${styleVSCodeUri}" rel="stylesheet">
            
            <link href="${stylesheetUri}" rel="stylesheet">
            
        </head>

        <body>
            <img src="${imageUrl}" alt="Cat face">
            <h2>Errors: ${numProblems}</h2>
            <p></p>
            <h3>${message}</h3>
            <ul id="errorMessages">
                ${errorMessages.join("")}
            </ul>
        </body>

        </html>`;
    }

    private getDiagnostics(): vscode.Diagnostic[] {
        // Get all diagnostics for the active text editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            return vscode.languages.getDiagnostics(document.uri);
        }
        return [];
    }

    public updateView() {
        this._updateView();
    }
}

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
