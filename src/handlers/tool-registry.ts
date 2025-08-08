/**
 * Tool registry that manages all tool handlers
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { DashboardToolHandlers } from "./dashboard-tools.js";
import { CardToolHandlers } from "./card-tools.js";
import { DatabaseToolHandlers } from "./database-tools.js";
import { TableToolHandlers } from "./table-tools.js";
import { ErrorCode, McpError } from "../types/errors.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ToolFilterOptions } from "../types/metabase.js";

export class ToolRegistry {
  private dashboardHandlers: DashboardToolHandlers;
  private cardHandlers: CardToolHandlers;
  private databaseHandlers: DatabaseToolHandlers;
  private tableHandlers: TableToolHandlers;

  constructor(private client: MetabaseClient, private filterOptions?: ToolFilterOptions) {
    this.dashboardHandlers = new DashboardToolHandlers(client);
    this.cardHandlers = new CardToolHandlers(client);
    this.databaseHandlers = new DatabaseToolHandlers(client);
    this.tableHandlers = new TableToolHandlers(client);
  }

  /**
   * Get all available tool schemas
   */
  getAllToolSchemas(): Tool[] {
    const allTools = [
      ...this.dashboardHandlers.getToolSchemas(),
      ...this.cardHandlers.getToolSchemas(),
      ...this.databaseHandlers.getToolSchemas(),
      ...this.tableHandlers.getToolSchemas(),
      ...this.getAdditionalToolSchemas(),
    ];

    return this.filterTools(allTools);
  }

  /**
   * Handle a tool call
   */
  async handleTool(name: string, args: any): Promise<any> {
    // Dashboard tools
    if (this.isDashboardTool(name)) {
      return await this.dashboardHandlers.handleTool(name, args);
    }

    // Card tools
    if (this.isCardTool(name)) {
      return await this.cardHandlers.handleTool(name, args);
    }

    // Database tools
    if (this.isDatabaseTool(name)) {
      return await this.databaseHandlers.handleTool(name, args);
    }

    if (this.isTableTool(name)) {
      return await this.tableHandlers.handleTool(name, args);
    }

    // Handle other tools directly
    return await this.handleAdditionalTools(name, args);
  }

  private isDashboardTool(name: string): boolean {
    return (
      name.startsWith("dashboard") ||
      [
        "list_dashboards",
        "create_dashboard",
        "update_dashboard",
        "delete_dashboard",
        "get_dashboard_cards",
        // "add_card_to_dashboard",
        "remove_card_from_dashboard",
        "update_dashboard_card",
        "get_dashboard_embeddable",
        "get_dashboard_params_valid_filter_fields",
        // "post_dashboard_pivot_query",
        "get_dashboard_public",
        "post_dashboard_save",
        // "post_dashboard_save_to_collection",
        "post_dashboard_query",
        "post_dashboard_query_export",
        // "get_dashboard_execute",
        // "post_dashboard_execute",
        "post_dashboard_public_link",
        "delete_dashboard_public_link",
        "post_dashboard_copy",
        "get_dashboard",
        "put_dashboard_cards",
        "get_dashboard_items",
        "get_dashboard_param_remapping",
        "get_dashboard_param_search",
        "get_dashboard_param_values",
        "get_dashboard_query_metadata",
        "get_dashboard_related",
      ].includes(name)
    );
  }

  private isCardTool(name: string): boolean {
    return (
      name.startsWith("card") ||
      [
        "list_cards",
        "create_card",
        "update_card",
        "delete_card",
        "execute_card",
        "move_cards",
        "move_cards_to_collection",
        "get_embeddable_cards",
        "execute_pivot_card_query",
        "get_public_cards",
        "get_card_param_values",
        "search_card_param_values",
        "get_card_param_remapping",
        "create_card_public_link",
        "delete_card_public_link",
        "execute_card_query_with_format",
        "copy_card",
        "get_card_dashboards",
        "get_card_query_metadata",
        "get_card_series",
      ].includes(name)
    );
  }

  private isDatabaseTool(name: string): boolean {
    return (
      name.startsWith("database") ||
      name.includes("query") ||
      [
        "list_databases",
        "execute_query",
        "execute_query_export",
        "create_database",
        "create_sample_database",
        "validate_database",
        "get_database",
        "update_database",
        "delete_database",
        // "get_database_autocomplete_suggestions",
        // "get_database_card_autocomplete_suggestions",
        "discard_database_field_values",
        "dismiss_database_spinner",
        "get_database_fields",
        "get_database_healthcheck",
        "get_database_idfields",
        "get_database_metadata",
        "rescan_database_field_values",
        // "get_database_schema_tables_without_schema",
        "get_database_schema_tables",
        "get_database_schema_tables_for_schema",
        "get_database_schemas",
        "sync_database_schema",
        "get_database_syncable_schemas",
        "get_database_usage_info",
        // "get_virtual_database_datasets",
        // "get_virtual_database_datasets_for_schema",
        // "get_virtual_database_metadata",
        // "get_virtual_database_schema_tables",
        // "get_virtual_database_schemas",
      ].includes(name)
    );
  }

  private isTableTool(name: string): boolean {
    return (
      name.startsWith("table") ||
      [
        "list_tables",
        "update_tables",
        "get_card_table_fks",
        // "get_card_table_query_metadata",
        "get_table",
        "update_table",
        "append_csv_to_table",
        "discard_table_field_values",
        "reorder_table_fields",
        "get_table_fks",
        // "get_table_query_metadata",
        "get_table_related",
        "replace_table_csv",
        "rescan_table_field_values",
        // "sync_table_schema",
        // "get_table_data",
      ].includes(name)
    );
  }

  private getAdditionalToolSchemas(): Tool[] {
    return [
      // Collection tools
      {
        name: "list_collections",
        description: "List all collections in Metabase",
        inputSchema: {
          type: "object",
          properties: {
            archived: {
              type: "boolean",
              description: "Include archived collections",
              default: false,
            },
          },
        },
      },
      {
        name: "create_collection",
        description: "Create a new Metabase collection",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the collection" },
            description: {
              type: "string",
              description: "Description of the collection",
            },
            color: { type: "string", description: "Color of the collection" },
            parent_id: {
              type: "number",
              description: "Parent collection ID (null for root level)",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "update_collection",
        description: "Update an existing collection",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "number", description: "Collection ID to update" },
            name: { type: "string", description: "New name of the collection" },
            description: {
              type: "string",
              description: "New description of the collection",
            },
            color: { type: "string", description: "New color of the collection" },
            parent_id: {
              type: "number",
              description: "New parent collection ID",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "delete_collection",
        description: "Delete a collection",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "number", description: "Collection ID to delete" },
          },
          required: ["id"],
        },
      },
      {
        name: "get_collection_items",
        description: "Get all items in a collection",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "number", description: "Collection ID to get items from" },
          },
          required: ["id"],
        },
      },
      {
        name: "move_to_collection",
        description: "Move items between collections",
        inputSchema: {
          type: "object",
          properties: {
            item_type: {
              type: "string",
              description: "Type of item to move",
              enum: ["card", "dashboard"],
            },
            item_id: { type: "number", description: "ID of the item to move" },
            collection_id: {
              type: "number",
              description: "Target collection ID (null for root level)",
            },
          },
          required: ["item_type", "item_id", "collection_id"],
        },
      },

      {
        name: "get_most_recently_viewed_dashboard",
        description: "Get the most recently viewed dashboard",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_popular_items",
        description: "Get popular items in Metabase",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_recent_views",
        description: "Get recent views activity",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_recents",
        description: "Get a list of recent items the current user has been viewing most recently under the :recents key. Allows for filtering by context: views or selections",
        inputSchema: {
          type: "object",
          properties: {
            context: {
              type: "array",
              description: "Filter by context type",
              items: {
                type: "string",
                enum: ["selections", "views"]
              }
            },
            include_metadata: {
              type: "boolean",
              description: "Include metadata in the response",
              default: false
            }
          },
          required: ["context"]
        },
      },
      {
        name: "post_recents",
        description: "Post recent activity data",
        inputSchema: {
          type: "object",
          properties: {
            data: {
              type: "object",
              description: "Activity data to post",
            },
          },
          required: ["data"],
        },
      },
      // User tools
      {
        name: "list_users",
        description: "List all users in Metabase",
        inputSchema: {
          type: "object",
          properties: {
            include_deactivated: {
              type: "boolean",
              description: "Include deactivated users",
              default: false,
            },
          },
        },
      },
      {
        name: "create_user",
        description: "Create a new Metabase user",
        inputSchema: {
          type: "object",
          properties: {
            first_name: { type: "string", description: "User's first name" },
            last_name: { type: "string", description: "User's last name" },
            email: { type: "string", description: "User's email address" },
            password: { type: "string", description: "User's password" },
            group_ids: {
              type: "array",
              description: "Array of group IDs to assign user to",
              items: { type: "number" },
            },
          },
          required: ["first_name", "last_name", "email"],
        },
      },
      // Permission tools
      {
        name: "list_permission_groups",
        description: "List all permission groups",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "create_permission_group",
        description: "Create a new permission group",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the permission group",
            },
          },
          required: ["name"],
        },
      },
      // Search tools
      {
        name: "search_content",
        description: "Search across all Metabase content",
        inputSchema: {
          type: "object",
          properties: {
            q: {
              type: "string",
              description: "Search query",
              minLength: 1
            },
            context: { type: "string", description: "Search context" },
            archived: {
              type: "boolean",
              description: "Set to true to search archived items only",
              default: false
            },
            table_db_id: {
              type: "integer",
              description: "Search for tables, cards, and models of a certain DB",
              minimum: 1
            },
            models: {
              type: "array",
              description: "Only search for items of specific models",
              items: {
                type: "string",
                enum: ["dashboard", "table", "dataset", "segment", "collection", "database", "action", "indexed-entity", "metric", "card"]
              }
            },
            filter_items_in_personal_collection: {
              type: "string",
              description: "Filter items in personal collections",
              enum: ["all", "only", "only-mine", "exclude", "exclude-others"]
            },
            created_at: {
              type: "string",
              description: "Search for items created at a specific timestamp",
              minLength: 1
            },
            created_by: {
              type: "array",
              description: "Search for items created by specific users",
              items: { type: "integer" }
            },
            display_type: {
              type: "array",
              description: "Search for cards/models with specific display types",
              items: { type: "string" }
            },
            has_temporal_dimensions: {
              type: "boolean",
              description: "Set to true to search for cards with temporal dimensions only"
            },
            last_edited_at: {
              type: "string",
              description: "Search for items last edited at a specific timestamp",
              minLength: 1
            },
            last_edited_by: {
              type: "array",
              description: "Search for items last edited by specific users",
              items: { type: "integer" }
            },
            model_ancestors: {
              type: "boolean",
              description: "Include model ancestors",
              default: false
            },
            search_engine: { type: "string", description: "Search engine to use" },
            search_native_query: {
              type: "boolean",
              description: "Set to true to search the content of native queries"
            },
            verified: {
              type: "boolean",
              description: "Set to true to search for verified items only"
            },
            ids: {
              type: "array",
              description: "Search for items with specific IDs",
              items: { type: "integer" }
            },
            calculate_available_models: {
              type: "boolean",
              description: "Calculate available models"
            },
            include_dashboard_questions: {
              type: "boolean",
              description: "Include dashboard questions",
              default: false
            },
            include_metadata: {
              type: "boolean",
              description: "Include metadata",
              default: false
            }
          },
          required: ["q"]
        },
      },
    ];
  }

  private async handleAdditionalTools(name: string, args: any): Promise<any> {
    switch (name) {
      // Collection operations
      case "list_collections":
        return await this.handleListCollections(args);
      case "create_collection":
        return await this.handleCreateCollection(args);
      case "update_collection":
        return await this.handleUpdateCollection(args);
      case "delete_collection":
        return await this.handleDeleteCollection(args);
      case "get_collection_items":
        return await this.handleGetCollectionItems(args);
      case "move_to_collection":
        return await this.handleMoveToCollection(args);

      // Activity operations
      case "get_most_recently_viewed_dashboard":
        return await this.handleGetMostRecentlyViewedDashboard(args);
      case "get_popular_items":
        return await this.handleGetPopularItems(args);
      case "get_recent_views":
        return await this.handleGetRecentViews(args);
      case "get_recents":
        return await this.handleGetRecents(args);
      case "post_recents":
        return await this.handlePostRecents(args);

      // User operations
      case "list_users":
        return await this.handleListUsers(args);
      case "create_user":
        return await this.handleCreateUser(args);

      // Permission operations
      case "list_permission_groups":
        return await this.handleListPermissionGroups();
      case "create_permission_group":
        return await this.handleCreatePermissionGroup(args);

      // Search operations
      case "search_content":
        return await this.handleSearchContent(args);

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  }

  private async handleListCollections(args: any): Promise<any> {
    const { archived = false } = args;
    const collections = await this.client.getCollections(archived);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(collections, null, 2),
        },
      ],
    };
  }

  private async handleCreateCollection(args: any): Promise<any> {
    const { name, description, color, parent_id } = args;

    if (!name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Collection name is required"
      );
    }

    const collectionData: any = { name };
    if (description !== undefined) collectionData.description = description;
    if (color !== undefined) collectionData.color = color;
    if (parent_id !== undefined) collectionData.parent_id = parent_id;

    const collection = await this.client.createCollection(collectionData);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(collection, null, 2),
        },
      ],
    };
  }

  private async handleListUsers(args: any): Promise<any> {
    const { include_deactivated = false } = args;
    const users = await this.client.getUsers(include_deactivated);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(users, null, 2),
        },
      ],
    };
  }

  private async handleCreateUser(args: any): Promise<any> {
    const { first_name, last_name, email, password, group_ids } = args;

    if (!first_name || !last_name || !email) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "first_name, last_name, and email are required"
      );
    }

    const userData: any = { first_name, last_name, email };
    if (password !== undefined) userData.password = password;
    if (group_ids !== undefined) userData.group_ids = group_ids;

    const user = await this.client.createUser(userData);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(user, null, 2),
        },
      ],
    };
  }

  private async handleListPermissionGroups(): Promise<any> {
    const groups = await this.client.getPermissionGroups();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(groups, null, 2),
        },
      ],
    };
  }

  private async handleCreatePermissionGroup(args: any): Promise<any> {
    const { name } = args;

    if (!name) {
      throw new McpError(ErrorCode.InvalidParams, "Group name is required");
    }

    const group = await this.client.createPermissionGroup(name);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(group, null, 2),
        },
      ],
    };
  }

  private async handleSearchContent(args: any): Promise<any> {
    const { q, ...otherParams } = args;

    if (!q) {
      throw new McpError(ErrorCode.InvalidParams, "Search query (q) is required");
    }

    const queryParams = new URLSearchParams();
    queryParams.append('q', q);

    // Handle all other parameters
    Object.entries(otherParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle array parameters
          if (value.length > 0) {
            if (key === 'models' || key === 'created_by' || key === 'last_edited_by' || key === 'display_type' || key === 'ids') {
              value.forEach(item => queryParams.append(key, item.toString()));
            }
          }
        } else {
          // Handle scalar parameters
          queryParams.append(key, value.toString());
        }
      }
    });

    const searchUrl = `/api/search?${queryParams.toString()}`;
    const results = await this.client.apiCall("GET", searchUrl);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async handleUpdateCollection(args: any): Promise<any> {
    const { id, name, description, color, parent_id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (color !== undefined) updates.color = color;
    if (parent_id !== undefined) updates.parent_id = parent_id;

    const collection = await this.client.updateCollection(id, updates);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(collection, null, 2),
        },
      ],
    };
  }

  private async handleDeleteCollection(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
    }

    await this.client.deleteCollection(id);
    return {
      content: [
        {
          type: "text",
          text: `Collection ${id} deleted successfully`,
        },
      ],
    };
  }

  private async handleGetCollectionItems(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
    }

    const items = await this.client.apiCall("GET", `/api/collection/${id}/items`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(items, null, 2),
        },
      ],
    };
  }

  private async handleMoveToCollection(args: any): Promise<any> {
    const { item_type, item_id, collection_id } = args;

    if (!item_type || !item_id || collection_id === undefined) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "item_type, item_id, and collection_id are required"
      );
    }

    const endpoint = item_type === "card" ? `/api/card/${item_id}` : `/api/dashboard/${item_id}`;
    const result = await this.client.apiCall("PUT", endpoint, {
      collection_id: collection_id,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetMostRecentlyViewedDashboard(args: any): Promise<any> {
    const dashboard = await this.client.getMostRecentlyViewedDashboard();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(dashboard, null, 2),
        },
      ],
    };
  }

  private async handleGetPopularItems(args: any): Promise<any> {
    const items = await this.client.getPopularItems();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(items, null, 2),
        },
      ],
    };
  }

  private async handleGetRecentViews(args: any): Promise<any> {
    const views = await this.client.getRecentViews();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(views, null, 2),
        },
      ],
    };
  }

  private async handleGetRecents(args: any): Promise<any> {
    const { context, include_metadata = false } = args;

    if (!context || !Array.isArray(context) || context.length === 0) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Context parameter is required and must be a non-empty array"
      );
    }

    const validContexts = ["selections", "views"];
    const invalidContexts = context.filter(ctx => !validContexts.includes(ctx));
    if (invalidContexts.length > 0) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid context values: ${invalidContexts.join(", ")}. Valid values are: ${validContexts.join(", ")}`
      );
    }

    const recents = await this.client.getRecents(context, include_metadata);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(recents, null, 2),
        },
      ],
    };
  }

  private async handlePostRecents(args: any): Promise<any> {
    const { data } = args;

    if (!data) {
      throw new McpError(ErrorCode.InvalidParams, "Data is required");
    }

    const result = await this.client.postRecents(data);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private filterTools(tools: Tool[]): Tool[] {
    if (!this.filterOptions) {
      return tools.filter(tool => this.isEssentialTool(tool.name) && !this.isWriteTool(tool.name));
    }

    // Handle --write flag only (show essential + write tools = 45 total)
    if (this.filterOptions.includeWriteTools && !this.filterOptions.includeAllTools) {
      return tools.filter(tool => this.isEssentialTool(tool.name) || this.isWriteTool(tool.name));
    }

    // Handle --all-tools flag only (show all 94 tools)
    if (this.filterOptions.includeAllTools && !this.filterOptions.includeWriteTools) {
      return tools;
    }

    // Handle both flags together (show all 94 tools)
    if (this.filterOptions.includeWriteTools && this.filterOptions.includeAllTools) {
      return tools;
    }

    return tools.filter(tool => this.isEssentialTool(tool.name) && !this.isWriteTool(tool.name));
  }

  private isWriteTool(toolName: string): boolean {
    const writePlusTools = new Set([
      'create_dashboard',
      'update_dashboard',
      'delete_dashboard',
      'remove_card_from_dashboard',
      'update_dashboard_card',
      'post_dashboard_save',
      'post_dashboard_query',
      'post_dashboard_query_export',
      'put_dashboard_cards',
      'create_card',
      'update_card',
      'delete_card',
      'move_cards',
      'move_cards_to_collection',
      'copy_card',
      'create_database',
      'validate_database',
      'update_database',
      'delete_database',
      'update_table',
      'reorder_table_fields',
      'create_collection',
      'update_collection',
      'delete_collection',
      'move_to_collection'
    ]);

    return writePlusTools.has(toolName);
  }

  private isEssentialTool(toolName: string): boolean {
    const essentialTools = new Set([
      'list_dashboards',
      'get_dashboard',
      'get_dashboard_cards',
      'get_dashboard_items',
      'list_cards',
      'execute_card',
      'get_card_dashboards',
      'list_databases',
      'get_database',
      'get_database_schema_tables',
      'get_database_schema_tables_for_schema',
      'get_database_schemas',
      'execute_query',
      'list_tables',
      'get_table',
      'list_collections',
      'get_collection_items',
      'list_users',
      'list_permission_groups',
      'search_content'
    ]);

    return essentialTools.has(toolName);
  }
}
