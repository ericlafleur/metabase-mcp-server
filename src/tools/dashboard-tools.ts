/**
 * Dashboard tools configuration
 */

import { ToolConfig, defaultResponseFormatter } from "../types/tool-config.js";
import { ErrorCode, McpError } from "../types/errors.js";

export const dashboardTools: Record<string, ToolConfig> = {
  list_dashboards: {
    name: "list_dashboards",
    description: "List all dashboards in Metabase",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client, args) => {
      const dashboards = await client.getDashboards();
      return defaultResponseFormatter(dashboards);
    }
  },

  create_dashboard: {
    name: "create_dashboard",
    description: "Create a new Metabase dashboard",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the dashboard" },
        description: {
          type: "string",
          description: "Optional description for the dashboard",
        },
        parameters: {
          type: "array",
          description: "Optional parameters for the dashboard",
          items: { type: "object" },
        },
        collection_id: {
          type: "number",
          description: "Optional ID of the collection to save the dashboard in",
        },
      },
      required: ["name"],
    },
    validate: (args) => {
      if (!args.name) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard name is required");
      }
    },
    handler: async (client, args) => {
      const dashboardData: any = { name: args.name };
      if (args.description !== undefined) dashboardData.description = args.description;
      if (args.parameters !== undefined) dashboardData.parameters = args.parameters;
      if (args.collection_id !== undefined) dashboardData.collection_id = args.collection_id;

      const dashboard = await client.createDashboard(dashboardData);
      return defaultResponseFormatter(dashboard);
    }
  },

  get_dashboard: {
    name: "get_dashboard",
    description: "Get a specific dashboard by ID",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      const dashboard = await client.getDashboard(args.dashboard_id);
      return defaultResponseFormatter(dashboard);
    }
  },

  delete_dashboard: {
    name: "delete_dashboard",
    description: "Delete a Metabase dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard to delete",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      await client.deleteDashboard(args.dashboard_id);
      return defaultResponseFormatter({ message: `Dashboard ${args.dashboard_id} deleted successfully` });
    }
  },

  get_dashboard_cards: {
    name: "get_dashboard_cards",
    description: "Get all cards in a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      const cards = await client.apiCall("GET", `/api/dashboard/${args.dashboard_id}/cards`);
      return defaultResponseFormatter(cards);
    }
  },

  update_dashboard: {
    name: "update_dashboard",
    description: "Update an existing Metabase dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard to update",
        },
        name: { type: "string", description: "New name for the dashboard" },
        description: {
          type: "string",
          description: "New description for the dashboard",
        },
        parameters: {
          type: "array",
          description: "New parameters for the dashboard",
          items: { type: "object" },
        },
        collection_id: {
          type: "number",
          description: "New collection ID for the dashboard",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      const { dashboard_id, ...updateData } = args;
      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );
      const dashboard = await client.apiCall("PUT", `/api/dashboard/${dashboard_id}`, filteredData);
      return defaultResponseFormatter(dashboard);
    }
  },

  remove_card_from_dashboard: {
    name: "remove_card_from_dashboard",
    description: "Remove a card from a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
        card_id: {
          type: "number",
          description: "ID of the card to remove",
        },
      },
      required: ["dashboard_id", "card_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id || !args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID and Card ID are required");
      }
    },
    handler: async (client, args) => {
      await client.apiCall("DELETE", `/api/dashboard/${args.dashboard_id}/cards`, { cardId: args.card_id });
      return defaultResponseFormatter({ message: `Card ${args.card_id} removed from dashboard ${args.dashboard_id}` });
    }
  },

  update_dashboard_card: {
    name: "update_dashboard_card",
    description: "Update card position, size, and settings on a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
        card_id: {
          type: "number",
          description: "ID of the card",
        },
        col: { type: "number", description: "Column position" },
        row: { type: "number", description: "Row position" },
        size_x: { type: "number", description: "Width in grid units" },
        size_y: { type: "number", description: "Height in grid units" },
        parameter_mappings: {
          type: "array",
          description: "Parameter mappings",
          items: { type: "object" },
        },
        visualization_settings: {
          type: "object",
          description: "Visualization settings",
        },
      },
      required: ["dashboard_id", "card_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id || !args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID and Card ID are required");
      }
    },
    handler: async (client, args) => {
      const { dashboard_id, card_id, ...updateData } = args;
      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );
      const result = await client.apiCall("PUT", `/api/dashboard/${dashboard_id}/cards/${card_id}`, filteredData);
      return defaultResponseFormatter(result);
    }
  },

  post_dashboard_query: {
    name: "post_dashboard_query",
    description: "Execute a query for a dashboard card",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
        card_id: {
          type: "number",
          description: "ID of the card",
        },
        parameters: {
          type: "object",
          description: "Query parameters",
        },
      },
      required: ["dashboard_id", "card_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id || !args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID and Card ID are required");
      }
    },
    handler: async (client, args) => {
      const { dashboard_id, card_id, parameters = {} } = args;
      const result = await client.apiCall("POST", `/api/dashboard/${dashboard_id}/card/${card_id}/query`, { parameters });
      return defaultResponseFormatter(result);
    }
  },

  post_dashboard_copy: {
    name: "post_dashboard_copy",
    description: "Copy a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard to copy from",
        },
        name: {
          type: "string",
          description: "Name for the new dashboard",
        },
        collection_id: {
          type: "number",
          description: "Collection ID for the new dashboard",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      const { dashboard_id, ...copyData } = args;
      const filteredData = Object.fromEntries(
        Object.entries(copyData).filter(([_, value]) => value !== undefined)
      );
      const result = await client.apiCall("POST", `/api/dashboard/${dashboard_id}/copy`, filteredData);
      return defaultResponseFormatter(result);
    }
  },

  put_dashboard_cards: {
    name: "put_dashboard_cards",
    description: "Update all cards in a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
        cards: {
          type: "array",
          description: "Array of card configurations",
          items: { type: "object" },
        },
      },
      required: ["dashboard_id", "cards"],
    },
    validate: (args) => {
      if (!args.dashboard_id || !args.cards) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID and cards array are required");
      }
    },
    handler: async (client, args) => {
      const result = await client.apiCall("PUT", `/api/dashboard/${args.dashboard_id}/cards`, { cards: args.cards });
      return defaultResponseFormatter(result);
    }
  },

  get_dashboard_items: {
    name: "get_dashboard_items",
    description: "Get all items in a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      const items = await client.apiCall("GET", `/api/dashboard/${args.dashboard_id}/items`);
      return defaultResponseFormatter(items);
    }
  },

  post_dashboard_public_link: {
    name: "post_dashboard_public_link",
    description: "Create a public link for a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      const result = await client.apiCall("POST", `/api/dashboard/${args.dashboard_id}/public_link`);
      return defaultResponseFormatter(result);
    }
  },

  delete_dashboard_public_link: {
    name: "delete_dashboard_public_link",
    description: "Delete a public link for a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      await client.apiCall("DELETE", `/api/dashboard/${args.dashboard_id}/public_link`);
      return defaultResponseFormatter({ message: `Public link for dashboard ${args.dashboard_id} deleted` });
    }
  },

  get_dashboard_embeddable: {
    name: "get_dashboard_embeddable",
    description: "Get embeddable dashboards",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client, args) => {
      const result = await client.apiCall("GET", "/api/dashboard/embeddable");
      return defaultResponseFormatter(result);
    }
  },

  get_dashboard_params_valid_filter_fields: {
    name: "get_dashboard_params_valid_filter_fields",
    description: "Get valid filter fields for dashboard parameters",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
        parameter_id: {
          type: "string",
          description: "ID of the parameter",
        },
      },
      required: ["dashboard_id", "parameter_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id || !args.parameter_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID and Parameter ID are required");
      }
    },
    handler: async (client, args) => {
      const result = await client.apiCall("GET", `/api/dashboard/${args.dashboard_id}/params/${args.parameter_id}/valid-filter-fields`);
      return defaultResponseFormatter(result);
    }
  },

  get_dashboard_public: {
    name: "get_dashboard_public",
    description: "Get public dashboards",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client, args) => {
      const result = await client.apiCall("GET", "/api/dashboard/public");
      return defaultResponseFormatter(result);
    }
  },

  post_dashboard_save: {
    name: "post_dashboard_save",
    description: "Save a denormalized description of dashboard",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Optional name of the dashboard"
        },
        description: {
          type: "string",
          description: "Optional description of the dashboard"
        },
        parameters: {
          type: "array",
          description: "Dashboard parameters",
          items: { type: "object" }
        },
        cards: {
          type: "array",
          description: "Dashboard cards",
          items: { type: "object" }
        },
      },
    },
    handler: async (client, args) => {
      const result = await client.apiCall("POST", "/api/dashboard/save", args);
      return defaultResponseFormatter(result);
    }
  },

  post_dashboard_query_export: {
    name: "post_dashboard_query_export",
    description: "Run the query associated with a Saved Question (Card) in the context of a Dashboard that includes it, and return its results as a file in the specified format",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
        card_id: {
          type: "number",
          description: "ID of the card",
        },
        export_format: {
          type: "string",
          description: "Export format (csv, json, xlsx, etc.)",
        },
        parameters: {
          type: "object",
          description: "Query parameters",
        },
      },
      required: ["dashboard_id", "card_id", "export_format"],
    },
    validate: (args) => {
      if (!args.dashboard_id || !args.card_id || !args.export_format) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID, Card ID, and export format are required");
      }
    },
    handler: async (client, args) => {
      const { dashboard_id, card_id, export_format, parameters = {} } = args;
      const result = await client.apiCall("POST", `/api/dashboard/${dashboard_id}/card/${card_id}/query/${export_format}`, { parameters });
      return defaultResponseFormatter(result);
    }
  },

  get_dashboard_param_remapping: {
    name: "get_dashboard_param_remapping",
    description: "Fetch the remapped value for a given value of the parameter with ID :param-key",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
        param_key: {
          type: "string",
          description: "Parameter key",
        },
        value: {
          type: "string",
          description: "Value to remap",
        },
      },
      required: ["dashboard_id", "param_key", "value"],
    },
    validate: (args) => {
      if (!args.dashboard_id || !args.param_key || !args.value) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID, parameter key, and value are required");
      }
    },
    handler: async (client, args) => {
      const result = await client.apiCall("GET", `/api/dashboard/${args.dashboard_id}/params/${args.param_key}/remapping/${args.value}`);
      return defaultResponseFormatter(result);
    }
  },

  get_dashboard_param_search: {
    name: "get_dashboard_param_search",
    description: "Fetch possible values of the parameter whose ID is :param-key that contain :query. Optionally restrict values by passing query parameters like other-parameter=value",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
        param_key: {
          type: "string",
          description: "Parameter key",
        },
        query: {
          type: "string",
          description: "Search query",
        },
      },
      required: ["dashboard_id", "param_key", "query"],
    },
    validate: (args) => {
      if (!args.dashboard_id || !args.param_key || !args.query) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID, parameter key, and query are required");
      }
    },
    handler: async (client, args) => {
      const result = await client.apiCall("GET", `/api/dashboard/${args.dashboard_id}/params/${args.param_key}/search/${args.query}`);
      return defaultResponseFormatter(result);
    }
  },

  get_dashboard_param_values: {
    name: "get_dashboard_param_values",
    description: "Fetch possible values of the parameter whose ID is :param-key. Optionally restrict values by passing query parameters like other-parameter=value",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
        param_key: {
          type: "string",
          description: "Parameter key",
        },
      },
      required: ["dashboard_id", "param_key"],
    },
    validate: (args) => {
      if (!args.dashboard_id || !args.param_key) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID and parameter key are required");
      }
    },
    handler: async (client, args) => {
      const result = await client.apiCall("GET", `/api/dashboard/${args.dashboard_id}/params/${args.param_key}/values`);
      return defaultResponseFormatter(result);
    }
  },

  get_dashboard_query_metadata: {
    name: "get_dashboard_query_metadata",
    description: "Get query metadata for a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      const result = await client.apiCall("GET", `/api/dashboard/${args.dashboard_id}/query_metadata`);
      return defaultResponseFormatter(result);
    }
  },

  get_dashboard_related: {
    name: "get_dashboard_related",
    description: "Get related items for a dashboard",
    inputSchema: {
      type: "object",
      properties: {
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard",
        },
      },
      required: ["dashboard_id"],
    },
    validate: (args) => {
      if (!args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
      }
    },
    handler: async (client, args) => {
      const result = await client.apiCall("GET", `/api/dashboard/${args.dashboard_id}/related`);
      return defaultResponseFormatter(result);
    }
  }
};
