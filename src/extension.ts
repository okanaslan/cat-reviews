import * as vscode from "vscode";
import { CustomSidebarViewProvider } from "./customSidebarViewProvider";

export function activate(context: vscode.ExtensionContext) {
    const provider = new CustomSidebarViewProvider(context.extensionUri);
    const openWebView = vscode.commands.registerCommand("vscodeSidebar.openview", () => {
        vscode.window.showInformationMessage('Command " Sidebar View [vscodeSidebar.openview] " called.');
    });

    context.subscriptions.push(openWebView);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(CustomSidebarViewProvider.viewType, provider));

    vscode.languages.onDidChangeDiagnostics(() => {
        provider.updateView();
    });
}

export function deactivate() {}
