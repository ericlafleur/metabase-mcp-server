# metabase-server MCP Server

A comprehensive Model Context Protocol server for Metabase integration.

This is a TypeScript-based MCP server that implements full integration with Metabase API. It allows AI assistants to interact with Metabase, providing comprehensive access to:

- **Complete CRUD Operations**: Full lifecycle management for all Metabase entities
- **Advanced Dashboard Management**: Card positioning, parameters, subscriptions, and alerts
- **User & Permission Management**: Complete user lifecycle and permission system control
- **Database Management**: Connection management, schema sync, and metadata exploration
- **Analytics & Monitoring**: Usage statistics, activity tracking, and system health monitoring
- **Advanced Query Features**: Bookmarking, public sharing, and complex query execution
- **Search & Discovery**: Global search, popular items, and content recommendations
- **Settings & Configuration**: System settings and instance configuration management

## **80+ Tools Available** covering all major Metabase functionality for enterprise usage.

**Recent Update**: Database tools have been completely revamped with 31 official Metabase API endpoints, replacing previous incorrect implementations with accurate descriptions and parameters from official documentation.

## Features

### Resources

- Access Metabase resources via `metabase://` URIs
- **Dashboards**: `metabase://dashboard/{id}` - Access dashboard details
- **Cards/Questions**: `metabase://card/{id}` - Access question/card details
- **Databases**: `metabase://database/{id}` - Access database information
- **Collections**: `metabase://collection/{id}` - Access collection details
- **Users**: `metabase://user/{id}` - Access user information
- **Tables**: `metabase://table/{id}` - Access table metadata
- **Fields**: `metabase://field/{id}` - Access field information
- JSON content type for structured data access

### Core Data Management Tools

#### Dashboard Management

- ✅ `list_dashboards` - List all dashboards in Metabase
- ✅ `create_dashboard` - Create a new dashboard
- ✅ `update_dashboard` - Update an existing dashboard
- ✅ `delete_dashboard` - Delete/archive a dashboard
- ✅ `get_dashboard_cards` - Get all cards in a dashboard

#### Card/Question Management

- ✅ `list_cards` - List all questions/cards in Metabase
- ✅ `create_card` - Create a new question/card
- ✅ `update_card` - Update an existing question/card
- ✅ `delete_card` - Delete/archive a question/card
- ✅ `execute_card` - Execute a card and get results
- ✅ `move_cards` - Move multiple cards to a collection or dashboard
- ✅ `move_cards_to_collection` - Bulk update endpoint for Card Collections. Move a set of Cards into a Collection or remove them from Collections
- ✅ `get_embeddable_cards` - Get all embeddable cards
- ✅ `execute_pivot_card_query` - Execute a pivot query for a card
- ✅ `get_public_cards` - Get all public cards
- ✅ `get_card_param_values` - Get values for a card parameter
- ✅ `search_card_param_values` - Search values for a card parameter
- ✅ `get_card_param_remapping` - Get parameter remapping for a card
- ✅ `create_card_public_link` - Create a public link for a card
- ✅ `delete_card_public_link` - Delete a public link for a card
- ✅ `execute_card_query_with_format` - Execute a card query with a specific export format
- ✅ `copy_card` - Create a copy of a card
- ✅ `get_card_dashboards` - Get all dashboards containing a card
- ✅ `get_card_query_metadata` - Get query metadata for a card
- ✅ `get_card_series` - Get series data for a card

### Collections Management

- ✅ `list_collections` - List all collections
- ✅ `create_collection` - Create a new collection
- ✅`update_collection` - Update an existing collection
- ✅`delete_collection` - Delete a collection
- ✅`get_collection_items` - Get all items in a collection
- ✅`move_to_collection` - Move items between collections

### User & Permission Management

- ✅ `list_users` - List all users
- ✅ `create_user` - Create a new user
- `update_user` - Update user details
- `delete_user` - Deactivate a user
- `list_permissions` - List permission groups and permissions
- ✅ `list_permission_groups` - List all permission groups
- ✅ `create_permission_group` - Create a new permission group
- `update_permission_group` - Update a permission group
- `delete_permission_group` - Delete a permission group
- `add_user_to_group` - Add user to permission group
- `remove_user_from_group` - Remove user from permission group

### Advanced Query Features

- `bookmark_card` - Bookmark a card
- `unbookmark_card` - Remove card bookmark
- `bookmark_dashboard` - Bookmark a dashboard
- `unbookmark_dashboard` - Remove dashboard bookmark
- `list_bookmarked_items` - List all bookmarked items
- `create_public_link` - Create public sharing link
- `disable_public_link` - Disable public sharing
- `get_public_link` - Get public link information

### Search & Discovery

- ✅ `search_content` - Search across all Metabase content

### Activity & Recent Items (5 Tools - New Implementation)

**Note: Activity tools have been newly implemented with official Metabase API endpoints.**

- ✅ `get_most_recently_viewed_dashboard` - Get the most recently viewed dashboard
- ✅ `get_popular_items` - Get popular items in Metabase
- ✅ `get_recent_views` - Get recent views activity
- ✅ `get_recents` - Get recent activity items
- ✅ `post_recents` - Post recent activity data

### Advanced Dashboard Features (33 Tools - Updated with Official Metabase API Endpoints)

**Note: Dashboard tools have been completely updated with 25+ new official Metabase API endpoints while preserving all existing functionality.**

#### Core Dashboard Operations (Preserved)
- ✅ `list_dashboards` - List all dashboards in Metabase
- ✅ `create_dashboard` - Create a new Metabase dashboard
- ✅ `update_dashboard` - Update an existing Metabase dashboard
- ✅ `delete_dashboard` - Delete a Metabase dashboard
- ✅ `get_dashboard_cards` - Get all cards in a dashboard

#### Dashboard Card Management (Preserved)
- ❌ `add_card_to_dashboard`(depriciated) - Add a card to a dashboard with positioning
- ✅ `remove_card_from_dashboard` - Remove a card from a dashboard
- ✅ `update_dashboard_card` - Update card position, size, and settings

#### Dashboard Embedding & Public Access
- ✅ `get_dashboard_embeddable` - Get embeddable dashboards
- ✅ `get_dashboard_public` - Get public dashboards
- ✅ `post_dashboard_public_link` - Create a public link for a dashboard
- ✅ `delete_dashboard_public_link` - Delete a public link for a dashboard

#### Dashboard Queries & Execution
- ✅ `post_dashboard_query` - Execute a query for a dashboard card
- ✅ `post_dashboard_query_export` - Export dashboard card query results in specified format
- ⏳ `post_dashboard_pivot_query` - Execute a pivot query for a dashboard card
- ❌ `get_dashboard_execute` - Get execution status for a dashboard card
- ❌ `post_dashboard_execute` - Execute a dashboard card

#### Dashboard Parameters & Filtering
- ✅ `get_dashboard_params_valid_filter_fields` - Get valid filter fields for dashboard parameters
- ✅ `get_dashboard_param_remapping` - Get parameter remapping for a dashboard
- ✅ `get_dashboard_param_search` - Search dashboard parameter values
- ✅ `get_dashboard_param_values` - Get parameter values for a dashboard

#### Dashboard Management & Operations
- ✅ `post_dashboard_save` - Save a dashboard
- ⏳ `post_dashboard_save_to_collection` - Save a dashboard to a specific collection
- ✅ `post_dashboard_copy` - Copy a dashboard
- ✅ `get_dashboard` - Get a specific dashboard by ID
- ✅ `put_dashboard_cards` - Update dashboard cards configuration
- ✅ `get_dashboard_items` - Get dashboard items
- ✅ `get_dashboard_query_metadata` - Get query metadata for a dashboard
- ✅ `get_dashboard_related` - Get related content for a dashboard

### Analytics & Monitoring

- `get_user_activity` - Get user activity and usage statistics
- `get_content_usage` - Get usage statistics for cards and dashboards
- `get_system_usage_stats` - Get system-wide usage statistics
- `get_system_health` - Get system health status

### Database Management (31 Tools - Updated with Official Metabase API Endpoints)

**Note: Database tools have been completely revamped to use official Metabase API endpoints with correct descriptions and parameters.**

#### Core Database Operations
- ✅ `list_databases` - List all databases in Metabase (simplified version)
- ❌ `create_database` - Create a new database connection
- ✅ `create_sample_database` - Create a sample database for testing
- ❌ `validate_database` - Validate database connection settings
- ✅ `get_database` - Get details of a specific database
- ✅ `update_database` - Update database connection settings
- ✅ `delete_database` - Delete a database connection
- ✅ `execute_query` - Execute SQL queries against a database with parameters
- ✅ `execute_query_export` - Execute a query and download the result data as a file in the specified format (CSV, JSON, XLSX, etc.)

#### Database Schema & Metadata
- ✅ `get_database_schema_tables` - Get all tables in a database
- ⏳ `get_database_schema_tables_without_schema` - Get tables without schema
- ✅ `get_database_schema_tables_for_schema` - Get tables for a specific schema
- ✅ `get_database_schemas` - Get all schemas in a database
- ✅ `get_database_metadata` - Get complete database metadata
- ✅ `get_database_fields` - Get all fields in a database
- ✅ `get_database_id_fields` - Get ID fields for a database
- ✅ `sync_database_schema` - Sync database schema metadata
- ✅ `get_database_syncable_schemas` - Get schemas available for syncing

#### Database Operations & Maintenance
- ✅ `get_database_healthcheck` - Check database connection health
- ✅ `get_database_usage_info` - Get database usage statistics
- ✅ `rescan_database_field_values` - Rescan field values for a database
- ✅ `discard_database_field_values` - Discard cached field values
- ✅ `dismiss_database_spinner` - Dismiss database loading spinner

#### Autocomplete & Suggestions
- ⏳ `get_database_autocomplete_suggestions` - Get autocomplete suggestions for database queries
- ⏳ `get_database_card_autocomplete_suggestions` - Get card-specific autocomplete suggestions

#### Virtual Database Operations
- ⏳ `get_virtual_database_datasets` - Get datasets from virtual databases
- ⏳ `get_virtual_database_datasets_for_schema` - Get datasets for a specific virtual schema
- ⏳ `get_virtual_database_metadata` - Get virtual database metadata
- ⏳ `get_virtual_database_schema_tables` - Get tables from virtual database schema
- ⏳ `get_virtual_database_schemas` - Get all schemas from virtual databases

### Table Management Tools

#### Core Table Operations
- ✅ `list_tables` - List all tables with optional filtering by IDs
- ✅ `update_tables` - Update multiple tables with bulk operations
- ✅ `get_table` - Get detailed information about a specific table
- ✅ `update_table` - Update a specific table's configuration and metadata

#### Table Data Operations
- ⏳ `get_table_data` - Retrieve data from a specific table with pagination support
- ✅ `append_csv_to_table` - Append CSV data to an existing table
- ✅ `replace_table_csv` - Replace table data with new CSV content

#### Table Schema & Metadata
- ⏳ `get_table_query_metadata` - Get query metadata for a specific table
- ✅ `get_table_fks` - Get foreign key relationships for a table
- ✅ `get_table_related` - Get related tables and relationships
- ⏳ `sync_table_schema` - Synchronize table schema with the database
- ✅ `reorder_table_fields` - Reorder the display order of table fields

#### Table Field Operations
- ✅ `rescan_table_field_values` - Rescan and update field values for a table
- ✅ `discard_table_field_values` - Discard cached field values for a table

#### Card Table Operations
- ✅ `get_card_table_fks` - Get foreign key relationships for a card's table
- ⏳ `get_card_table_query_metadata` - Get query metadata for a card's table

### Settings & Configuration

- `get_metabase_settings` - Get Metabase instance settings
- `update_metabase_settings` - Update instance settings

## Resources

### MCP Resource Templates

- ✅ `metabase://dashboard/{id}` - Get a Metabase dashboard by its ID
- ✅ `metabase://card/{id}` - Get a Metabase question/card by its ID
- ✅ `metabase://database/{id}` - Get a Metabase database by its ID
- ✅ `metabase://collection/{id}` - Get a Metabase collection by its ID
- ✅ `metabase://user/{id}` - Get a Metabase user by its ID
- ✅ `metabase://table/{id}` - Get a Metabase table by its ID
- ✅ `metabase://field/{id}` - Get a Metabase field by its ID

## Configuration

Before running the server, you need to set environment variables for authentication. The server supports two methods:

1.  **API Key (Preferred):**

    - `METABASE_URL`: The URL of your Metabase instance (e.g., `https://your-metabase-instance.com`).
    - `METABASE_API_KEY`: Your Metabase API key.

2.  **Username/Password (Fallback):**
    - `METABASE_URL`: The URL of your Metabase instance.
    - `METABASE_USERNAME`: Your Metabase username.
    - `METABASE_PASSWORD`: Your Metabase password.

The server will first check for `METABASE_API_KEY`. If it's set, API key authentication will be used. If `METABASE_API_KEY` is not set, the server will fall back to using `METABASE_USERNAME` and `METABASE_PASSWORD`. You must provide credentials for at least one of these methods.

**Example setup:**

Using API Key:

```bash
# Required environment variables
export METABASE_URL=https://your-metabase-instance.com
export METABASE_API_KEY=your_metabase_api_key
```

Or, using Username/Password:

```bash
# Required environment variables
export METABASE_URL=https://your-metabase-instance.com
export METABASE_USERNAME=your_username
export METABASE_PASSWORD=your_password
```

You can set these environment variables in your shell profile or use a `.env` file with a package like `dotenv`.

## Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

For development with auto-rebuild:

```bash
npm run watch
```

## Installation & Usage

### Method 1: Using npx (Recommended)

The easiest way to run the server is using npx:

```bash
# Set environment variables
export METABASE_URL=https://your-metabase-instance.com
export METABASE_API_KEY=your_metabase_api_key

# Run the server
npx @usacognition/mcp-metabase-server
```

### Method 2: Using Node.js directly

If you have the package installed locally or globally:

```bash
# Install globally
npm install -g @usacognition/mcp-metabase-server

# Set environment variables
export METABASE_URL=https://your-metabase-instance.com
export METABASE_API_KEY=your_metabase_api_key

# Run the server
mcp-metabase-server
```

Or run from the built project:

```bash
# Clone and build the project
git clone https://github.com/usacognition/metabase-mcp-server.git
cd mcp-metabase-server
npm install
npm run build

# Set environment variables
export METABASE_URL=https://your-metabase-instance.com
export METABASE_API_KEY=your_metabase_api_key

# Run the server
node dist/index.js
```

### Method 3: Using Docker

You can run the server using Docker:

```bash
# Build the Docker image
docker build -t mcp-metabase-server .

# Run the container
docker run -it --rm \
  -e METABASE_URL=https://your-metabase-instance.com \
  -e METABASE_API_KEY=your_metabase_api_key \
  mcp-metabase-server
```

Or using docker-compose:

```yaml
# docker-compose.yml
version: "3.8"
services:
  mcp-metabase-server:
    build: .
    environment:
      - METABASE_URL=https://your-metabase-instance.com
      - METABASE_API_KEY=your_metabase_api_key
    stdin_open: true
    tty: true
```

Then run:

```bash
docker-compose up
```

### Integration with Claude Desktop

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

#### Using npx:

```json
{
  "mcpServers": {
    "metabase-server": {
      "command": "npx",
      "args": ["@usacognition/mcp-metabase-server"],
      "env": {
        "METABASE_URL": "https://your-metabase-instance.com",
        "METABASE_API_KEY": "your_metabase_api_key"
      }
    }
  }
}
```

#### Using Node.js directly:

```json
{
  "mcpServers": {
    "metabase-server": {
      "command": "node",
      "args": ["/path/to/metabase-server/dist/index.js"],
      "env": {
        "METABASE_URL": "https://your-metabase-instance.com",
        "METABASE_API_KEY": "your_metabase_api_key"
      }
    }
  }
}
```

#### Alternative authentication (username/password):

```json
{
  "mcpServers": {
    "metabase-server": {
      "command": "npx",
      "args": ["@usacognition/mcp-metabase-server"],
      "env": {
        "METABASE_URL": "https://your-metabase-instance.com",
        "METABASE_USERNAME": "your_username",
        "METABASE_PASSWORD": "your_password"
      }
    }
  }
}
```

### Environment Variables

The server supports the following environment variables:

- **METABASE_URL** (required): The URL of your Metabase instance
- **METABASE_API_KEY** (preferred): Your Metabase API key
- **METABASE_USERNAME**: Your Metabase username (fallback if API key not provided)
- **METABASE_PASSWORD**: Your Metabase password (fallback if API key not provided)

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Testing

After configuring the environment variables as described in the "Configuration" section, you can manually test the server's authentication. The MCP Inspector (`npm run inspector`) is a useful tool for sending requests to the server.

### 1. Testing with API Key Authentication

1.  Set the `METABASE_URL` and `METABASE_API_KEY` environment variables with your Metabase instance URL and a valid API key.
2.  Ensure `METABASE_USERNAME` and `METABASE_PASSWORD` are unset or leave them, as the API key should take precedence.
3.  Start the server: `npm run build && node build/index.js` (or use your chosen method for running the server, like via Claude Desktop config).
4.  Check the server logs. You should see a message indicating that it's using API key authentication (e.g., "Using Metabase API Key for authentication.").
5.  Using an MCP client or the MCP Inspector, try calling a tool, for example, `tools/call` with `{"name": "list_dashboards"}`.
6.  Verify that the tool call is successful and you receive the expected data.

### 2. Testing with Username/Password Authentication (Fallback)

1.  Ensure the `METABASE_API_KEY` environment variable is unset.
2.  Set `METABASE_URL`, `METABASE_USERNAME`, and `METABASE_PASSWORD` with valid credentials for your Metabase instance.
3.  Start the server.
4.  Check the server logs. You should see a message indicating that it's using username/password authentication (e.g., "Using Metabase username/password for authentication." followed by "Authenticating with Metabase using username/password...").
5.  Using an MCP client or the MCP Inspector, try calling the `list_dashboards` tool.
6.  Verify that the tool call is successful.

### 3. Testing Authentication Failures

- **Invalid API Key:**
  1.  Set `METABASE_URL` and an invalid `METABASE_API_KEY`. Ensure `METABASE_USERNAME` and `METABASE_PASSWORD` variables are unset.
  2.  Start the server.
  3.  Attempt to call a tool (e.g., `list_dashboards`). The tool call should fail, and the server logs might indicate an authentication error from Metabase (e.g., "Metabase API error: Invalid X-API-Key").
- **Invalid Username/Password:**
  1.  Ensure `METABASE_API_KEY` is unset. Set `METABASE_URL` and invalid `METABASE_USERNAME`/`METABASE_PASSWORD`.
  2.  Start the server.
  3.  Attempt to call a tool. The tool call should fail due to failed session authentication. The server logs might show "Authentication failed" or "Failed to authenticate with Metabase".
- **Missing Credentials:**
  1.  Unset `METABASE_API_KEY`, `METABASE_USERNAME`, and `METABASE_PASSWORD`. Set only `METABASE_URL`.
  2.  Attempt to start the server.
  3.  The server should fail to start and log an error message stating that authentication credentials (either API key or username/password) are required (e.g., "Either (METABASE_URL and METABASE_API_KEY) or (METABASE_URL, METABASE_USERNAME, and METABASE_PASSWORD) environment variables are required").

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Contributing

Contributions are welcome! Please visit our [GitHub repository](https://github.com/usacognition/metabase-mcp-server.git) to submit issues or pull requests.
