/**
 * Adds Metabase resource endpoints to the FastMCP server.
 *
 * This function registers static resources that provide read-only access to Metabase entities
 * via standardized URIs. Each resource returns JSON-formatted data for AI assistants to
 * understand and work with Metabase content.
 */
export function addMetabaseResources(server, metabaseClient) {
    /**
     * Resource: All Dashboards
     *
     * Provides a complete list of all Metabase dashboards accessible to the current user.
     * Returns dashboard metadata including ID, name, description, creator, creation date,
     * and collection information.
     *
     * URI: metabase://dashboards
     * Returns: Array of dashboard objects with full metadata
     */
    server.addResource({
        uri: "metabase://dashboards",
        name: "All Dashboards",
        description: "List of all Metabase dashboards with metadata including name, description, creator, and collection info",
        mimeType: "application/json",
        async load() {
            try {
                const dashboards = await metabaseClient.getDashboards();
                return {
                    text: JSON.stringify(dashboards, null, 2)
                };
            }
            catch (error) {
                throw new Error(`Failed to load dashboards: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    });
    /**
     * Resource: All Cards
     *
     * Provides a complete list of all Metabase cards (questions/queries) accessible to the current user.
     * Returns card metadata including ID, name, description, dataset query, visualization settings,
     * creator information, and collection assignment.
     *
     * URI: metabase://cards
     * Returns: Array of card objects with query definitions and visualization config
     */
    server.addResource({
        uri: "metabase://cards",
        name: "All Cards",
        description: "List of all Metabase cards/questions with query definitions, visualization settings, and metadata",
        mimeType: "application/json",
        async load() {
            try {
                const cards = await metabaseClient.getCards();
                return {
                    text: JSON.stringify(cards, null, 2)
                };
            }
            catch (error) {
                throw new Error(`Failed to load cards: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    });
    /**
     * Resource: All Databases
     *
     * Provides a complete list of all Metabase database connections configured in the instance.
     * Returns database metadata including ID, name, engine type, connection details,
     * features supported, and current status.
     *
     * URI: metabase://databases
     * Returns: Array of database connection objects with engine and feature information
     */
    server.addResource({
        uri: "metabase://databases",
        name: "All Databases",
        description: "List of all Metabase database connections with engine type, features, and connection status",
        mimeType: "application/json",
        async load() {
            try {
                const databases = await metabaseClient.getDatabases();
                return {
                    text: JSON.stringify(databases, null, 2)
                };
            }
            catch (error) {
                throw new Error(`Failed to load databases: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    });
    /**
     * Resource: All Collections
     *
     * Provides a complete list of all Metabase collections used to organize dashboards and cards.
     * Returns collection metadata including ID, name, description, color, parent collection,
     * permissions, and organizational hierarchy.
     *
     * URI: metabase://collections
     * Returns: Array of collection objects with hierarchy and permission information
     */
    server.addResource({
        uri: "metabase://collections",
        name: "All Collections",
        description: "List of all Metabase collections with hierarchy, permissions, and organizational metadata",
        mimeType: "application/json",
        async load() {
            try {
                const collections = await metabaseClient.getCollections();
                return {
                    text: JSON.stringify(collections, null, 2)
                };
            }
            catch (error) {
                throw new Error(`Failed to load collections: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    });
    /**
     * Resource: All Users
     *
     * Provides a complete list of all Metabase users registered in the instance.
     * Returns user metadata including ID, email, first/last name, role, group memberships,
     * login activity, and account status.
     *
     * URI: metabase://users
     * Returns: Array of user objects with role and activity information
     */
    server.addResource({
        uri: "metabase://users",
        name: "All Users",
        description: "List of all Metabase users with role, group membership, and activity information",
        mimeType: "application/json",
        async load() {
            try {
                const users = await metabaseClient.getUsers();
                return {
                    text: JSON.stringify(users, null, 2)
                };
            }
            catch (error) {
                throw new Error(`Failed to load users: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    });
}
