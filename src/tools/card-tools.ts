import { ToolConfig, defaultResponseFormatter } from "../types/tool-config.js";
import { ErrorCode, McpError } from "../types/errors.js";

export const cardTools: Record<string, ToolConfig> = {
  list_cards: {
    name: "list_cards",
    description: "Get all the Cards. Option filter param f can be used to change the set of Cards that are returned",
    inputSchema: {
      type: "object",
      properties: {
        f: {
          type: "string",
          enum: ["archived", "table", "using_model", "bookmarked", "using_segment", "all", "mine", "database"],
          default: "all",
          description: "Filter parameter to change the set of Cards returned"
        },
        model_id: {
          type: "integer",
          minimum: 1,
          description: "Optional model ID - value must be an integer greater than zero"
        }
      },
      required: []
    },
    validate: (args) => {
      if (args.model_id !== undefined && (args.model_id < 1 || !Number.isInteger(args.model_id))) {
        throw new McpError(ErrorCode.InvalidParams, "model_id must be an integer greater than zero");
      }
    },
    handler: async (client, args) => {
      const { f = "all", model_id } = args;
      const cards = await client.getCards({ f, model_id });
      return defaultResponseFormatter(cards);
    }
  },

  create_card: {
    name: "create_card",
    description: "Create a new Metabase question (card)",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the card" },
        dataset_query: {
          type: "object",
          description: "The query for the card (e.g., MBQL or native query)",
        },
        display: {
          type: "string",
          description: "Display type (e.g., 'table', 'line', 'bar')",
        },
        visualization_settings: {
          type: "object",
          description: "Settings for the visualization",
        },
        collection_id: {
          type: "number",
          description: "Optional ID of the collection to save the card in",
        },
        description: {
          type: "string",
          description: "Optional description for the card",
        },
      },
      required: ["name", "dataset_query", "display", "visualization_settings"],
    },
    validate: (args) => {
      if (!args.name || !args.dataset_query || !args.display || !args.visualization_settings) {
        throw new McpError(ErrorCode.InvalidParams, "Missing required fields: name, dataset_query, display, visualization_settings");
      }
    },
    handler: async (client, args) => {
      const { name, dataset_query, display, visualization_settings, collection_id, description } = args;
      const cardData: any = { name, dataset_query, display, visualization_settings };
      if (collection_id !== undefined) cardData.collection_id = collection_id;
      if (description !== undefined) cardData.description = description;
      
      const card = await client.createCard(cardData);
      return defaultResponseFormatter(card);
    }
  },

  update_card: {
    name: "update_card",
    description: "Update an existing Metabase question (card)",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card to update",
          minimum: 1,
        },
        delete_old_dashcards: {
          type: "boolean",
          description: "Query parameter to delete old dashboard cards",
        },
        archived: { type: "boolean", description: "Set to true to archive the card" },
        cache_ttl: { type: "number", description: "Cache time-to-live in seconds", minimum: 1 },
        collection_id: { type: "number", description: "ID of the collection to move the card to", minimum: 1 },
        collection_position: { type: "number", description: "Position within the collection", minimum: 1 },
        collection_preview: { type: "boolean", description: "Whether this card is a collection preview" },
        dashboard_tab_id: { type: "number", description: "ID of the dashboard tab", minimum: 1 },
        dataset_query: { type: "object", description: "Query definition for the card" },
        embedding_params: {
          type: "object",
          description: "Embedding parameters map",
          additionalProperties: { type: "string", enum: ["disabled", "enabled", "locked"] },
        },
        enable_embedding: { type: "boolean", description: "Whether embedding is enabled for this card" },
        name: { type: "string", description: "Name of the card", minLength: 1 },
        result_metadata: { type: "array", description: "Metadata about query results" },
        visualization_settings: { type: "object", description: "Settings for the visualization" },
        dashboard_id: { type: "number", description: "ID of the dashboard", minimum: 1 },
        description: { type: "string", description: "Description of the card" },
        display: { type: "string", description: "Display type for the card", minLength: 1 },
        parameters: {
          type: "array",
          description: "Parameters for the card",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              type: { type: "string", minLength: 1 },
              default: {},
              mappings: {},
              name: { type: "string" },
              sectionId: { type: "string" },
              slug: { type: "string" },
              temporal_units: { type: "array" },
              values_source_config: { type: "object" },
              values_source_type: { type: "string", enum: ["static-list", "card", "null"] },
            },
            required: ["id", "type"],
          },
        },
        type: { type: "string", description: "Type of the card", enum: ["question", "metric", "model"] },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
      const { card_id, delete_old_dashcards, ...updateFields } = args;
      if (Object.keys(updateFields).length === 0) {
        throw new McpError(ErrorCode.InvalidParams, "No fields provided for update");
      }
    },
    handler: async (client, args) => {
      const { card_id, delete_old_dashcards, ...updateFields } = args;
      const queryParams: any = {};
      if (delete_old_dashcards !== undefined) {
        queryParams.delete_old_dashcards = delete_old_dashcards;
      }
      const card = await client.updateCard(card_id, updateFields, queryParams);
      return defaultResponseFormatter(card);
    }
  },

  delete_card: {
    name: "delete_card",
    description: "Delete a Metabase question (card)",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card to delete",
        },
        hard_delete: {
          type: "boolean",
          description: "Set to true for hard delete, false (default) for archive",
          default: false,
        },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
    },
    handler: async (client, args) => {
      const { card_id, hard_delete = false } = args;
      await client.deleteCard(card_id, hard_delete);
      const message = hard_delete ? `Card ${card_id} permanently deleted.` : `Card ${card_id} archived.`;
      return defaultResponseFormatter({ message });
    }
  },

  execute_card: {
    name: "execute_card",
    description: "Execute a Metabase question/card and get results",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card/question to execute",
        },
        ignore_cache: {
          type: "boolean",
          description: "Ignore cached results",
          default: false,
        },
        collection_preview: {
          type: "boolean",
          description: "Preview mode for collection",
        },
        dashboard_id: {
          type: "number",
          description: "Dashboard ID if executing from dashboard context",
        },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
    },
    handler: async (client, args) => {
      const { card_id, ignore_cache = false, collection_preview, dashboard_id } = args;
      const result = await client.executeCard(card_id, { ignore_cache, collection_preview, dashboard_id });
      return defaultResponseFormatter(result);
    }
  },

  move_cards: {
    name: "move_cards",
    description: "Move multiple cards to a collection or dashboard",
    inputSchema: {
      type: "object",
      properties: {
        card_ids: {
          type: "array",
          items: { type: "number" },
          description: "Array of card IDs to move",
        },
        collection_id: {
          type: "number",
          description: "ID of the collection to move cards to (optional if dashboard_id is provided)",
        },
        dashboard_id: {
          type: "number",
          description: "ID of the dashboard to move cards to (optional if collection_id is provided)",
        },
      },
      required: ["card_ids"],
    },
    validate: (args) => {
      if (!args.card_ids || !Array.isArray(args.card_ids) || args.card_ids.length === 0) {
        throw new McpError(ErrorCode.InvalidParams, "card_ids is required and must be a non-empty array");
      }
      if (!args.collection_id && !args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Either collection_id or dashboard_id must be provided");
      }
      if (args.collection_id && args.dashboard_id) {
        throw new McpError(ErrorCode.InvalidParams, "Cannot specify both collection_id and dashboard_id");
      }
    },
    handler: async (client, args) => {
      const { card_ids, collection_id, dashboard_id } = args;
      const result = await client.moveCards(card_ids, collection_id, dashboard_id);
      const message = `Successfully moved ${card_ids.length} card(s) to ${collection_id ? `collection ${collection_id}` : `dashboard ${dashboard_id}`}`;
      return defaultResponseFormatter({ message, result });
    }
  },

  move_cards_to_collection: {
    name: "move_cards_to_collection",
    description: "Bulk update endpoint for Card Collections. Move a set of Cards into a Collection or remove them from Collections",
    inputSchema: {
      type: "object",
      properties: {
        card_ids: {
          type: "array",
          items: { type: "number" },
          description: "Array of card IDs to move",
        },
        collection_id: {
          type: "number",
          description: "ID of the collection to move cards to (null to remove from collections)",
        },
      },
      required: ["card_ids"],
    },
    validate: (args) => {
      if (!args.card_ids || !Array.isArray(args.card_ids) || args.card_ids.length === 0) {
        throw new McpError(ErrorCode.InvalidParams, "Card IDs array is required and must not be empty");
      }
    },
    handler: async (client, args) => {
      const { card_ids, collection_id } = args;
      const result = await client.moveCardsToCollection(card_ids, collection_id);
      return defaultResponseFormatter(result);
    }
  },

  get_embeddable_cards: {
    name: "get_embeddable_cards",
    description: "Get all embeddable cards",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client, args) => {
      const cards = await client.getEmbeddableCards();
      return defaultResponseFormatter(cards);
    }
  },

  execute_pivot_card_query: {
    name: "execute_pivot_card_query",
    description: "Execute a pivot query for a card",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card to execute pivot query for",
        },
        parameters: {
          type: "object",
          description: "Optional parameters for the query",
        },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
    },
    handler: async (client, args) => {
      const { card_id, parameters = {} } = args;
      const result = await client.executePivotCardQuery(card_id, parameters);
      return defaultResponseFormatter(result);
    }
  },

  get_public_cards: {
    name: "get_public_cards",
    description: "Get all public cards",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: async (client, args) => {
      const cards = await client.getPublicCards();
      return defaultResponseFormatter(cards);
    }
  },

  get_card_param_values: {
    name: "get_card_param_values",
    description: "Get values for a card parameter",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card",
        },
        param_key: {
          type: "string",
          description: "Parameter key",
        },
      },
      required: ["card_id", "param_key"],
    },
    validate: (args) => {
      if (!args.card_id || !args.param_key) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID and parameter key are required");
      }
    },
    handler: async (client, args) => {
      const { card_id, param_key } = args;
      const values = await client.getCardParamValues(card_id, param_key);
      return defaultResponseFormatter(values);
    }
  },

  search_card_param_values: {
    name: "search_card_param_values",
    description: "Search values for a card parameter",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card",
          minimum: 1,
        },
        param_key: {
          type: "string",
          description: "Parameter key",
          minLength: 1,
        },
        query: {
          type: "string",
          description: "Search query",
          minLength: 1,
        },
      },
      required: ["card_id", "param_key", "query"],
    },
    validate: (args) => {
      if (!args.card_id || !args.param_key || !args.query) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID, parameter key, and query are required");
      }
    },
    handler: async (client, args) => {
      const { card_id, param_key, query } = args;
      const values = await client.searchCardParamValues(card_id, param_key, query);
      return defaultResponseFormatter(values);
    }
  },

  get_card_param_remapping: {
    name: "get_card_param_remapping",
    description: "Get parameter remapping for a card",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card",
          minimum: 1,
        },
        param_key: {
          type: "string",
          description: "Parameter key",
          minLength: 1,
        },
        value: {
          type: "string",
          description: "Value to get remapping for",
          minLength: 1,
        },
      },
      required: ["card_id", "param_key", "value"],
    },
    validate: (args) => {
      if (!args.card_id || !args.param_key || !args.value) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID, parameter key, and value are required");
      }
    },
    handler: async (client, args) => {
      const { card_id, param_key, value } = args;
      const remapping = await client.getCardParamRemapping(card_id, param_key, value);
      return defaultResponseFormatter(remapping);
    }
  },

  create_card_public_link: {
    name: "create_card_public_link",
    description: "Create a public link for a card",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card",
        },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
    },
    handler: async (client, args) => {
      const { card_id } = args;
      const link = await client.createCardPublicLink(card_id);
      return defaultResponseFormatter(link);
    }
  },

  delete_card_public_link: {
    name: "delete_card_public_link",
    description: "Delete a public link for a card",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card",
        },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
    },
    handler: async (client, args) => {
      const { card_id } = args;
      await client.deleteCardPublicLink(card_id);
      return defaultResponseFormatter({ message: `Public link for card ${card_id} deleted successfully.` });
    }
  },

  execute_card_query_with_format: {
    name: "execute_card_query_with_format",
    description: "Execute a card query with a specific export format",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card to execute",
        },
        export_format: {
          type: "string",
          description: "Export format (e.g., 'csv', 'json', 'xlsx')",
        },
        parameters: {
          type: "object",
          description: "Optional parameters for the query",
        },
      },
      required: ["card_id", "export_format"],
    },
    validate: (args) => {
      if (!args.card_id || !args.export_format) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID and export format are required");
      }
    },
    handler: async (client, args) => {
      const { card_id, export_format, parameters = {} } = args;
      const result = await client.executeCardQueryWithFormat(card_id, export_format, parameters);
      return defaultResponseFormatter(result);
    }
  },

  copy_card: {
    name: "copy_card",
    description: "Create a copy of a card",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card to copy",
        },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
    },
    handler: async (client, args) => {
      const { card_id } = args;
      const card = await client.copyCard(card_id);
      return defaultResponseFormatter(card);
    }
  },

  get_card_dashboards: {
    name: "get_card_dashboards",
    description: "Get all dashboards containing a card",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card",
        },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
    },
    handler: async (client, args) => {
      const { card_id } = args;
      const dashboards = await client.getCardDashboards(card_id);
      return defaultResponseFormatter(dashboards);
    }
  },

  get_card_query_metadata: {
    name: "get_card_query_metadata",
    description: "Get query metadata for a card",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card",
          minimum: 1,
        },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
    },
    handler: async (client, args) => {
      const { card_id } = args;
      const metadata = await client.getCardQueryMetadata(card_id);
      return defaultResponseFormatter(metadata);
    }
  },

  get_card_series: {
    name: "get_card_series",
    description: "Get series data for a card with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card",
          minimum: 1,
        },
        last_cursor: {
          type: "number",
          description: "ID of the last card from the previous page to fetch the next page",
          minimum: 1,
        },
        query: {
          type: "string",
          description: "Search card by name",
          minLength: 1,
        },
        exclude_ids: {
          type: "array",
          description: "Filter out a list of card IDs",
          items: { type: "number" },
        },
      },
      required: ["card_id"],
    },
    validate: (args) => {
      if (!args.card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
    },
    handler: async (client, args) => {
      const { card_id, last_cursor, query, exclude_ids } = args;
      const series = await client.getCardSeries(card_id, { last_cursor, query, exclude_ids });
      return defaultResponseFormatter(series);
    }
  }
};
