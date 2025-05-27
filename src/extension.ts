import { commands, window, languages, ExtensionContext, Diagnostic } from "vscode";
import { CustomSidebarViewProvider } from "./customSidebarViewProvider";

export function activate(context: ExtensionContext) {
    const provider = new CustomSidebarViewProvider(context.extensionUri);

    // Command to open the sidebar
    const openWebView = commands.registerCommand("catReviews.openview", async () => {
        await commands.executeCommand("workbench.view.extension.custom-activitybar");
    });

    context.subscriptions.push(openWebView);
    context.subscriptions.push(window.registerWebviewViewProvider(CustomSidebarViewProvider.viewType, provider));

    const diagnosticsListener = languages.onDidChangeDiagnostics(() => {
        provider.updateView();
    });
    context.subscriptions.push(diagnosticsListener);
}

export function deactivate() {}
