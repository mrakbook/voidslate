const vscode = require('vscode');
const path = require('path');
const {
  applyActivityBarPatch,
  removeActivityBarPatch,
  getActivityBarPatchStatus
} = require('./activitybar-patcher');

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('voidslate.applyActivityBarColors', async () => {
      await runPatchCommand(context, 'apply');
    }),
    vscode.commands.registerCommand('voidslate.removeActivityBarColors', async () => {
      await runPatchCommand(context, 'remove');
    })
  );

  maybePromptForActivityBarPatch(context);
}

async function maybePromptForActivityBarPatch(context) {
  const config = vscode.workspace.getConfiguration('voidslate');
  if (!config.get('activityBar.applyColorsOnStartup', true)) return;

  const packageVersion = context.extension.packageJSON.version;
  const promptedForVersion = context.globalState.get('activityBarPatchPromptedForVersion');
  if (promptedForVersion === packageVersion) return;

  try {
    const status = getPatchStatus(context);
    if (status.patched) {
      await context.globalState.update('activityBarPatchPromptedForVersion', packageVersion);
      return;
    }
  } catch {
    return;
  }

  const choice = await vscode.window.showInformationMessage(
    'VoidSlate can make the left Activity Bar icons superflat, very bright, and section-colored. This patches VS Code workbench CSS and requires a reload.',
    'Apply Colors',
    'Not Now'
  );

  await context.globalState.update('activityBarPatchPromptedForVersion', packageVersion);
  if (choice === 'Apply Colors') {
    await runPatchCommand(context, 'apply');
  }
}

async function runPatchCommand(context, action) {
  try {
    const result =
      action === 'remove'
        ? removeActivityBarPatch(getPatchOptions(context))
        : applyActivityBarPatch(getPatchOptions(context));

    const changedText =
      result.changed.length === 0
        ? 'No workbench files needed changes.'
        : `Updated ${result.changed.length} workbench file(s).`;
    const message =
      action === 'remove'
        ? `VoidSlate Activity Bar color patch removed. ${changedText}`
        : `VoidSlate Activity Bar colors applied. ${changedText}`;

    const reload = await vscode.window.showInformationMessage(message, 'Reload VS Code');
    if (reload === 'Reload VS Code') {
      await vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    vscode.window.showErrorMessage(
      `VoidSlate could not update VS Code Activity Bar colors: ${message}`
    );
  }
}

function getPatchStatus(context) {
  return getActivityBarPatchStatus(getPatchOptions(context));
}

function getPatchOptions(context) {
  return {
    appRoot: vscode.env.appRoot,
    cssPath: context.asAbsolutePath(path.join('activitybar', 'voidslate-activitybar-colors.css'))
  };
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
