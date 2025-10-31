import { z } from "zod";
export function addAdditionalTools(server, metabaseClient) {
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
        metadata: { isEssential: true, isRead: true },
        parameters: z.object({
            collection_id: z.number().describe("Collection ID"),
        }),
        execute: async (args) => {
            try {
                const result = await metabaseClient.apiCall("GET", `/api/collection/${args.collection_id}/items`);
                return JSON.stringify(result, null, 2);
            }
            catch (error) {
                throw new Error(`Failed to get items for collection ${args.collection_id}: ${error instanceof Error ? error.message : "Unknown error"}`);
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
        metadata: { isWrite: true },
        parameters: z.object({
            item_type: z.enum(["card", "dashboard"]).describe("Item type"),
            item_id: z.number().describe("Item ID"),
            collection_id: z
                .union([z.number(), z.null()])
                .describe("Target collection ID (null for root)"),
        }),
        execute: async (args) => {
            try {
                const result = await metabaseClient.apiCall("PUT", `/api/${args.item_type}/${args.item_id}`, { collection_id: args.collection_id });
                return JSON.stringify(result, null, 2);
            }
            catch (error) {
                throw new Error(`Failed to move ${args.item_type} ${args.item_id} to collection ${args.collection_id}: ${error instanceof Error ? error.message : "Unknown error"}`);
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
        metadata: { isEssential: true, isRead: true },
        parameters: z
            .object({
            q: z.string().min(1).describe("Search query"),
        })
            .passthrough(),
        execute: async (args) => {
            try {
                const { q, ...other } = args;
                const params = new URLSearchParams({ q });
                Object.entries(other).forEach(([k, v]) => {
                    if (v !== undefined && v !== null)
                        params.append(k, String(v));
                });
                const url = `/api/search?${params.toString()}`;
                const result = await metabaseClient.apiCall("GET", url);
                return JSON.stringify(result, null, 2);
            }
            catch (error) {
                throw new Error(`Failed to search content: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        },
    });
    /**
     * List all collections
     *
     * Retrieves all collections in Metabase, which are organizational containers
     * for cards, dashboards, and other analytical content. Use this to understand
     * content organization, find specific collections, or get an overview of
     * how analytical assets are structured.
     *
     * @param {boolean} [archived=false] - Include archived collections
     * @returns {Promise<string>} JSON string of collections array
     */
    server.addTool({
        name: "list_collections",
        description: "Retrieve all Metabase collections for organizing analytical content - use this to understand content structure, find collections, or explore organizational hierarchy",
        metadata: { isEssential: true, isRead: true },
        parameters: z.object({
            archived: z.boolean().optional().default(false).describe("Include archived collections"),
        }),
        execute: async (args = {}) => {
            try {
                const collections = await metabaseClient.getCollections(args.archived || false);
                return JSON.stringify(collections, null, 2);
            }
            catch (error) {
                throw new Error(`Failed to fetch collections: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
    });
    /**
     * Create a new collection
     *
     * Creates a new collection for organizing cards, dashboards, and other analytical
     * content. Collections help structure and manage analytical assets by team,
     * project, or topic. Use this to establish new organizational containers.
     *
     * @param {string} name - Name of the collection
     * @param {string} [description] - Optional description of the collection
     * @param {number} [parent_id] - Parent collection ID for nested organization
     * @param {string} [color] - Color for the collection (hex code)
     * @returns {Promise<string>} JSON string of created collection object
     */
    server.addTool({
        name: "create_collection",
        description: "Create a new Metabase collection for organizing analytical content - use this to establish organizational containers for cards, dashboards, and reports",
        metadata: { isWrite: true },
        parameters: z.object({
            name: z.string().describe("Name of the collection (required)"),
            description: z.string().optional().describe("Description of the collection"),
            parent_id: z.number().optional().describe("Parent collection ID for nested organization"),
            color: z.string().optional().describe("Color for the collection (hex code)"),
        }),
        execute: async (args) => {
            try {
                const collection = await metabaseClient.createCollection(args);
                return JSON.stringify(collection, null, 2);
            }
            catch (error) {
                throw new Error(`Failed to create collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
    });
    /**
     * Update an existing collection
     *
     * Modifies properties of an existing collection including name, description,
     * parent collection, or color. Use this to maintain collection metadata,
     * reorganize hierarchies, or update organizational structure.
     *
     * @param {number} collection_id - The ID of the collection to update
     * @param {string} [name] - New name for the collection
     * @param {string} [description] - New description for the collection
     * @param {number} [parent_id] - New parent collection ID
     * @param {string} [color] - New color for the collection
     * @returns {Promise<string>} JSON string of updated collection object
     */
    server.addTool({
        name: "update_collection",
        description: "Update collection properties including name, description, and organization - use this to maintain metadata, reorganize hierarchies, or update structure",
        metadata: { isWrite: true },
        parameters: z.object({
            collection_id: z.number().describe("The ID of the collection to update"),
            name: z.string().optional().describe("New name for the collection"),
            description: z.string().optional().describe("New description for the collection"),
            parent_id: z.number().optional().describe("New parent collection ID"),
            color: z.string().optional().describe("New color for the collection"),
        }),
        execute: async (args) => {
            try {
                const { collection_id, ...updates } = args;
                const collection = await metabaseClient.updateCollection(collection_id, updates);
                return JSON.stringify(collection, null, 2);
            }
            catch (error) {
                throw new Error(`Failed to update collection ${args.collection_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
    });
    /**
     * Delete a collection
     *
     * Permanently removes a collection from Metabase. Note that this will also
     * affect any cards or dashboards contained within the collection. Use with
     * caution as this action cannot be undone.
     *
     * @param {number} collection_id - The ID of the collection to delete
     * @returns {Promise<string>} JSON string confirming deletion status
     */
    server.addTool({
        name: "delete_collection",
        description: "Permanently delete a Metabase collection - use with caution as this affects contained content and cannot be undone",
        metadata: { isWrite: true },
        parameters: z.object({
            collection_id: z.number().describe("The ID of the collection to delete"),
        }),
        execute: async (args) => {
            try {
                await metabaseClient.deleteCollection(args.collection_id);
                return JSON.stringify({
                    collection_id: args.collection_id,
                    action: "deleted",
                    status: "success"
                }, null, 2);
            }
            catch (error) {
                throw new Error(`Failed to delete collection ${args.collection_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
    });
    /**
     * List all users
     *
     * Retrieves all user accounts in the Metabase instance, including their
     * roles, permissions, and status. Use this to understand user access,
     * manage permissions, or audit user accounts.
     *
     * @param {boolean} [include_deactivated=false] - Include deactivated users
     * @returns {Promise<string>} JSON string of users array
     */
    server.addTool({
        name: "list_users",
        description: "Retrieve all Metabase users with their roles and permissions - use this to understand user access, manage permissions, or audit accounts",
        metadata: { isEssential: true, isRead: true },
        parameters: z.object({
            include_deactivated: z.boolean().optional().default(false).describe("Include deactivated users"),
        }),
        execute: async (args = {}) => {
            try {
                const users = await metabaseClient.getUsers(args.include_deactivated || false);
                return JSON.stringify(users, null, 2);
            }
            catch (error) {
                throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
    });
    /**
     * Get a Metabase playground link for interactive query exploration
     *
     * Creates a shareable Metabase playground link where users can see query results
     * in a user-friendly interface and experiment with the data interactively.
     *
     * @param {string} query - The SQL query to execute in the playground
     * @param {string} [display] - Display type (table, bar, line, etc.)
     * @returns {Promise<string>} JSON string with the playground URL
     */
    server.addTool({
        name: "get_metabase_playground_link",
        description: "Generate a Metabase playground link for interactive query exploration - allows users to see results and experiment with data in a user-friendly interface",
        metadata: { isEssential: true },
        parameters: z.object({
            query: z.string().describe("The SQL query to execute in the playground"),
            display: z.string().optional().default("table").describe("Display type (table, bar, line, etc.)"),
        }),
        execute: async (args) => {
            try {
                const payload = {
                    dataset_query: {
                        type: "native",
                        native: {
                            template_tags: {},
                            query: args.query
                        }
                    },
                    display: args.display || "table",
                    parameters: [],
                    visualization_settings: {},
                    type: "question"
                };
                const queryB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
                const metabaseUrl = process.env.METABASE_PLAYGROUND_URL || process.env.METABASE_URL;
                if (!metabaseUrl) {
                    throw new Error("METABASE_URL environment variable is required");
                }
                const playgroundUrl = `${metabaseUrl}/question#${queryB64}`;
                return JSON.stringify({
                    playground_url: playgroundUrl,
                    query: args.query,
                    display: args.display || "table"
                }, null, 2);
            }
            catch (error) {
                throw new Error(`Failed to generate playground link: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
    });
}
