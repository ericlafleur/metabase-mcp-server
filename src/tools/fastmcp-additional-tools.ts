import { z } from "zod";
import { MetabaseClient } from "../client/metabase-client.js";

export function addAdditionalTools(server: any, metabaseClient: MetabaseClient) {
  // GET /api/collection/:id/items
  server.addTool({
    name: "get_collection_items",
    description: "Get all items in a collection",
    parameters: z.object({
      collection_id: z.number().describe("Collection ID"),
    }),
    execute: async (args: { collection_id: number }) => {
      try {
        const result = await metabaseClient.apiCall(
          "GET",
          `/api/collection/${args.collection_id}/items`
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get items for collection ${args.collection_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // PUT /api/{item_type}/{item_id} with { collection_id }
  server.addTool({
    name: "move_to_collection",
    description: "Move a card or dashboard to a collection (or root with null)",
    parameters: z.object({
      item_type: z.enum(["card", "dashboard"]).describe("Item type"),
      item_id: z.number().describe("Item ID"),
      collection_id: z
        .union([z.number(), z.null()])
        .describe("Target collection ID (null for root)"),
    }),
    execute: async (args: {
      item_type: "card" | "dashboard";
      item_id: number;
      collection_id: number | null;
    }) => {
      try {
        const result = await metabaseClient.apiCall(
          "PUT",
          `/api/${args.item_type}/${args.item_id}`,
          { collection_id: args.collection_id }
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to move ${args.item_type} ${args.item_id} to collection ${args.collection_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/search?q=...
  server.addTool({
    name: "search_content",
    description: "Search across Metabase content (cards, dashboards, collections, etc.)",
    parameters: z
      .object({
        q: z.string().min(1).describe("Search query"),
      })
      .passthrough(),
    execute: async (args: any) => {
      try {
        const { q, ...other } = args;
        const params = new URLSearchParams({ q });
        Object.entries(other).forEach(([k, v]) => {
          if (v !== undefined && v !== null) params.append(k, String(v));
        });
        const url = `/api/search?${params.toString()}`;
        const result = await metabaseClient.apiCall("GET", url);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to search content: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });
}
