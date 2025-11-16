# DEPRECATION NOTICE

**This repository has been deprecated in favor of the new multi-repo + NPM architecture.**

## Migration Path

### Old Approach (Deprecated)
- Single `claude-client-installer` repo
- Generated client-specific install scripts
- Required private `claude-client-configs` repo
- Manual profile generation and distribution

### New Approach (Recommended)
- Modular NPM packages for distribution
- Template repository for client deployments
- Automated dependency updates
- Better separation of concerns

## New Repositories

### Core Packages (Public NPM)
1. **[@magicturtle/claude-orchestrator](https://github.com/MagicTurtle-s/claude-code-mcp-bridge)**
   - Formerly: claude-code-mcp-bridge
   - Published to GitHub Packages
   - Includes bridge + orchestrator functionality

2. **[@magicturtle/mcp-hubspot](https://github.com/MagicTurtle-s/hubspot-mcp-railway)**
   - HubSpot MCP server package
   - 116 CRM tools
   - Published to GitHub Packages

### Deployment Infrastructure
3. **[claude-client-deploy-template](https://github.com/MagicTurtle-s/claude-client-deploy-template)**
   - Template repository for new clients
   - Use GitHub's "Use this template" feature
   - Customizable per-client configuration

4. **[riseup-marketing-claude-deploy](https://github.com/MagicTurtle-s/riseup-marketing-claude-deploy)** (Private)
   - Example client deployment
   - Created from template
   - Configured for HubSpot + Asana

## Migration Steps for Existing Clients

### 1. Create New Client Repository

```bash
# Use template repository to create new client repo
gh repo create your-org/client-name-claude-deploy \
  --template MagicTurtle-s/claude-client-deploy-template \
  --private \
  --clone
```

### 2. Customize Configuration

```bash
cd client-name-claude-deploy

# Edit package.json - select needed MCPs
# Edit config/mcpConfig.json - enable MCPs
# Copy .env.example to .env and add credentials
```

### 3. Deploy

```bash
npm run install:all
# Restart Claude Desktop
```

## Benefits of New Approach

✅ **Automated Updates**: Dependabot + GitHub Actions auto-create PRs
✅ **Version Control**: Lock specific versions, test before deploying
✅ **Separation of Concerns**: Base packages separate from client configs
✅ **Industry Standard**: Uses npm ecosystem, familiar to developers
✅ **Better Security**: Each client repo has isolated secrets
✅ **Scalability**: Easy to add new clients without complexity

## Timeline

- **Now**: Both approaches coexist
- **Q1 2025**: All new clients use new approach
- **Q2 2025**: Migrate existing clients
- **Q3 2025**: Archive this repository

## Support

For migration assistance:
- Review the [template README](https://github.com/MagicTurtle-s/claude-client-deploy-template)
- See [RiseUp Marketing example](https://github.com/MagicTurtle-s/riseup-marketing-claude-deploy)
- Contact repository maintainer

---

**Last Updated**: November 15, 2025
**Status**: DEPRECATED
**Replacement**: [claude-client-deploy-template](https://github.com/MagicTurtle-s/claude-client-deploy-template)
