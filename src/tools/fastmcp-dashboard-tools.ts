import { z } from "zod";
import { MetabaseClient } from "../client/metabase-client.js";

export function addDashboardTools(server: any, metabaseClient: MetabaseClient) {
  // GET /api/dashboard - List all dashboards
  server.addTool({
    name: "list_dashboards",
    description: "Get all dashboards from Metabase",
    execute: async () => {
      try {
        const dashboards = await metabaseClient.getDashboards();
        return JSON.stringify(dashboards, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch dashboards: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/dashboard/:id - Get specific dashboard details
  server.addTool({
    name: "get_dashboard",
    description: "Get specific dashboard details by ID",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard to retrieve"),
    }),
    execute: async (args: { dashboard_id: number }) => {
      try {
        const dashboard = await metabaseClient.getDashboard(args.dashboard_id);
        return JSON.stringify(dashboard, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/dashboard/:id/cards - Get all cards in a specific dashboard
  server.addTool({
    name: "get_dashboard_cards",
    description: "Get all cards in a specific dashboard",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
    }),
    execute: async (args: { dashboard_id: number }) => {
      try {
        const dashboard = await metabaseClient.getDashboard(args.dashboard_id);
        const cards = dashboard.cards || [];
        return JSON.stringify(cards, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch cards for dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/dashboard/:id/related - Get related entities
  server.addTool({
    name: "get_dashboard_related",
    description: "Return related entities for a dashboard",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
    }),
    execute: async (args: { dashboard_id: number }) => {
      try {
        const result = await metabaseClient.apiCall('GET', `/api/dashboard/${args.dashboard_id}/related`);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch related entities for dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/dashboard/:id/revisions - Get dashboard revisions
  server.addTool({
    name: "get_dashboard_revisions",
    description: "Fetch revisions for dashboard with ID",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
    }),
    execute: async (args: { dashboard_id: number }) => {
      try {
        const result = await metabaseClient.apiCall('GET', `/api/dashboard/${args.dashboard_id}/revisions`);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch revisions for dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/dashboard/embeddable - List embeddable dashboards
  server.addTool({
    name: "list_embeddable_dashboards",
    description: "Fetch a list of dashboards where enable_embedding is true (requires superuser)",
    execute: async () => {
      try {
        const dashboards = await metabaseClient.apiCall('GET', '/api/dashboard/embeddable');
        return JSON.stringify(dashboards, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch embeddable dashboards: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/dashboard/public - List public dashboards
  server.addTool({
    name: "list_public_dashboards",
    description: "Fetch a list of dashboards with public UUIDs (requires superuser)",
    execute: async () => {
      try {
        const dashboards = await metabaseClient.apiCall('GET', '/api/dashboard/public');
        return JSON.stringify(dashboards, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch public dashboards: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/dashboard/ - Create a new dashboard
  server.addTool({
    name: "create_dashboard",
    description: "Create a new Dashboard",
    parameters: z.object({
      name: z.string().describe("Name of the dashboard (required)"),
      description: z.string().optional().describe("Description of the dashboard"),
      parameters: z.array(z.object({})).optional().describe("Dashboard parameters array"),
      collection_id: z.number().optional().describe("Collection ID to save dashboard in"),
      collection_position: z.number().optional().describe("Position within the collection"),
    }),
    execute: async (args: { name: string; description?: string; parameters?: any[]; collection_id?: number; collection_position?: number }) => {
      try {
        const dashboard = await metabaseClient.createDashboard(args);
        return JSON.stringify(dashboard, null, 2);
      } catch (error) {
        throw new Error(`Failed to create dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/dashboard/:dashboard-id/public_link - Create public link
  server.addTool({
    name: "create_public_link",
    description: "Generate publicly-accessible links for this dashboard (requires superuser)",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
    }),
    execute: async (args: { dashboard_id: number }) => {
      try {
        const result = await metabaseClient.apiCall('POST', `/api/dashboard/${args.dashboard_id}/public_link`);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to create public link for dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/dashboard/:from-dashboard-id/copy - Copy dashboard
  server.addTool({
    name: "copy_dashboard",
    description: "Copy a Dashboard",
    parameters: z.object({
      from_dashboard_id: z.number().describe("The ID of the dashboard to copy"),
      name: z.string().optional().describe("Name for the new dashboard copy"),
      description: z.string().optional().describe("Description for the new dashboard copy"),
      collection_id: z.number().optional().describe("Collection ID for the new dashboard"),
      collection_position: z.number().optional().describe("Position within the collection"),
    }),
    execute: async (args: { from_dashboard_id: number; name?: string; description?: string; collection_id?: number; collection_position?: number }) => {
      try {
        const { from_dashboard_id, ...copyData } = args;
        const dashboard = await metabaseClient.apiCall('POST', `/api/dashboard/${from_dashboard_id}/copy`, copyData);
        return JSON.stringify(dashboard, null, 2);
      } catch (error) {
        throw new Error(`Failed to copy dashboard ${args.from_dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/dashboard/:id/cards - Add card to dashboard
  server.addTool({
    name: "add_card_to_dashboard",
    description: "Add a Card to a Dashboard",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
      cardId: z.number().optional().describe("The ID of the card to add"),
      parameter_mappings: z.array(z.object({})).optional().describe("Parameter mappings for the card"),
      series: z.array(z.object({})).optional().describe("Series data for the card"),
    }),
    execute: async (args: { dashboard_id: number; cardId?: number; parameter_mappings?: any[]; series?: any[] }) => {
      try {
        const { dashboard_id, ...cardData } = args;
        const result = await metabaseClient.apiCall('POST', `/api/dashboard/${dashboard_id}/cards`, cardData);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to add card to dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/dashboard/:id/favorite - Favorite dashboard
  server.addTool({
    name: "favorite_dashboard",
    description: "Favorite a Dashboard",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
    }),
    execute: async (args: { dashboard_id: number }) => {
      try {
        const result = await metabaseClient.apiCall('POST', `/api/dashboard/${args.dashboard_id}/favorite`);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to favorite dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/dashboard/:id/revert - Revert dashboard to revision
  server.addTool({
    name: "revert_dashboard",
    description: "Revert a Dashboard to a prior Revision",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
      revision_id: z.number().describe("The revision ID to revert to"),
    }),
    execute: async (args: { dashboard_id: number; revision_id: number }) => {
      try {
        const result = await metabaseClient.apiCall('POST', `/api/dashboard/${args.dashboard_id}/revert`, {
          revision_id: args.revision_id
        });
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to revert dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/dashboard/save - Save denormalized dashboard
  server.addTool({
    name: "save_dashboard",
    description: "Save a denormalized description of dashboard",
    parameters: z.object({
      dashboard: z.object({}).describe("Dashboard object to save"),
    }),
    execute: async (args: { dashboard: any }) => {
      try {
        const result = await metabaseClient.apiCall('POST', '/api/dashboard/save', args.dashboard);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to save dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/dashboard/save/collection/:parent-collection-id - Save dashboard to collection
  server.addTool({
    name: "save_dashboard_to_collection",
    description: "Save a denormalized description of dashboard into collection",
    parameters: z.object({
      parent_collection_id: z.number().describe("The parent collection ID"),
      dashboard: z.object({}).describe("Dashboard object to save"),
    }),
    execute: async (args: { parent_collection_id: number; dashboard: any }) => {
      try {
        const result = await metabaseClient.apiCall('POST', `/api/dashboard/save/collection/${args.parent_collection_id}`, args.dashboard);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to save dashboard to collection ${args.parent_collection_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // PUT /api/dashboard/:id - Update dashboard
  server.addTool({
    name: "update_dashboard",
    description: "Update a Dashboard",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard to update"),
      name: z.string().optional().describe("New name for the dashboard"),
      description: z.string().optional().describe("New description for the dashboard"),
      parameters: z.array(z.object({})).optional().describe("Dashboard parameters"),
      points_of_interest: z.string().optional().describe("Points of interest"),
      archived: z.boolean().optional().describe("Whether to archive the dashboard"),
      collection_position: z.number().optional().describe("Position within the collection"),
      show_in_getting_started: z.boolean().optional().describe("Show in getting started"),
      enable_embedding: z.boolean().optional().describe("Enable embedding (requires superuser)"),
      collection_id: z.number().optional().describe("Collection ID to move dashboard to"),
      caveats: z.string().optional().describe("Dashboard caveats"),
      embedding_params: z.object({}).optional().describe("Embedding parameters"),
      position: z.number().optional().describe("Dashboard position"),
    }),
    execute: async (args: { dashboard_id: number; [key: string]: any }) => {
      try {
        const { dashboard_id, ...updates } = args;
        const dashboard = await metabaseClient.updateDashboard(dashboard_id, updates);
        return JSON.stringify(dashboard, null, 2);
      } catch (error) {
        throw new Error(`Failed to update dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // PUT /api/dashboard/:id/cards - Update dashboard cards
  server.addTool({
    name: "update_dashboard_cards",
    description: "Update Cards on a Dashboard",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
      cards: z.array(z.object({
        id: z.number().describe("Card ID"),
        sizeX: z.number().optional().describe("Width of the card"),
        sizeY: z.number().optional().describe("Height of the card"),
        row: z.number().optional().describe("Row position"),
        col: z.number().optional().describe("Column position"),
        series: z.array(z.object({})).optional().describe("Series data"),
      })).describe("Array of card configurations"),
    }),
    execute: async (args: { dashboard_id: number; cards: any[] }) => {
      try {
        const result = await metabaseClient.apiCall('PUT', `/api/dashboard/${args.dashboard_id}/cards`, { cards: args.cards });
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to update cards on dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // DELETE /api/dashboard/:id - Delete dashboard
  server.addTool({
    name: "delete_dashboard",
    description: "Delete or archive a dashboard",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard to delete"),
      hard_delete: z.boolean().optional().default(false).describe("Whether to permanently delete (true) or archive (false)"),
    }),
    execute: async (args: { dashboard_id: number; hard_delete?: boolean }) => {
      try {
        await metabaseClient.deleteDashboard(args.dashboard_id, args.hard_delete || false);
        return JSON.stringify({
          dashboard_id: args.dashboard_id,
          action: args.hard_delete ? "deleted" : "archived",
          status: "success"
        }, null, 2);
      } catch (error) {
        throw new Error(`Failed to delete dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // DELETE /api/dashboard/:dashboard-id/public_link - Delete public link
  server.addTool({
    name: "delete_public_link",
    description: "Delete the public link for a dashboard (requires superuser)",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
    }),
    execute: async (args: { dashboard_id: number }) => {
      try {
        await metabaseClient.apiCall('DELETE', `/api/dashboard/${args.dashboard_id}/public_link`);
        return JSON.stringify({
          dashboard_id: args.dashboard_id,
          action: "public_link_deleted",
          status: "success"
        }, null, 2);
      } catch (error) {
        throw new Error(`Failed to delete public link for dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // DELETE /api/dashboard/:id/cards - Remove cards from dashboard
  server.addTool({
    name: "remove_cards_from_dashboard",
    description: "Remove cards from a dashboard",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
      card_ids: z.array(z.number()).describe("Array of card IDs to remove"),
    }),
    execute: async (args: { dashboard_id: number; card_ids: number[] }) => {
      try {
        const result = await metabaseClient.apiCall('DELETE', `/api/dashboard/${args.dashboard_id}/cards`, {
          card_ids: args.card_ids
        });
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to remove cards from dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // DELETE /api/dashboard/:id/favorite - Unfavorite dashboard
  server.addTool({
    name: "unfavorite_dashboard",
    description: "Unfavorite a Dashboard",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard"),
    }),
    execute: async (args: { dashboard_id: number }) => {
      try {
        const result = await metabaseClient.apiCall('DELETE', `/api/dashboard/${args.dashboard_id}/favorite`);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to unfavorite dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // Additional utility tool - Execute dashboard card
  server.addTool({
    name: "execute_dashboard_card",
    description: "Execute a specific card from a dashboard and get results",
    parameters: z.object({
      dashboard_id: z.number().describe("The ID of the dashboard containing the card"),
      card_id: z.number().describe("The ID of the card to execute"),
    }),
    execute: async (args: { dashboard_id: number; card_id: number }) => {
      try {
        const result = await metabaseClient.executeCard(args.card_id);
        return JSON.stringify({
          dashboard_id: args.dashboard_id,
          card_id: args.card_id,
          status: "completed",
          data: result
        }, null, 2);
      } catch (error) {
        throw new Error(`Failed to execute card ${args.card_id} from dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // Additional utility tool - Search dashboards
  server.addTool({
    name: "search_dashboards",
    description: "Search dashboards by name or description",
    parameters: z.object({
      query: z.string().describe("Search query string"),
      limit: z.number().optional().describe("Maximum number of results to return"),
    }),
    execute: async (args: { query: string; limit?: number }) => {
      try {
        const dashboards = await metabaseClient.getDashboards();
        const filtered = dashboards.filter(d => 
          d.name?.toLowerCase().includes(args.query.toLowerCase()) ||
          d.description?.toLowerCase().includes(args.query.toLowerCase())
        );
        
        const results = args.limit ? filtered.slice(0, args.limit) : filtered;
        return JSON.stringify(results, null, 2);
      } catch (error) {
        throw new Error(`Failed to search dashboards: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });
}
