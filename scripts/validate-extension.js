const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const fail = (message) => {
  console.error(`VoidSlate validation failed: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};
const walk = (directory, files = []) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
};
const textLikeExtensions = new Set([
  '.html',
  '.ignore',
  '.css',
  '.js',
  '.json',
  '.md',
  '.svg',
  '.ts',
  '.txt'
]);
const staleNamePattern = new RegExp('cyber' + 'core', 'i');
const oldAccentHexes = [
  '38' + 'C8E0',
  '00' + 'D9FF',
  '5F' + 'EAFF',
  '001' + 'E26',
  '007' + '8D4',
  '168' + '7D9',
  '0B' + '84DE',
  '00' + 'D7FF',
  '2E' + '7BFF'
];
const staleAccentPattern = new RegExp(`#(?:${oldAccentHexes.join('|')})`, 'i');

const packageJson = readJson('package.json');
const patcherSource = fs.readFileSync(path.join(root, 'activitybar-patcher.js'), 'utf8');
const semverPattern = /^\d+\.\d+\.\d+$/;
const themeContribution = packageJson.contributes?.themes?.find(
  (theme) => theme.label === 'VoidSlate'
);
const iconContribution = packageJson.contributes?.iconThemes?.find(
  (theme) => theme.id === 'voidslate-icons'
);
const configurationDefaults = packageJson.contributes?.configurationDefaults || {};
const commands = packageJson.contributes?.commands || [];
const configurationProperties = packageJson.contributes?.configuration?.properties || {};

assert(packageJson.name === 'voidslate', 'package name must be voidslate');
assert(packageJson.displayName === 'VoidSlate', 'package displayName must be VoidSlate');
assert(semverPattern.test(packageJson.version), 'package version must be semver x.y.z');
assert(packageJson.publisher === 'mrakbook', 'publisher must be mrakbook');
assert(
  packageJson.license === 'SEE LICENSE IN LICENSE.md',
  'package license must point to the non-commercial LICENSE.md'
);
assert(
  packageJson.author?.name === 'MrakBook - Boris Karaoglanov',
  'author name must be MrakBook - Boris Karaoglanov'
);
assert(packageJson.author?.email === 'boris@mrakbook.com', 'author email is missing');
assert(packageJson.author?.url === 'https://mrakbook.com', 'author URL is missing');
assert(packageJson.homepage === 'https://mrakbook.com/voidslate', 'theme homepage is missing');
assert(packageJson.main === './extension.js', 'runtime entrypoint must apply Activity Bar colors');
assert(
  packageJson.activationEvents?.includes('onStartupFinished'),
  'extension must activate on startup to offer Activity Bar color patch'
);
assert(
  packageJson.activationEvents?.includes('onCommand:voidslate.applyActivityBarColors'),
  'extension must activate for Activity Bar apply command'
);
assert(
  packageJson.activationEvents?.includes('onCommand:voidslate.removeActivityBarColors'),
  'extension must activate for Activity Bar remove command'
);
assert(
  packageJson.repository?.url === 'https://github.com/mrakbook/voidslate.git',
  'repository URL is missing'
);
assert(
  packageJson.bugs?.url === 'https://github.com/mrakbook/voidslate/issues',
  'bugs URL is missing'
);
assert(themeContribution, 'VoidSlate color theme contribution is missing');
assert(iconContribution, 'VoidSlate icon theme contribution is missing');
assert(
  configurationDefaults['workbench.colorTheme'] === 'VoidSlate',
  'configuration defaults must select VoidSlate color theme'
);
assert(
  configurationDefaults['workbench.iconTheme'] === 'voidslate-icons',
  'configuration defaults must select VoidSlate icon theme'
);
assert(
  configurationDefaults['workbench.productIconTheme'] === 'Default',
  'configuration defaults must preserve the Default product icon theme'
);
assert(
  configurationDefaults['editor.fontWeight'] === '500',
  'configuration defaults must keep neon code text crisp with editor.fontWeight 500'
);
assert(
  commands.some((command) => command.command === 'voidslate.applyActivityBarColors'),
  'missing Activity Bar apply command'
);
assert(
  commands.some((command) => command.command === 'voidslate.removeActivityBarColors'),
  'missing Activity Bar remove command'
);
assert(
  configurationProperties['voidslate.activityBar.applyColorsOnStartup']?.default === true,
  'Activity Bar startup prompt must be enabled by default'
);
assert(exists(themeContribution.path), `missing theme file ${themeContribution.path}`);
assert(exists(iconContribution.path), `missing icon theme file ${iconContribution.path}`);
assert(exists(packageJson.icon), `missing extension icon ${packageJson.icon}`);
assert(exists('extension.js'), 'missing extension runtime');
assert(exists('activitybar-patcher.js'), 'missing Activity Bar patcher runtime');
assert(
  patcherSource.includes('if (normalizedExplicitAppRoot)'),
  'Activity Bar patcher must restrict explicit appRoot patching to that root only'
);
assert(exists('screenshots/voidslate-syntax-screen.jpeg'), 'missing syntax screen');
assert(exists('screenshots/voidslate-syntax-screen.svg'), 'missing syntax screen SVG source');
assert(exists('samples/voidslate-syntax.ts'), 'missing syntax sample');
assert(exists('activitybar/voidslate-activitybar-colors.css'), 'missing Activity Bar color CSS');
assert(exists('activitybar/voidslate-custom-css-settings.json'), 'missing Activity Bar settings helper');

const templatePackageJson = readJson('template/package.json');
assert(
  templatePackageJson.version === packageJson.version,
  'template package version must match package.json'
);
assert(
  templatePackageJson.license === packageJson.license,
  'template package license must match package.json'
);

const rootLicense = fs.readFileSync(path.join(root, 'LICENSE'), 'utf8');
const markdownLicense = fs.readFileSync(path.join(root, 'LICENSE.md'), 'utf8');
const templateLicense = fs.readFileSync(path.join(root, 'template/LICENSE'), 'utf8');
for (const [licenseName, licenseText] of [
  ['LICENSE', rootLicense],
  ['LICENSE.md', markdownLicense],
  ['template/LICENSE', templateLicense]
]) {
  assert(
    licenseText.includes('PolyForm Noncommercial License 1.0.0'),
    `${licenseName} must use the PolyForm Noncommercial License`
  );
  assert(!licenseText.includes('MIT License'), `${licenseName} must not contain the old MIT license`);
}

const colorTheme = readJson(themeContribution.path);
assert(colorTheme.name === 'VoidSlate', 'theme name must be VoidSlate');
assert(colorTheme.type === 'dark', 'theme type must be dark');
assert(colorTheme.semanticHighlighting === true, 'semantic highlighting must be enabled');

const customCssSettings = readJson('activitybar/voidslate-custom-css-settings.json');
const activityBarCss = fs.readFileSync(
  path.join(root, 'activitybar/voidslate-activitybar-colors.css'),
  'utf8'
);
assert(
  customCssSettings['vscode_custom_css.imports']?.includes(
    'file:///Users/boris/lab/voidslate/activitybar/voidslate-activitybar-colors.css'
  ),
  'custom CSS settings must import the Activity Bar color patch'
);
const requiredActivityBarCssSnippets = [
  '--voidslate-activity-explorer: #9B7CFF',
  '--voidslate-activity-search: #FF2DAA',
  '--voidslate-activity-source-control: #39FF6B',
  '--voidslate-activity-run: #FFF75E',
  '--voidslate-activity-extensions: #C77DFF',
  '--voidslate-activity-testing: #FFB86B',
  '--voidslate-activity-remote: #40F7FF',
  '--voidslate-activity-account: #A78BFA',
  '--voidslate-activity-settings: #FF8B52',
  '--voidslate-active-section',
  '.monaco-workbench .part.sidebar',
  '.content .actions-container > .action-item:nth-child(2)',
  '.action-item[aria-label*="Run and Debug" i] .action-label',
  '.action-item[aria-label*="Remote Explorer" i] .action-label',
  '.global-activity[aria-label*="Manage" i] .action-label',
  'background: color-mix(in srgb, var(--voidslate-section-accent) 14%, transparent)',
  'box-shadow: inset 3px 0 0 var(--voidslate-section-accent)',
  'width: 0 !important',
  'z-index: 2 !important',
  'border-left: 2px solid var(--voidslate-active-section)'
];
for (const snippet of requiredActivityBarCssSnippets) {
  assert(activityBarCss.includes(snippet), `Activity Bar CSS missing ${snippet}`);
}

const requiredColors = {
  'editor.background': '#000000',
  'sideBar.background': '#000000',
  'activityBar.background': '#000000',
  'panel.background': '#000000',
  'statusBar.background': '#000000',
  'editor.foreground': '#F8F7FF',
  'editorLineNumber.foreground': '#9B9BB8',
  'editorLineNumber.activeForeground': '#FFFFFF',
  'terminal.foreground': '#FFFFFF',
  'tab.activeBorderTop': '#A8CF38',
  'panelTitle.activeBorder': '#E9DE5E',
  'sash.hoverBorder': '#7C5CFF',
  'activityBar.foreground': '#9B7CFF',
  'activityBar.inactiveForeground': '#A78BFA',
  'activityBar.activeBorder': '#00000000',
  'activityBar.activeFocusBorder': '#C4B5FD',
  'terminal.ansiBlue': '#7C5CFF',
  'terminal.ansiCyan': '#7C5CFF',
  'terminal.ansiGreen': '#39FF6B',
  'terminal.ansiMagenta': '#FF2DAA',
  'terminal.ansiBrightBlue': '#9B7CFF',
  'terminal.ansiBrightCyan': '#C4B5FD',
  'button.background': '#6D5DFF',
  'editor.findMatchBackground': '#39FF6B66',
  'terminal.ansiBrightMagenta': '#FF2DAA',
  'terminal.ansiBrightGreen': '#39FF6B'
};

for (const [key, expected] of Object.entries(requiredColors)) {
  assert(
    colorTheme.colors?.[key] === expected,
    `${key} expected ${expected}, got ${colorTheme.colors?.[key]}`
  );
}

assert((colorTheme.tokenColors || []).length >= 10, 'theme needs TextMate token colors');
assert(
  Object.keys(colorTheme.semanticTokenColors || {}).length >= 15,
  'theme needs semantic token colors'
);

const tokenColorByName = Object.fromEntries(
  (colorTheme.tokenColors || []).map((rule) => [rule.name, rule.settings?.foreground])
);
const requiredSyntaxColors = {
  'Base foreground': '#F8F7FF',
  Comments: '#6DFCE8',
  'Keywords and storage': '#FF2DAA',
  Strings: '#39FF6B',
  'Numbers and constants': '#FFF75E',
  Functions: '#00E5FF',
  'Types and classes': '#B78CFF',
  'Parameters and local variables': '#FF8CFF',
  Properties: '#7CFFC4',
  'Operators and punctuation': '#E9DEFF',
  'Decorators / special': '#FFB86B'
};

for (const [name, expected] of Object.entries(requiredSyntaxColors)) {
  assert(tokenColorByName[name] === expected, `${name} syntax color expected ${expected}`);
}

const tokenRuleByName = Object.fromEntries(
  (colorTheme.tokenColors || []).map((rule) => [rule.name, rule])
);
assert(
  tokenRuleByName['Comments']?.settings?.fontStyle === 'italic',
  'comments must keep neon italic styling'
);
for (const name of ['Keywords and storage', 'Functions', 'Types and classes', 'Decorators / special']) {
  assert(tokenRuleByName[name]?.settings?.fontStyle === 'bold', `${name} must stay neon-bold`);
}

const semanticForeground = (semanticToken) =>
  typeof semanticToken === 'string' ? semanticToken : semanticToken?.foreground;
const requiredSemanticSyntaxColors = {
  parameter: '#FF8CFF',
  function: '#00E5FF',
  method: '#00E5FF',
  class: '#B78CFF',
  interface: '#B78CFF',
  type: '#B78CFF',
  enum: '#FFF75E',
  enumMember: '#FFF75E',
  namespace: '#C77DFF',
  keyword: '#FF2DAA',
  stringLiteral: '#39FF6B',
  numberLiteral: '#FFF75E',
  decorator: '#FFB86B'
};

for (const [name, expected] of Object.entries(requiredSemanticSyntaxColors)) {
  const token = colorTheme.semanticTokenColors?.[name];
  assert(semanticForeground(token) === expected, `${name} semantic color expected ${expected}`);
}
for (const name of ['function', 'method', 'class', 'interface', 'type', 'keyword', 'decorator']) {
  assert(colorTheme.semanticTokenColors?.[name]?.bold === true, `${name} semantic token must be bold`);
}

const iconTheme = readJson(iconContribution.path);
assert(iconTheme.name === 'VoidSlate Icons', 'icon theme name must be VoidSlate Icons');
const iconDefinitions = iconTheme.iconDefinitions || {};
const definitionIds = new Set(Object.keys(iconDefinitions));
const referenceSections = [
  'fileExtensions',
  'fileNames',
  'folderNames',
  'folderNamesExpanded',
  'languageIds'
];

for (const topLevelKey of ['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded']) {
  assert(definitionIds.has(iconTheme[topLevelKey]), `${topLevelKey} references missing icon`);
}

for (const section of referenceSections) {
  for (const [name, definitionId] of Object.entries(iconTheme[section] || {})) {
    assert(definitionIds.has(definitionId), `${section}.${name} references ${definitionId}`);
  }
}

for (const [definitionId, definition] of Object.entries(iconDefinitions)) {
  assert(definition.iconPath, `${definitionId} is missing iconPath`);
  const iconPath = path.normalize(path.join('themes', definition.iconPath));
  assert(exists(iconPath), `${definitionId} points to missing ${definition.iconPath}`);
}

assert(Object.keys(iconTheme.fileExtensions || {}).length >= 150, 'not enough file extension icons');
assert(Object.keys(iconTheme.fileNames || {}).length >= 100, 'not enough filename icons');
assert(Object.keys(iconTheme.folderNames || {}).length >= 60, 'not enough folder icons');
assert(Object.keys(iconDefinitions).length >= 280, 'not enough icon definitions');

for (const filePath of walk(root)) {
  const relativePath = path.relative(root, filePath);
  assert(!staleNamePattern.test(relativePath), `stale previous-name filename: ${relativePath}`);
  if (textLikeExtensions.has(path.extname(filePath))) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert(!staleNamePattern.test(content), `stale previous-name text in ${relativePath}`);
    assert(!staleAccentPattern.test(content), `stale cyan/blue accent in ${relativePath}`);
  }
}

console.log('VoidSlate extension validation passed.');
console.log(
  JSON.stringify(
    {
      colors: Object.keys(colorTheme.colors || {}).length,
      tokenColorRules: (colorTheme.tokenColors || []).length,
      semanticTokenRules: Object.keys(colorTheme.semanticTokenColors || {}).length,
      iconDefinitions: Object.keys(iconDefinitions).length,
      fileExtensionMappings: Object.keys(iconTheme.fileExtensions || {}).length,
      filenameMappings: Object.keys(iconTheme.fileNames || {}).length,
      folderMappings: Object.keys(iconTheme.folderNames || {}).length
    },
    null,
    2
  )
);
