/**
 * Additional tool handlers that are not part of the main config-driven categories
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class AdditionalToolHandlers {
  constructor(private client: MetabaseClient) {}

  /**
   * Get tool schemas for additional tools
   */
  getToolSchemas(): Tool[] {
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
      // Activity/Recent tools
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
              minLength: 1,
            },
          },
          required: ["q"],
        },
      },
    ];
  }

  /**
   * Handle additional tool calls
   */
  async handleTool(name: string, args: any): Promise<any> {
    switch (name) {
      // Collection tools
      case "list_collections":
        return await this.listCollections(args);
      case "create_collection":
        return await this.createCollection(args);
      case "update_collection":
        return await this.updateCollection(args);
      case "delete_collection":
        return await this.deleteCollection(args);
      case "get_collection_items":
        return await this.getCollectionItems(args);
      case "move_to_collection":
        return await this.moveToCollection(args);
      
      // Activity/Recent tools
      case "get_most_recently_viewed_dashboard":
        return await this.getMostRecentlyViewedDashboard(args);
      case "get_popular_items":
        return await this.getPopularItems(args);
      case "get_recent_views":
        return await this.getRecentViews(args);
      case "get_recents":
        return await this.getRecents(args);
      case "post_recents":
        return await this.postRecents(args);
      
      // User tools
      case "list_users":
        return await this.listUsers(args);
      
      // Search tools
      case "search_content":
        return await this.searchContent(args);
      
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown additional tool: ${name}`);
    }
  }

  // Collection tool implementations
  private async listCollections(args: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (args.archived !== undefined) {
      queryParams.append('archived', args.archived.toString());
    }
    
    const url = `/api/collection?${queryParams.toString()}`;
    const results = await this.client.apiCall("GET", url);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async createCollection(args: any): Promise<any> {
    const { name, description, color, parent_id } = args;
    
    if (!name) {
      throw new McpError(ErrorCode.InvalidParams, "Collection name is required");
    }
    
    const payload: any = { name };
    if (description) payload.description = description;
    if (color) payload.color = color;
    if (parent_id !== undefined) payload.parent_id = parent_id;
    
    const results = await this.client.apiCall("POST", "/api/collection", payload);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async updateCollection(args: any): Promise<any> {
    const { id, name, description, color, parent_id } = args;
    
    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
    }
    
    const payload: any = {};
    if (name) payload.name = name;
    if (description) payload.description = description;
    if (color) payload.color = color;
    if (parent_id !== undefined) payload.parent_id = parent_id;
    
    const results = await this.client.apiCall("PUT", `/api/collection/${id}`, payload);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async deleteCollection(args: any): Promise<any> {
    const { id } = args;
    
    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
    }
    
    const results = await this.client.apiCall("DELETE", `/api/collection/${id}`);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async getCollectionItems(args: any): Promise<any> {
    const { id } = args;
    
    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
    }
    
    const results = await this.client.apiCall("GET", `/api/collection/${id}/items`);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async moveToCollection(args: any): Promise<any> {
    const { item_type, item_id, collection_id } = args;
    
    if (!item_type || !item_id || collection_id === undefined) {
      throw new McpError(ErrorCode.InvalidParams, "item_type, item_id, and collection_id are required");
    }
    
    const payload = { collection_id };
    const results = await this.client.apiCall("PUT", `/api/${item_type}/${item_id}`, payload);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  // Activity/Recent tool implementations
  private async getMostRecentlyViewedDashboard(args: any): Promise<any> {
    const results = await this.client.apiCall("GET", "/api/activity/most_recently_viewed_dashboard");
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async getPopularItems(args: any): Promise<any> {
    const results = await this.client.apiCall("GET", "/api/activity/popular_items");
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async getRecentViews(args: any): Promise<any> {
    const results = await this.client.apiCall("GET", "/api/activity/recent_views");
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async getRecents(args: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (args.context) {
      args.context.forEach((ctx: string) => queryParams.append('context', ctx));
    }
    if (args.include_metadata !== undefined) {
      queryParams.append('include_metadata', args.include_metadata.toString());
    }
    
    const url = `/api/activity/recents?${queryParams.toString()}`;
    const results = await this.client.apiCall("GET", url);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async postRecents(args: any): Promise<any> {
    const { data } = args;
    
    if (!data) {
      throw new McpError(ErrorCode.InvalidParams, "Activity data is required");
    }
    
    const results = await this.client.apiCall("POST", "/api/activity/recents", data);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  // User tool implementations
  private async listUsers(args: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (args.include_deactivated !== undefined) {
      queryParams.append('include_deactivated', args.include_deactivated.toString());
    }
    
    const url = `/api/user?${queryParams.toString()}`;
    const results = await this.client.apiCall("GET", url);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  // Search tool implementations
  private async searchContent(args: any): Promise<any> {
    const { q, ...otherParams } = args;

    if (!q) {
      throw new McpError(ErrorCode.InvalidParams, "Search query is required");
    }

    const queryParams: any = { q };
    Object.entries(otherParams).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value;
      }
    });

    const searchUrl = `/api/search?${new URLSearchParams(queryParams).toString()}`;
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
}
