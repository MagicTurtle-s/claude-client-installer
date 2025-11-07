#!/usr/bin/env node

/**
 * Client Profile Validator
 *
 * Validates client profile JSON files to ensure they:
 * - Have required fields
 * - Use proper data types
 * - Don't contain example/placeholder tokens
 * - Have valid MCP configurations
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Known MCP servers and their required config fields
const KNOWN_MCPS = {
  'asana-mcp-railway': {
    requiredFields: ['endpoint', 'session'],
    optionalFields: []
  },
  'sharepoint-mcp-railway': {
    requiredFields: ['endpoint'],
    optionalFields: ['customer_sites']
  },
  'hubspot-mcp-railway': {
    requiredFields: ['endpoint', 'access_token'],
    optionalFields: []
  },
  'neo4j-cypher-mcp': {
    requiredFields: ['endpoint', 'credentials'],
    optionalFields: []
  },
  'neo4j-memory-mcp': {
    requiredFields: ['endpoint', 'credentials'],
    optionalFields: []
  }
};

class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.field = field;
    this.name = 'ValidationError';
  }
}

/**
 * Load and parse JSON profile
 */
function loadProfile(profilePath) {
  if (!fs.existsSync(profilePath)) {
    throw new ValidationError(`Profile file not found: ${profilePath}`);
  }

  try {
    const content = fs.readFileSync(profilePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new ValidationError(`Failed to parse JSON: ${error.message}`);
  }
}

/**
 * Validate client metadata
 */
function validateClientMetadata(profile) {
  const errors = [];

  if (!profile.client) {
    errors.push('Missing required field: client');
    return errors;
  }

  const { client } = profile;

  // Required fields
  if (!client.name || typeof client.name !== 'string' || client.name.trim() === '') {
    errors.push('client.name is required and must be a non-empty string');
  }

  if (!client.contact || typeof client.contact !== 'string') {
    errors.push('client.contact is required and must be a string');
  } else if (!client.contact.includes('@')) {
    errors.push('client.contact should be a valid email address');
  }

  if (!client.deployment_date || typeof client.deployment_date !== 'string') {
    errors.push('client.deployment_date is required (format: YYYY-MM-DD)');
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(client.deployment_date)) {
    errors.push('client.deployment_date must be in YYYY-MM-DD format');
  }

  // Optional fields type check
  if (client.notes && typeof client.notes !== 'string') {
    errors.push('client.notes must be a string if provided');
  }

  return errors;
}

/**
 * Validate MCP configurations
 */
function validateMCPs(profile) {
  const errors = [];
  const warnings = [];

  if (!profile.mcps || !Array.isArray(profile.mcps)) {
    errors.push('mcps field is required and must be an array');
    return { errors, warnings };
  }

  if (profile.mcps.length === 0) {
    warnings.push('No MCPs configured - client will have no integrations');
  }

  const enabledCount = profile.mcps.filter(mcp => mcp.enabled).length;
  if (enabledCount === 0) {
    warnings.push('No MCPs enabled - client will have no active integrations');
  }

  profile.mcps.forEach((mcp, index) => {
    const prefix = `mcps[${index}]`;

    // Required fields
    if (!mcp.name || typeof mcp.name !== 'string') {
      errors.push(`${prefix}.name is required and must be a string`);
      return;
    }

    if (typeof mcp.enabled !== 'boolean') {
      errors.push(`${prefix}.enabled is required and must be a boolean`);
    }

    // Check if MCP is known
    if (!KNOWN_MCPS[mcp.name]) {
      warnings.push(`${prefix}.name "${mcp.name}" is not a recognized MCP server`);
    }

    // Skip config validation if disabled
    if (!mcp.enabled) {
      return;
    }

    // Validate config
    if (!mcp.config || typeof mcp.config !== 'object') {
      errors.push(`${prefix}.config is required when enabled=true`);
      return;
    }

    // Validate known MCP config fields
    if (KNOWN_MCPS[mcp.name]) {
      const mcpSpec = KNOWN_MCPS[mcp.name];

      // Check required fields
      mcpSpec.requiredFields.forEach(field => {
        if (!mcp.config[field]) {
          errors.push(`${prefix}.config.${field} is required for ${mcp.name}`);
        }
      });

      // Check for example/placeholder values
      Object.entries(mcp.config).forEach(([key, value]) => {
        const valStr = JSON.stringify(value).toLowerCase();
        if (valStr.includes('example') || valStr.includes('replace') || valStr.includes('xxxxx')) {
          errors.push(`${prefix}.config.${key} contains placeholder value - replace with real credential`);
        }
      });
    }
  });

  return { errors, warnings };
}

/**
 * Validate bridge configuration
 */
function validateBridge(profile) {
  const errors = [];
  const warnings = [];

  if (!profile.bridge) {
    errors.push('Missing required field: bridge');
    return { errors, warnings };
  }

  if (typeof profile.bridge.enabled !== 'boolean') {
    errors.push('bridge.enabled is required and must be a boolean');
  }

  if (profile.bridge.enabled === false) {
    warnings.push('bridge.enabled is false - Claude Desktop will not be able to delegate to Claude Code');
  }

  if (profile.bridge.debug !== undefined && typeof profile.bridge.debug !== 'boolean') {
    errors.push('bridge.debug must be a boolean if provided');
  }

  return { errors, warnings };
}

/**
 * Validate entire profile
 */
function validateProfile(profile) {
  const errors = [];
  const warnings = [];

  // Validate client metadata
  errors.push(...validateClientMetadata(profile));

  // Validate MCPs
  const mcpValidation = validateMCPs(profile);
  errors.push(...mcpValidation.errors);
  warnings.push(...mcpValidation.warnings);

  // Validate bridge
  const bridgeValidation = validateBridge(profile);
  errors.push(...bridgeValidation.errors);
  warnings.push(...bridgeValidation.warnings);

  return { errors, warnings };
}

/**
 * Print validation results
 */
function printResults(profilePath, errors, warnings) {
  console.log(`\n${colors.cyan}=== Validating Profile ===${colors.reset}`);
  console.log(`File: ${profilePath}\n`);

  if (errors.length > 0) {
    console.log(`${colors.red}✗ Errors (${errors.length}):${colors.reset}`);
    errors.forEach(error => {
      console.log(`  ${colors.red}•${colors.reset} ${error}`);
    });
    console.log();
  }

  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠ Warnings (${warnings.length}):${colors.reset}`);
    warnings.forEach(warning => {
      console.log(`  ${colors.yellow}•${colors.reset} ${warning}`);
    });
    console.log();
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`${colors.green}✓ Profile is valid!${colors.reset}\n`);
    return true;
  } else if (errors.length === 0) {
    console.log(`${colors.green}✓ Profile is valid (with warnings)${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}✗ Profile validation failed${colors.reset}\n`);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node validate-profile.js <profile-path>');
    console.error('Example: node validate-profile.js ../claude-client-configs/profiles/client.json');
    process.exit(1);
  }

  const profilePath = path.resolve(args[0]);

  try {
    const profile = loadProfile(profilePath);
    const { errors, warnings } = validateProfile(profile);
    const isValid = printResults(profilePath, errors, warnings);

    process.exit(isValid ? 0 : 1);
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset} ${error.message}`);
    process.exit(1);
  }
}

// Export for testing
module.exports = {
  validateProfile,
  validateClientMetadata,
  validateMCPs,
  validateBridge,
  loadProfile
};

// Run if called directly
if (require.main === module) {
  main();
}
