#!/usr/bin/env node

/**
 * Claude Download URLs Management
 *
 * This module manages official download URLs for Claude Desktop and Claude Code CLI.
 * URLs are verified as of 2025-11-07.
 */

const DOWNLOAD_URLS = {
  // Claude Desktop
  desktop: {
    page: 'https://claude.com/download',
    windows: {
      // Note: Actual installer URLs from claude.com/download page
      // May need to scrape or use API to get latest version URL
      note: 'Visit claude.com/download and select Windows version'
    },
    mac: {
      note: 'Visit claude.com/download and select macOS version'
    },
    linux: {
      note: 'Visit claude.com/download if Linux version available'
    }
  },

  // Claude Code CLI
  code: {
    install: {
      // Native binary installation (recommended)
      unix: 'curl -fsSL https://claude.ai/install.sh | bash',
      windowsPowershell: 'irm https://claude.ai/install.ps1 | iex',
      windowsCmd: 'curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd',

      // NPM installation (alternative)
      npm: 'npm install -g @anthropic-ai/claude-code'
    },
    docs: 'https://docs.claude.com/en/docs/claude-code/setup'
  },

  // MCP Bridge
  bridge: {
    npm: '@magicturtle-s/claude-code-mcp-bridge',
    github: 'https://github.com/MagicTurtle-s/claude-code-mcp-bridge',
    install: 'npm install -g @magicturtle-s/claude-code-mcp-bridge'
  }
};

/**
 * Get download command for Claude Code CLI based on platform
 * @param {string} platform - 'windows-ps', 'windows-cmd', 'unix', or 'npm'
 * @returns {string} Installation command
 */
function getCodeInstallCommand(platform = 'unix') {
  const commands = {
    'windows-ps': DOWNLOAD_URLS.code.install.windowsPowershell,
    'windows-cmd': DOWNLOAD_URLS.code.install.windowsCmd,
    'unix': DOWNLOAD_URLS.code.install.unix,
    'npm': DOWNLOAD_URLS.code.install.npm
  };

  return commands[platform] || commands.unix;
}

/**
 * Get platform-appropriate install command
 * @returns {string} Installation command for current platform
 */
function getCodeInstallCommandForPlatform() {
  const platform = process.platform;

  if (platform === 'win32') {
    // Default to PowerShell for Windows
    return getCodeInstallCommand('windows-ps');
  } else {
    // macOS, Linux, WSL
    return getCodeInstallCommand('unix');
  }
}

/**
 * Get all download information
 * @returns {object} All download URLs and commands
 */
function getAllDownloadInfo() {
  return DOWNLOAD_URLS;
}

/**
 * Print download information (for CLI usage)
 */
function printDownloadInfo() {
  console.log('=== Claude Download URLs ===\n');

  console.log('Claude Desktop:');
  console.log(`  Official page: ${DOWNLOAD_URLS.desktop.page}`);
  console.log(`  Note: Visit page and download for your OS\n`);

  console.log('Claude Code CLI:');
  console.log('  Unix/macOS/WSL:');
  console.log(`    ${DOWNLOAD_URLS.code.install.unix}`);
  console.log('  Windows PowerShell:');
  console.log(`    ${DOWNLOAD_URLS.code.install.windowsPowershell}`);
  console.log('  Windows CMD:');
  console.log(`    ${DOWNLOAD_URLS.code.install.windowsCmd}`);
  console.log('  NPM (alternative):');
  console.log(`    ${DOWNLOAD_URLS.code.install.npm}`);
  console.log(`  Documentation: ${DOWNLOAD_URLS.code.docs}\n`);

  console.log('Claude Code MCP Bridge:');
  console.log(`  NPM Package: ${DOWNLOAD_URLS.bridge.npm}`);
  console.log(`  GitHub: ${DOWNLOAD_URLS.bridge.github}`);
  console.log(`  Install: ${DOWNLOAD_URLS.bridge.install}\n`);

  console.log('=== System Requirements ===');
  console.log('  Claude Desktop: macOS 11+, Windows 10+');
  console.log('  Claude Code CLI: macOS 10.15+, Ubuntu 20.04+, Debian 10+, Windows 10+ (with WSL/Git)');
  console.log('  Node.js: 18+ (for MCP Bridge)\n');
}

// Export for use as module
module.exports = {
  DOWNLOAD_URLS,
  getCodeInstallCommand,
  getCodeInstallCommandForPlatform,
  getAllDownloadInfo,
  printDownloadInfo
};

// CLI usage
if (require.main === module) {
  printDownloadInfo();
}
