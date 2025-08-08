/**
 * Card/Question-related tool handlers
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class CardToolHandlers {
  constructor(private client: MetabaseClient) {}

  getToolSchemas(): Tool[] {
    return [
      {
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
      },
      {
        name: "create_card",
        description: "Create a new Metabase question (card)",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the card" },
            dataset_query: {
              type: "object",
              description:
                "The query for the card (e.g., MBQL or native query)",
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
          required: [
            "name",
            "dataset_query",
            "display",
            "visualization_settings",
          ],
        },
      },
      {
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
            archived: {
              type: "boolean",
              description: "Set to true to archive the card",
            },
            cache_ttl: {
              type: "number",
              description: "Cache time-to-live in seconds",
              minimum: 1,
            },
            collection_id: {
              type: "number",
              description: "ID of the collection to move the card to",
              minimum: 1,
            },
            collection_position: {
              type: "number",
              description: "Position within the collection",
              minimum: 1,
            },
            collection_preview: {
              type: "boolean",
              description: "Whether this card is a collection preview",
            },
            dashboard_tab_id: {
              type: "number",
              description: "ID of the dashboard tab",
              minimum: 1,
            },
            dataset_query: {
              type: "object",
              description: "Query definition for the card",
            },
            embedding_params: {
              type: "object",
              description: "Embedding parameters map",
              additionalProperties: {
                type: "string",
                enum: ["disabled", "enabled", "locked"],
              },
            },
            enable_embedding: {
              type: "boolean",
              description: "Whether embedding is enabled for this card",
            },
            name: {
              type: "string",
              description: "Name of the card",
              minLength: 1,
            },
            result_metadata: {
              type: "array",
              description: "Metadata about query results",
            },
            visualization_settings: {
              type: "object",
              description: "Settings for the visualization",
            },
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
              minimum: 1,
            },
            description: {
              type: "string",
              description: "Description of the card",
            },
            display: {
              type: "string",
              description: "Display type for the card",
              minLength: 1,
            },
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
                  values_source_type: {
                    type: "string",
                    enum: ["static-list", "card", "null"],
                  },
                },
                required: ["id", "type"],
              },
            },
            type: {
              type: "string",
              description: "Type of the card",
              enum: ["question", "metric", "model"],
            },
          },
          required: ["card_id"],
        },
      },
      {
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
              description:
                "Set to true for hard delete, false (default) for archive",
              default: false,
            },
          },
          required: ["card_id"],
        },
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        name: "get_embeddable_cards",
        description: "Get all embeddable cards",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
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
      },
      {
        name: "get_public_cards",
        description: "Get all public cards",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
              items: {
                type: "number",
              },
            },
          },
          required: ["card_id"],
        },
      },
    ];
  }

  async handleTool(name: string, args: any): Promise<any> {
    switch (name) {
      case "list_cards":
        return await this.listCards(args);

      case "create_card":
        return await this.createCard(args);

      case "update_card":
        return await this.updateCard(args);

      case "delete_card":
        return await this.deleteCard(args);

      case "execute_card":
        return await this.executeCard(args);

      case "move_cards":
        return await this.moveCards(args);

      case "move_cards_to_collection":
        return await this.moveCardsToCollection(args);

      case "get_embeddable_cards":
        return await this.getEmbeddableCards();

      case "execute_pivot_card_query":
        return await this.executePivotCardQuery(args);

      case "get_public_cards":
        return await this.getPublicCards();

      case "get_card_param_values":
        return await this.getCardParamValues(args);

      case "search_card_param_values":
        return await this.searchCardParamValues(args);

      case "get_card_param_remapping":
        return await this.getCardParamRemapping(args);

      case "create_card_public_link":
        return await this.createCardPublicLink(args);

      case "delete_card_public_link":
        return await this.deleteCardPublicLink(args);

      case "execute_card_query_with_format":
        return await this.executeCardQueryWithFormat(args);

      case "copy_card":
        return await this.copyCard(args);

      case "get_card_dashboards":
        return await this.getCardDashboards(args);

      case "get_card_query_metadata":
        return await this.getCardQueryMetadata(args);

      case "get_card_series":
        return await this.getCardSeries(args);

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown card tool: ${name}`
        );
    }
  }

  private async listCards(args: any = {}): Promise<any> {
    const { f = "all", model_id } = args;

    if (model_id !== undefined && (model_id < 1 || !Number.isInteger(model_id))) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "model_id must be an integer greater than zero"
      );
    }

    const cards = await this.client.getCards({ f, model_id });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(cards, null, 2),
        },
      ],
    };
  }

  private async createCard(args: any): Promise<any> {
    const {
      name,
      dataset_query,
      display,
      visualization_settings,
      collection_id,
      description,
    } = args;

    if (!name || !dataset_query || !display || !visualization_settings) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Missing required fields: name, dataset_query, display, visualization_settings"
      );
    }

    const cardData: any = {
      name,
      dataset_query,
      display,
      visualization_settings,
    };
    if (collection_id !== undefined) cardData.collection_id = collection_id;
    if (description !== undefined) cardData.description = description;

    const card = await this.client.createCard(cardData);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(card, null, 2),
        },
      ],
    };
  }

  private async updateCard(args: any): Promise<any> {
    const { card_id, delete_old_dashcards, ...updateFields } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    if (Object.keys(updateFields).length === 0) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "No fields provided for update"
      );
    }

    const queryParams: any = {};
    if (delete_old_dashcards !== undefined) {
      queryParams.delete_old_dashcards = delete_old_dashcards;
    }

    const card = await this.client.updateCard(card_id, updateFields, queryParams);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(card, null, 2),
        },
      ],
    };
  }

  private async deleteCard(args: any): Promise<any> {
    const { card_id, hard_delete = false } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    await this.client.deleteCard(card_id, hard_delete);

    return {
      content: [
        {
          type: "text",
          text: hard_delete
            ? `Card ${card_id} permanently deleted.`
            : `Card ${card_id} archived.`,
        },
      ],
    };
  }

  private async executeCard(args: any): Promise<any> {
    const { card_id, ignore_cache = false, collection_preview, dashboard_id } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    const result = await this.client.executeCard(card_id, {
      ignore_cache,
      collection_preview,
      dashboard_id,
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

  private async moveCards(args: any): Promise<any> {
    const { card_ids, collection_id, dashboard_id } = args;

    if (!card_ids || !Array.isArray(card_ids) || card_ids.length === 0) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "card_ids is required and must be a non-empty array"
      );
    }

    if (!collection_id && !dashboard_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Either collection_id or dashboard_id must be provided"
      );
    }

    if (collection_id && dashboard_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Cannot specify both collection_id and dashboard_id"
      );
    }

    const result = await this.client.moveCards(card_ids, collection_id, dashboard_id);
    return {
      content: [
        {
          type: "text",
          text: `Successfully moved ${card_ids.length} card(s) to ${
            collection_id ? `collection ${collection_id}` : `dashboard ${dashboard_id}`
          }. Result: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  private async moveCardsToCollection(args: any): Promise<any> {
    const { card_ids, collection_id } = args;

    if (!card_ids || !Array.isArray(card_ids) || card_ids.length === 0) {
      throw new McpError(ErrorCode.InvalidParams, "Card IDs array is required and must not be empty");
    }

    const result = await this.client.moveCardsToCollection(card_ids, collection_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getEmbeddableCards(): Promise<any> {
    const cards = await this.client.getEmbeddableCards();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(cards, null, 2),
        },
      ],
    };
  }

  private async executePivotCardQuery(args: any): Promise<any> {
    const { card_id, parameters = {} } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    const result = await this.client.executePivotCardQuery(card_id, parameters);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getPublicCards(): Promise<any> {
    const cards = await this.client.getPublicCards();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(cards, null, 2),
        },
      ],
    };
  }

  private async getCardParamValues(args: any): Promise<any> {
    const { card_id, param_key } = args;

    if (!card_id || !param_key) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Card ID and parameter key are required"
      );
    }

    const values = await this.client.getCardParamValues(card_id, param_key);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(values, null, 2),
        },
      ],
    };
  }

  private async searchCardParamValues(args: any): Promise<any> {
    const { card_id, param_key, query } = args;

    if (!card_id || !param_key || !query) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Card ID, parameter key, and query are required"
      );
    }

    const values = await this.client.searchCardParamValues(card_id, param_key, query);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(values, null, 2),
        },
      ],
    };
  }

  private async getCardParamRemapping(args: any): Promise<any> {
    const { card_id, param_key, value } = args;

    if (!card_id || !param_key || !value) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Card ID, parameter key, and value are required"
      );
    }

    const remapping = await this.client.getCardParamRemapping(card_id, param_key, value);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(remapping, null, 2),
        },
      ],
    };
  }

  private async createCardPublicLink(args: any): Promise<any> {
    const { card_id } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    const link = await this.client.createCardPublicLink(card_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(link, null, 2),
        },
      ],
    };
  }

  private async deleteCardPublicLink(args: any): Promise<any> {
    const { card_id } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    await this.client.deleteCardPublicLink(card_id);
    return {
      content: [
        {
          type: "text",
          text: `Public link for card ${card_id} deleted successfully.`,
        },
      ],
    };
  }

  private async executeCardQueryWithFormat(args: any): Promise<any> {
    const { card_id, export_format, parameters = {} } = args;

    if (!card_id || !export_format) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Card ID and export format are required"
      );
    }

    const result = await this.client.executeCardQueryWithFormat(card_id, export_format, parameters);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async copyCard(args: any): Promise<any> {
    const { card_id } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    const card = await this.client.copyCard(card_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(card, null, 2),
        },
      ],
    };
  }

  private async getCardDashboards(args: any): Promise<any> {
    const { card_id } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    const dashboards = await this.client.getCardDashboards(card_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(dashboards, null, 2),
        },
      ],
    };
  }

  private async getCardQueryMetadata(args: any): Promise<any> {
    const { card_id } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    const metadata = await this.client.getCardQueryMetadata(card_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(metadata, null, 2),
        },
      ],
    };
  }

  private async getCardSeries(args: any): Promise<any> {
    const { card_id, last_cursor, query, exclude_ids } = args;

    if (!card_id) {
      throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
    }

    const series = await this.client.getCardSeries(card_id, {
      last_cursor,
      query,
      exclude_ids,
    });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(series, null, 2),
        },
      ],
    };
  }
}
