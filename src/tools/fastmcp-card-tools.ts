import { z } from "zod";
import { MetabaseClient } from "../client/metabase-client.js";

export function addCardTools(server: any, metabaseClient: MetabaseClient) {
  // GET /api/card - List cards
  server.addTool({
    name: "list_cards",
    description: "List cards with optional filters",
    parameters: z.object({
      f: z.string().optional().describe("Filter by source (e.g., 'models')"),
      model_id: z.number().optional().describe("Filter by model_id"),
    }),
    execute: async (args: { f?: string; model_id?: number } = {}) => {
      try {
        const cards = await metabaseClient.getCards(args);
        return JSON.stringify(cards, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to list cards: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
  });

  // GET /api/card/{id} - Get card
  server.addTool({
    name: "get_card",
    description: "Get a card by ID",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
    }),
    execute: async (args: { card_id: number }) => {
      try {
        const card = await metabaseClient.getCard(args.card_id);
        return JSON.stringify(card, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get card ${args.card_id}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
  });

  // POST /api/card - Create card
  server.addTool({
    name: "create_card",
    description: "Create a new card (question)",
    parameters: z
      .object({
        name: z.string().describe("Card name"),
        description: z.string().optional().describe("Description"),
        dataset_query: z.object({}).optional().describe("Dataset query object"),
        display: z.string().optional().describe("Visualization type"),
        visualization_settings: z
          .object({})
          .optional()
          .describe("Visualization settings"),
        collection_id: z.number().optional().describe("Collection to save in"),
      })
      .passthrough(),
    execute: async (args: any) => {
      try {
        const card = await metabaseClient.createCard(args);
        return JSON.stringify(card, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to create card: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
  });

  // PUT /api/card/{id} - Update card
  server.addTool({
    name: "update_card",
    description: "Update an existing card",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
      updates: z.object({}).describe("Fields to update"),
      query_params: z
        .object({})
        .optional()
        .describe("Optional query parameters for update"),
    }),
    execute: async (args: {
      card_id: number;
      updates: any;
      query_params?: any;
    }) => {
      try {
        const card = await metabaseClient.updateCard(
          args.card_id,
          args.updates,
          args.query_params
        );
        return JSON.stringify(card, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to update card ${args.card_id}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
  });

  // DELETE /api/card/{id} - Delete/archive card
  server.addTool({
    name: "delete_card",
    description: "Delete (hard) or archive (soft) a card",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
      hard_delete: z
        .boolean()
        .optional()
        .default(false)
        .describe("Hard delete if true, else archive"),
    }),
    execute: async (args: { card_id: number; hard_delete?: boolean }) => {
      try {
        await metabaseClient.deleteCard(args.card_id, args.hard_delete || false);
        return JSON.stringify(
          {
            card_id: args.card_id,
            action: args.hard_delete ? "deleted" : "archived",
            status: "success",
          },
          null,
          2
        );
      } catch (error) {
        throw new Error(
          `Failed to delete card ${args.card_id}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
  });

  // POST /api/card/{id}/query - Execute card
  server.addTool({
    name: "execute_card",
    description: "Execute a card and return results",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
      ignore_cache: z.boolean().optional().describe("Ignore cached results"),
      collection_preview: z
        .boolean()
        .optional()
        .describe("Collection preview flag"),
      dashboard_id: z
        .number()
        .optional()
        .describe("Execute within a dashboard context"),
    }),
    execute: async (args: {
      card_id: number;
      ignore_cache?: boolean;
      collection_preview?: boolean;
      dashboard_id?: number;
    }) => {
      try {
        const result = await metabaseClient.executeCard(args.card_id, {
          ignore_cache: args.ignore_cache,
          collection_preview: args.collection_preview,
          dashboard_id: args.dashboard_id,
        });
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to execute card ${args.card_id}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
  });

  // POST /api/card/{id}/query/{export-format} - Execute & export
  server.addTool({
    name: "export_card_result",
    description: "Execute a card and export results in the specified format",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
      export_format: z.string().describe("Export format (e.g., csv, xlsx, json)"),
      parameters: z.object({}).optional().describe("Execution parameters"),
    }),
    execute: async (args: {
      card_id: number;
      export_format: string;
      parameters?: any;
    }) => {
      try {
        const result = await metabaseClient.executeCardQueryWithFormat(
          args.card_id,
          args.export_format,
          args.parameters || {}
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to export card ${args.card_id} as ${
            args.export_format
          }: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
  });

  // POST /api/card/{id}/copy - Copy card
  server.addTool({
    name: "copy_card",
    description: "Copy a card",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
    }),
    execute: async (args: { card_id: number }) => {
      try {
        const result = await metabaseClient.copyCard(args.card_id);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to copy card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/card/{id}/dashboards - Dashboards containing card
  server.addTool({
    name: "get_card_dashboards",
    description: "List dashboards containing a card",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
    }),
    execute: async (args: { card_id: number }) => {
      try {
        const result = await metabaseClient.getCardDashboards(args.card_id);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get dashboards for card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/card/embeddable - Embeddable cards
  server.addTool({
    name: "list_embeddable_cards",
    description: "List cards with enable_embedding=true (requires superuser)",
    execute: async () => {
      try {
        const result = await metabaseClient.getEmbeddableCards();
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to list embeddable cards: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // Public link - create
  server.addTool({
    name: "create_card_public_link",
    description: "Create a public link for a card (requires superuser)",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
    }),
    execute: async (args: { card_id: number }) => {
      try {
        const result = await metabaseClient.createCardPublicLink(args.card_id);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to create public link for card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // Public link - delete
  server.addTool({
    name: "delete_card_public_link",
    description: "Delete a public link for a card (requires superuser)",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
    }),
    execute: async (args: { card_id: number }) => {
      try {
        const result = await metabaseClient.deleteCardPublicLink(args.card_id);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to delete public link for card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/card/public - Public cards
  server.addTool({
    name: "list_public_cards",
    description: "List public cards (requires superuser)",
    execute: async () => {
      try {
        const result = await metabaseClient.getPublicCards();
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to list public cards: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // POST /api/cards/move - Move cards
  server.addTool({
    name: "move_cards",
    description: "Move cards to a collection or dashboard",
    parameters: z.object({
      card_ids: z.array(z.number()).describe("Card IDs to move"),
      collection_id: z.number().optional().describe("Target collection ID"),
      dashboard_id: z.number().optional().describe("Target dashboard ID"),
    }),
    execute: async (args: {
      card_ids: number[];
      collection_id?: number;
      dashboard_id?: number;
    }) => {
      try {
        const result = await metabaseClient.moveCards(
          args.card_ids,
          args.collection_id,
          args.dashboard_id
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to move cards: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // POST /api/card/collections - Move cards to collection
  server.addTool({
    name: "move_cards_to_collection",
    description: "Move cards to a collection",
    parameters: z.object({
      card_ids: z.array(z.number()).describe("Card IDs to move"),
      collection_id: z.number().optional().describe("Target collection ID"),
    }),
    execute: async (args: { card_ids: number[]; collection_id?: number }) => {
      try {
        const result = await metabaseClient.moveCardsToCollection(
          args.card_ids,
          args.collection_id
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to move cards to collection: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // POST /api/card/pivot/{card-id}/query - Execute pivot query
  server.addTool({
    name: "execute_pivot_card_query",
    description: "Execute a pivot query for a card",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
      parameters: z.object({}).optional().describe("Execution parameters"),
    }),
    execute: async (args: { card_id: number; parameters?: any }) => {
      try {
        const result = await metabaseClient.executePivotCardQuery(
          args.card_id,
          args.parameters || {}
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to execute pivot query for card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/card/{card-id}/params/{param-key}/values - Param values
  server.addTool({
    name: "get_card_param_values",
    description: "Get possible values for a card parameter",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
      param_key: z.string().describe("Parameter key"),
    }),
    execute: async (args: { card_id: number; param_key: string }) => {
      try {
        const result = await metabaseClient.getCardParamValues(
          args.card_id,
          args.param_key
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get parameter values for card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/card/{card-id}/params/{param-key}/search/{query} - Param search
  server.addTool({
    name: "search_card_param_values",
    description: "Search parameter values for a card",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
      param_key: z.string().describe("Parameter key"),
      query: z.string().describe("Search query"),
    }),
    execute: async (args: {
      card_id: number;
      param_key: string;
      query: string;
    }) => {
      try {
        const result = await metabaseClient.searchCardParamValues(
          args.card_id,
          args.param_key,
          args.query
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to search parameter values for card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/card/{id}/params/{param-key}/remapping - Param remapping
  server.addTool({
    name: "get_card_param_remapping",
    description: "Get parameter value remapping for a card",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
      param_key: z.string().describe("Parameter key"),
      value: z.string().describe("Parameter value to remap"),
    }),
    execute: async (args: {
      card_id: number;
      param_key: string;
      value: string;
    }) => {
      try {
        const result = await metabaseClient.getCardParamRemapping(
          args.card_id,
          args.param_key,
          args.value
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get parameter remapping for card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/card/{id}/query_metadata - Query metadata
  server.addTool({
    name: "get_card_query_metadata",
    description: "Get query metadata for a card",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
    }),
    execute: async (args: { card_id: number }) => {
      try {
        const result = await metabaseClient.getCardQueryMetadata(args.card_id);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get query metadata for card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/card/{id}/series - Card series
  server.addTool({
    name: "get_card_series",
    description: "Get time series/suggestions for a card",
    parameters: z.object({
      card_id: z.number().describe("Card ID"),
      last_cursor: z
        .union([z.string(), z.number()])
        .optional()
        .describe("Pagination cursor"),
      query: z.string().optional().describe("Filter query"),
      exclude_ids: z
        .array(z.number())
        .optional()
        .describe("IDs to exclude"),
    }),
    execute: async (args: {
      card_id: number;
      last_cursor?: string | number;
      query?: string;
      exclude_ids?: number[];
    }) => {
      try {
        const result = await metabaseClient.getCardSeries(args.card_id, {
          last_cursor: args.last_cursor,
          query: args.query,
          exclude_ids: args.exclude_ids,
        });
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get series for card ${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });
}
