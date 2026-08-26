import { chromium } from 'playwright';

/**
 * Launch the project browser using Playwright's installed Chromium by default.
 * An explicit executable override is supported for controlled environments.
 */
export function launchChromium(options = {}) {
  return chromium.launch(chromiumLaunchOptions(options));
}

export function chromiumLaunchOptions(options = {}, environment = process.env) {
  const { executablePath: _discardedExecutablePath, ...standardOptions } = options;
  const executablePath = environment.PLAYWRIGHT_CHROMIUM_EXECUTABLE?.trim();
  return { ...standardOptions, ...(executablePath ? { executablePath } : {}) };
}
