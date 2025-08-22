import { z } from "zod";
import { MetabaseClient } from "../client/metabase-client.js";

export function addAdditionalTools(server: any, metabaseClient: MetabaseClient) {

  /**
   * Get all items within a collection
   * 
   * Retrieves all cards, dashboards, and other items contained in a specific collection.
   * Use this to explore collection contents, organize analytical assets, or understand
   * how content is structured within collections.
   * 
   * @param {number} collection_id - The ID of the collection
   * @returns {Promise<string>} JSON string of collection items array
   */
  server.addTool({
    name: "get_collection_items",
    description: "Retrieve all items (cards, dashboards) within a Metabase collection - use this to explore collection contents, organize analytical assets, or understand content structure",
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

  /**
   * Move item to a different collection
   * 
   * Moves a card or dashboard to a specified collection or to the root level.
   * Use this to reorganize content, implement governance policies, or clean up
   * analytical assets by moving them to appropriate collections.
   * 
   * @param {string} item_type - Type of item (card or dashboard)
   * @param {number} item_id - The ID of the item to move
   * @param {number|null} collection_id - Target collection ID (null for root)
   * @returns {Promise<string>} JSON string confirming the move operation
   */
  server.addTool({
    name: "move_to_collection",
    description: "Move a Metabase card or dashboard to a different collection - use this to reorganize content, implement governance policies, or clean up analytical assets",
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

  /**
   * Search across all Metabase content
   * 
   * Performs a comprehensive search across cards, dashboards, collections, models,
   * and other Metabase content. Supports additional filters and parameters for
   * refined search results. Use this to find specific content, discover related
   * assets, or explore available analytical resources.
   * 
   * @param {string} q - Search query string (required)
   * @param {...any} [filters] - Additional search filters (type, collection, etc.)
   * @returns {Promise<string>} JSON string with search results array
   */
  server.addTool({
    name: "search_content",
    description: "Search across all Metabase content including cards, dashboards, collections, and models - use this to find specific content, discover assets, or explore analytical resources",
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
