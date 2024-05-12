import * as vscode from "vscode";
import { CustomSidebarViewProvider } from "./customSidebarViewProvider";

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-extension-sidebar-html" is active!');

    const provider = new CustomSidebarViewProvider(context.extensionUri);

    context.subscriptions.push(vscode.window.registerWebviewViewProvider(CustomSidebarViewProvider.viewType, provider));

    context.subscriptions.push(
        vscode.commands.registerCommand("vscodeSidebar.menu.view", () => {
            const message = "Menu/Title of extension is clicked !";
            vscode.window.showInformationMessage(message);
        }),
    );

    let openWebView = vscode.commands.registerCommand("vscodeSidebar.openview", () => {
        vscode.window.showInformationMessage('Command " Sidebar View [vscodeSidebar.openview] " called.');
    });

    context.subscriptions.push(openWebView);

    vscode.languages.onDidChangeDiagnostics(() => {
        provider.updateView();
    });
}

export function deactivate() {}
