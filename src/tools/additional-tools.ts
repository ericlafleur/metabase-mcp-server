/**
 * Additional tools configuration for config-driven tool registry
 */

import { ToolConfig, defaultResponseFormatter } from "../types/tool-config.js";
import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";

export const additionalTools: Record<string, ToolConfig> = {
  // Collection tools
  list_collections: {
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
    handler: async (client: MetabaseClient, args: any) => {
      const results = await client.getCollections(args.archived || false);
      return defaultResponseFormatter(results);
    }
  },

  create_collection: {
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
    validate: (args) => {
      if (!args.name) {
        throw new McpError(ErrorCode.InvalidParams, "Collection name is required");
      }
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { name, description, color, parent_id } = args;
      
      const payload: any = { name };
      if (description) payload.description = description;
      if (color) payload.color = color;
      if (parent_id !== undefined) payload.parent_id = parent_id;
      
      const results = await client.createCollection(payload);
      return defaultResponseFormatter(results);
    }
  },

  update_collection: {
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
    validate: (args) => {
      if (!args.id) {
        throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
      }
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id, name, description, color, parent_id } = args;
      
      const payload: any = {};
      if (name) payload.name = name;
      if (description) payload.description = description;
      if (color) payload.color = color;
      if (parent_id !== undefined) payload.parent_id = parent_id;
      
      const results = await client.updateCollection(id, payload);
      return defaultResponseFormatter(results);
    }
  },

  delete_collection: {
    name: "delete_collection",
    description: "Delete a collection",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Collection ID to delete" },
      },
      required: ["id"],
    },
    validate: (args) => {
      if (!args.id) {
        throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
      }
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;
      await client.deleteCollection(id);
      return defaultResponseFormatter({ success: true });
    }
  },

  get_collection_items: {
    name: "get_collection_items",
    description: "Get all items in a collection",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Collection ID to get items from" },
      },
      required: ["id"],
    },
    validate: (args) => {
      if (!args.id) {
        throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
      }
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;
      const results = await client.apiCall("GET", `/api/collection/${id}/items`);
      return defaultResponseFormatter(results);
    }
  },

  move_to_collection: {
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
    validate: (args) => {
      if (!args.item_type || !args.item_id || args.collection_id === undefined) {
        throw new McpError(ErrorCode.InvalidParams, "item_type, item_id, and collection_id are required");
      }
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { item_type, item_id, collection_id } = args;
      
      const payload = { collection_id };
      const results = await client.apiCall("PUT", `/api/${item_type}/${item_id}`, payload);
      return defaultResponseFormatter(results);
    }
  },

  // Activity/Recent tools
  get_most_recently_viewed_dashboard: {
    name: "get_most_recently_viewed_dashboard",
    description: "Get the most recently viewed dashboard",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: MetabaseClient, args: any) => {
      const results = await client.apiCall("GET", "/api/activity/most_recently_viewed_dashboard");
      return defaultResponseFormatter(results);
    }
  },

  get_popular_items: {
    name: "get_popular_items",
    description: "Get popular items in Metabase",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: MetabaseClient, args: any) => {
      const results = await client.apiCall("GET", "/api/activity/popular_items");
      return defaultResponseFormatter(results);
    }
  },

  get_recent_views: {
    name: "get_recent_views",
    description: "Get recent views activity",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client: MetabaseClient, args: any) => {
      const results = await client.apiCall("GET", "/api/activity/recent_views");
      return defaultResponseFormatter(results);
    }
  },

  get_recents: {
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
    handler: async (client: MetabaseClient, args: any) => {
      const queryParams = new URLSearchParams();
      if (args.context) {
        args.context.forEach((ctx: string) => queryParams.append('context', ctx));
      }
      if (args.include_metadata !== undefined) {
        queryParams.append('include_metadata', args.include_metadata.toString());
      }
      
      const url = `/api/activity/recents?${queryParams.toString()}`;
      const results = await client.apiCall("GET", url);
      return defaultResponseFormatter(results);
    }
  },

  post_recents: {
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
    validate: (args) => {
      if (!args.data) {
        throw new McpError(ErrorCode.InvalidParams, "Activity data is required");
      }
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { data } = args;
      const results = await client.apiCall("POST", "/api/activity/recents", data);
      return defaultResponseFormatter(results);
    }
  },

  // User tools
  list_users: {
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
    handler: async (client: MetabaseClient, args: any) => {
      const results = await client.getUsers(args.include_deactivated || false);
      return defaultResponseFormatter(results);
    }
  },

  // Search tools
  search_content: {
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
    validate: (args) => {
      if (!args.q) {
        throw new McpError(ErrorCode.InvalidParams, "Search query is required");
      }
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { q, ...otherParams } = args;

      const queryParams: any = { q };
      Object.entries(otherParams).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams[key] = value;
        }
      });

      const searchUrl = `/api/search?${new URLSearchParams(queryParams).toString()}`;
      const results = await client.apiCall("GET", searchUrl);
      return defaultResponseFormatter(results);
    }
  }
};
