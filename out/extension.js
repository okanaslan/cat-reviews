"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const customSidebarViewProvider_1 = require("./customSidebarViewProvider");
function activate(context) {
    console.log('Congratulations, your extension "Cat Review" is active!');
    const provider = new customSidebarViewProvider_1.CustomSidebarViewProvider(context.extensionUri);
    const openWebView = vscode.commands.registerCommand("vscodeSidebar.openview", () => {
        vscode.window.showInformationMessage('Command " Sidebar View [vscodeSidebar.openview] " called.');
    });
    context.subscriptions.push(openWebView);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(customSidebarViewProvider_1.CustomSidebarViewProvider.viewType, provider));
    context.subscriptions.push(vscode.commands.registerCommand("vscodeSidebar.menu.view", () => {
        const message = "Menu/Title of extension is clicked !";
        vscode.window.showInformationMessage(message);
    }));
    vscode.languages.onDidChangeDiagnostics(() => {
        provider.updateView();
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map