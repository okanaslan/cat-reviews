import * as vscode from "vscode";
import { CustomSidebarViewProvider } from "./customSidebarViewProvider";

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "Cat Review" is active!');

    const provider = new CustomSidebarViewProvider(context.extensionUri);
    const openWebView = vscode.commands.registerCommand("vscodeSidebar.openview", () => {
        vscode.window.showInformationMessage('Command " Sidebar View [vscodeSidebar.openview] " called.');
    });

    context.subscriptions.push(openWebView);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(CustomSidebarViewProvider.viewType, provider));
    context.subscriptions.push(
        vscode.commands.registerCommand("vscodeSidebar.menu.view", () => {
            const message = "Menu/Title of extension is clicked !";
            vscode.window.showInformationMessage(message);
        }),
    );

    vscode.languages.onDidChangeDiagnostics(() => {
        provider.updateView();
    });
}

export function deactivate() {}
