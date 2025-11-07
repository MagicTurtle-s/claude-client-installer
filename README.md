# Claude Client Installer

**Generate customized Claude Desktop/Code installation packages for different clients with pre-configured MCP servers.**

## Overview

This is a script-based installer framework that creates **client-specific installation packages**. Each client gets a single script that installs Claude Desktop, Claude Code CLI, the MCP Bridge, and their specific MCP servers - all pre-configured and ready to use.

### Key Features

- **One-Command Installation**: Client runs one script, gets a fully configured Claude environment
- **Client-Specific Configurations**: Each client gets only the MCP servers they need
- **Cross-Platform**: Generates Windows (.bat) and Unix (.sh) installers
- **Version Controlled**: Client profiles tracked in separate private repository
- **Secure**: Sensitive credentials kept in private repo, never in public code
- **Maintainable**: Update base template, regenerate all client installers

### Architecture

```
┌─────────────────────────────────────────┐
│  claude-client-installer (this repo)    │
│  └─ Framework, templates, generator     │
│     - Public/shareable code             │
│     - No sensitive data                 │
└─────────────────────────────────────────┘
             │
             ├─ generates
             ▼
┌─────────────────────────────────────────┐
│  Custom Client Installer                │
│  └─ install-{client}.bat/.sh            │
│     - Claude Desktop install            │
│     - Claude Code CLI install           │
│     - MCP Bridge setup                  │
│     - Client-specific MCPs              │
└─────────────────────────────────────────┘
             │
             ├─ references configs from
             ▼
┌─────────────────────────────────────────┐
│  claude-client-configs (private repo)   │
│  └─ Real client profiles with tokens    │
│     - PRIVATE repository                │
│     - Contains authentication secrets   │
└─────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- Git
- Access to private `claude-client-configs` repository

### Setup

```bash
# Clone this repository
git clone https://github.com/MagicTurtle-s/claude-client-installer.git
cd claude-client-installer

# Install dependencies
npm install

# Clone private configs repo (requires access)
cd ..
git clone https://github.com/MagicTurtle-s/claude-client-configs.git
```

### Generate Client Installer

```bash
cd claude-client-installer

# Generate installer for a specific client
node scripts/generate-installer.js \
  --profile ../claude-client-configs/profiles/client-name.json \
  --output ./dist/client-name/

# Output will be in dist/client-name/
# - install-client-name.bat (Windows)
# - install-client-name.sh (Unix/Mac/Linux)
# - README.md (Client-specific instructions)
```

### Deliver to Client

```bash
# Package the generated installer
cd dist/client-name
zip -r ../client-name-installer.zip .

# Send client-name-installer.zip to the client
# They extract and run install-client-name.bat (Windows) or install-client-name.sh (Unix)
```

## Project Structure

```
claude-client-installer/
├── templates/               # Base installer templates
│   ├── install-base.bat    # Windows installer template
│   ├── install-base.sh     # Unix installer template
│   └── mcp-config-template.json
├── scripts/                 # Generator and validation tools
│   ├── generate-installer.js
│   ├── download-urls.js
│   └── validate-profile.js
├── examples/                # Example client profiles (sanitized)
│   ├── example-client.json
│   └── README.md
├── docs/                    # Documentation
│   ├── CREATING-PROFILES.md
│   ├── DEPLOYMENT-GUIDE.md
│   └── SECURITY.md
├── dist/                    # Generated installers (gitignored)
├── package.json
└── README.md
```

## Documentation

- **[Creating Client Profiles](docs/CREATING-PROFILES.md)**: How to create client configurations
- **[Deployment Guide](docs/DEPLOYMENT-GUIDE.md)**: How to deploy installers to clients
- **[Security Best Practices](docs/SECURITY.md)**: Handling sensitive credentials

## Client Profile Format

Profiles are stored in the separate **private repository** (`claude-client-configs`).

Example profile structure:

```json
{
  "client": {
    "name": "Example Corp",
    "contact": "admin@example.com",
    "deployment_date": "2025-11-07"
  },
  "mcps": [
    {
      "name": "asana-mcp-railway",
      "enabled": true,
      "config": {
        "endpoint": "https://asana-mcp-railway-production.up.railway.app",
        "session": "SESSION_TOKEN_HERE"
      }
    },
    {
      "name": "hubspot-mcp-railway",
      "enabled": false
    }
  ],
  "bridge": {
    "enabled": true,
    "debug": false
  }
}
```

## Available MCP Servers

The system supports these MCP servers (deployed separately):

- **Asana MCP Railway**: Task & project management (42 tools)
- **SharePoint MCP Railway**: Document management across customer sites (11 tools)
- **HubSpot MCP Railway**: CRM integration (116 tools)
- **Neo4j Cypher MCP**: Graph database queries
- **Neo4j Memory MCP**: Knowledge graph memory

Each client profile specifies which MCPs to include.

## Workflow

### Adding a New Client

1. **Create profile** in private repo:
   ```bash
   cd claude-client-configs
   cp profiles/default.json profiles/new-client.json
   # Edit with client-specific configuration
   git add profiles/new-client.json
   git commit -m "Add New Client profile"
   git push
   ```

2. **Generate installer**:
   ```bash
   cd claude-client-installer
   node scripts/generate-installer.js \
     --profile ../claude-client-configs/profiles/new-client.json
   ```

3. **Test installer** on clean machine

4. **Deliver to client** via secure channel

### Updating Client Configuration

1. **Update profile** in private repo:
   ```bash
   cd claude-client-configs
   # Edit profiles/client-name.json
   git commit -am "Update Client config: add Neo4j MCP"
   git push
   ```

2. **Regenerate installer**:
   ```bash
   cd claude-client-installer
   node scripts/generate-installer.js \
     --profile ../claude-client-configs/profiles/client-name.json
   ```

3. **Send updated installer** to client

## Security

- This **public repository** contains NO sensitive credentials
- Real credentials live in the **private `claude-client-configs` repository**
- Generated installers (in `dist/`) are gitignored and should be delivered securely
- See [SECURITY.md](docs/SECURITY.md) for detailed security practices

## Related Projects

This installer system integrates these projects:

- **[Claude Code MCP Bridge](https://github.com/MagicTurtle-s/claude-code-mcp-bridge)**: Connects Claude Desktop to Claude Code CLI
- **[Asana MCP Railway](https://github.com/MagicTurtle-s/asana-mcp-railway)**: Asana integration
- **[HubSpot MCP Railway](https://github.com/MagicTurtle-s/hubspot-mcp-railway)**: HubSpot CRM integration
- **[SharePoint MCP Railway](https://github.com/MagicTurtle-s/sharepoint-mcp-railway)**: SharePoint document management
- **[Neo4j MCP Railway v2](https://github.com/MagicTurtle-s/neo4j-mcp-railway-v2)**: Graph database integration

## Contributing

This is a private framework for client deployments. If you have access and want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- **GitHub Issues**: https://github.com/MagicTurtle-s/claude-client-installer/issues
- **Documentation**: See `docs/` directory

## License

MIT License - See LICENSE file for details

---

**Status**: v0.1.0 - Initial Development
**Maintainer**: MagicTurtle-s
**Last Updated**: 2025-11-07
