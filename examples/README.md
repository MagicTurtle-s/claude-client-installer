# Example Client Profiles

This directory contains **sanitized example profiles** for reference. These are NOT real client configurations.

⚠️ **WARNING**: Do NOT use these profiles in production. They contain fake tokens and are for demonstration purposes only.

## Files

- **example-client.json**: Complete example showing all available MCP servers
- This README

## Usage

Use these examples as templates when creating real client profiles in the private `claude-client-configs` repository.

### Creating a Real Client Profile

1. Copy example to private repo:
   ```bash
   cp claude-client-installer/examples/example-client.json \
      claude-client-configs/profiles/new-client.json
   ```

2. Edit the profile:
   - Replace client metadata (name, contact, date)
   - Replace `EXAMPLE_*` tokens with real credentials
   - Enable/disable MCPs as needed
   - Remove MCPs the client doesn't need

3. Validate the profile:
   ```bash
   cd claude-client-installer
   node scripts/validate-profile.js \
     ../claude-client-configs/profiles/new-client.json
   ```

4. Generate installer:
   ```bash
   node scripts/generate-installer.js \
     --profile ../claude-client-configs/profiles/new-client.json \
     --output ./dist/new-client/
   ```

## Profile Structure

### Client Metadata
```json
{
  "client": {
    "name": "Client Name",
    "contact": "email@client.com",
    "deployment_date": "YYYY-MM-DD",
    "notes": "Optional deployment notes"
  }
}
```

### MCP Configuration
```json
{
  "mcps": [
    {
      "name": "mcp-server-name",
      "enabled": true,  // or false to skip
      "config": {
        // Server-specific configuration
      }
    }
  ]
}
```

### Available MCP Servers

#### 1. Asana MCP Railway
```json
{
  "name": "asana-mcp-railway",
  "enabled": true,
  "config": {
    "endpoint": "https://asana-mcp-railway-production.up.railway.app",
    "session": "REAL_SESSION_TOKEN_FROM_OAUTH"
  }
}
```
- **Purpose**: Task & project management (42 tools)
- **Auth**: Session-based (obtain from /oauth/start endpoint)
- **Cost**: $5/month Railway

#### 2. SharePoint MCP Railway
```json
{
  "name": "sharepoint-mcp-railway",
  "enabled": true,
  "config": {
    "endpoint": "https://sharepoint-mcp-railway-production.up.railway.app",
    "customer_sites": ["Client Site Name"]
  }
}
```
- **Purpose**: Document management (11 tools)
- **Auth**: Azure AD (universal or per-user)
- **Cost**: $5/month Railway

#### 3. HubSpot MCP Railway
```json
{
  "name": "hubspot-mcp-railway",
  "enabled": true,
  "config": {
    "endpoint": "https://hubspot-mcp-railway-production-6079.up.railway.app/mcp",
    "access_token": "REAL_HUBSPOT_ACCESS_TOKEN"
  }
}
```
- **Purpose**: CRM operations (116 tools)
- **Auth**: Static access token
- **Cost**: $5/month Railway

#### 4. Neo4j Cypher MCP
```json
{
  "name": "neo4j-cypher-mcp",
  "enabled": true,
  "config": {
    "endpoint": "https://scintillating-wholeness-production.up.railway.app/api/mcp/",
    "credentials": {
      "uri": "neo4j+s://xxxxx.databases.neo4j.io",
      "username": "neo4j",
      "password": "REAL_NEO4J_PASSWORD"
    }
  }
}
```
- **Purpose**: Graph database queries
- **Auth**: Neo4j credentials
- **Cost**: $5/month Railway + Neo4j Aura free tier

#### 5. Neo4j Memory MCP
```json
{
  "name": "neo4j-memory-mcp",
  "enabled": true,
  "config": {
    "endpoint": "https://steadfast-tenderness-production-4404.up.railway.app/api/mcp/",
    "credentials": {
      "uri": "neo4j+s://xxxxx.databases.neo4j.io",
      "username": "neo4j",
      "password": "REAL_NEO4J_PASSWORD"
    }
  }
}
```
- **Purpose**: Knowledge graph memory
- **Auth**: Neo4j credentials
- **Cost**: $5/month Railway + Neo4j Aura free tier

### Bridge Configuration
```json
{
  "bridge": {
    "enabled": true,  // Always true - required for delegation
    "debug": false    // Set true for debugging
  }
}
```

## Security Notes

- **Never commit real credentials** to this public repository
- Store real profiles in the **private `claude-client-configs` repository**
- Use meaningful, non-guessable session tokens
- Rotate tokens regularly
- Document token expiration dates in profile notes

## See Also

- [Creating Profiles Guide](../docs/CREATING-PROFILES.md)
- [Deployment Guide](../docs/DEPLOYMENT-GUIDE.md)
- [Security Best Practices](../docs/SECURITY.md)
