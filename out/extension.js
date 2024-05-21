"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const customSidebarViewProvider_1 = require("./customSidebarViewProvider");
function activate(context) {
    const provider = new customSidebarViewProvider_1.CustomSidebarViewProvider(context.extensionUri);
    const openWebView = vscode.commands.registerCommand("vscodeSidebar.openview", () => {
        vscode.window.showInformationMessage('Command " Sidebar View [vscodeSidebar.openview] " called.');
    });
    context.subscriptions.push(openWebView);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(customSidebarViewProvider_1.CustomSidebarViewProvider.viewType, provider));
    vscode.languages.onDidChangeDiagnostics(() => {
        provider.updateView();
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map