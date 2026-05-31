const fs = require('fs');
const path = require('path');

const START_MARKER = '/* VOIDSLATE_ACTIVITY_BAR_COLORS_START */';
const END_MARKER = '/* VOIDSLATE_ACTIVITY_BAR_COLORS_END */';
const PATCH_VERSION = '1';

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizePath(candidate) {
  if (!candidate || typeof candidate !== 'string') return null;
  return path.resolve(candidate);
}

function candidateAppRoots(explicitAppRoot) {
  const normalizedExplicitAppRoot = normalizePath(explicitAppRoot);
  if (normalizedExplicitAppRoot) {
    return [normalizedExplicitAppRoot];
  }

  const execDir = process.execPath ? path.dirname(process.execPath) : null;
  return unique([
    normalizePath(process.env.VSCODE_APP_ROOT),
    normalizePath(process.env.VSCODE_CWD && path.join(process.env.VSCODE_CWD, 'resources', 'app')),
    normalizePath(process.resourcesPath && path.join(process.resourcesPath, 'app')),
    normalizePath(execDir && path.join(execDir, '..', 'Resources', 'app')),
    normalizePath(execDir && path.join(execDir, 'resources', 'app')),
    normalizePath(execDir && path.join(execDir, '..', 'resources', 'app')),
    normalizePath(execDir && path.join(execDir, '..', 'share', 'code', 'resources', 'app')),
    normalizePath('/Applications/Visual Studio Code.app/Contents/Resources/app'),
    normalizePath('/Applications/Visual Studio Code - Insiders.app/Contents/Resources/app'),
    normalizePath('/Applications/VSCodium.app/Contents/Resources/app')
  ]);
}

function cssFilesForRoot(appRoot) {
  const workbenchDir = path.join(appRoot, 'out', 'vs', 'workbench');
  if (!fs.existsSync(workbenchDir)) return [];

  const directCandidates = [
    'workbench.desktop.main.css',
    'workbench.web.main.css',
    'workbench.main.css'
  ].map((file) => path.join(workbenchDir, file));

  let discovered = [];
  try {
    discovered = fs
      .readdirSync(workbenchDir)
      .filter((file) => /^workbench.*\.css$/i.test(file))
      .map((file) => path.join(workbenchDir, file));
  } catch {
    discovered = [];
  }

  return unique([...directCandidates, ...discovered]).filter((file) => fs.existsSync(file));
}

function findWorkbenchCssFiles(options = {}) {
  const roots = candidateAppRoots(options.appRoot);
  const files = unique(roots.flatMap(cssFilesForRoot));
  if (files.length === 0) {
    throw new Error(
      'Could not find VS Code workbench CSS. Set VSCODE_APP_ROOT to the VS Code app root and try again.'
    );
  }
  return files;
}

function patchBlock(css) {
  return [
    '',
    START_MARKER,
    `/* version: ${PATCH_VERSION} */`,
    css.trim(),
    END_MARKER,
    ''
  ].join('\n');
}

function stripPatch(content) {
  const pattern = new RegExp(
    `\\n?${escapeRegExp(START_MARKER)}[\\s\\S]*?${escapeRegExp(END_MARKER)}\\n?`,
    'g'
  );
  return content.replace(pattern, '\n');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasPatch(content) {
  return content.includes(START_MARKER) && content.includes(END_MARKER);
}

function backupFile(file) {
  const backup = `${file}.voidslate-backup`;
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(file, backup);
  }
  return backup;
}

function readCss(cssPath) {
  const resolvedCssPath = path.resolve(cssPath);
  if (!fs.existsSync(resolvedCssPath)) {
    throw new Error(`Activity Bar CSS not found: ${resolvedCssPath}`);
  }
  return fs.readFileSync(resolvedCssPath, 'utf8');
}

function applyActivityBarPatch(options = {}) {
  const css = readCss(options.cssPath);
  const files = findWorkbenchCssFiles(options);
  const block = patchBlock(css);
  const changed = [];

  for (const file of files) {
    const current = fs.readFileSync(file, 'utf8');
    const next = `${stripPatch(current).trimEnd()}${block}`;
    if (next !== current) {
      backupFile(file);
      fs.writeFileSync(file, next, 'utf8');
      changed.push(file);
    }
  }

  return {
    action: 'apply',
    files,
    changed
  };
}

function removeActivityBarPatch(options = {}) {
  const files = findWorkbenchCssFiles(options);
  const changed = [];

  for (const file of files) {
    const current = fs.readFileSync(file, 'utf8');
    const next = stripPatch(current).trimEnd() + '\n';
    if (next !== current) {
      fs.writeFileSync(file, next, 'utf8');
      changed.push(file);
    }
  }

  return {
    action: 'remove',
    files,
    changed
  };
}

function getActivityBarPatchStatus(options = {}) {
  const files = findWorkbenchCssFiles(options);
  return {
    files,
    patched: files.some((file) => hasPatch(fs.readFileSync(file, 'utf8')))
  };
}

module.exports = {
  START_MARKER,
  END_MARKER,
  applyActivityBarPatch,
  removeActivityBarPatch,
  getActivityBarPatchStatus,
  findWorkbenchCssFiles
};
