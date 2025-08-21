#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { z } from "zod";
import { MetabaseClient } from "./client/metabase-client.js";
import { loadConfig, validateConfig } from "./utils/config.js";

// Load and validate configuration
const config = loadConfig();
validateConfig(config);

// Initialize Metabase client
const metabaseClient = new MetabaseClient(config);

// Create FastMCP server
const server = new FastMCP({
  name: "metabase-server",
  version: "0.1.0",
});

// Add list_dashboards tool (no parameters)
server.addTool({
  name: "list_dashboards",
  description: "List all dashboards in Metabase",
  execute: async () => {
    try {
      const dashboards = await metabaseClient.getDashboards();
      return JSON.stringify(dashboards, null, 2);
    } catch (error) {
      throw new Error(`Failed to fetch dashboards: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Add get_dashboard tool (with parameters)
server.addTool({
  name: "get_dashboard",
  description: "Get details of a specific dashboard by ID",
  parameters: z.object({
    dashboard_id: z.number().describe("The ID of the dashboard to retrieve"),
  }),
  execute: async (args) => {
    try {
      const dashboard = await metabaseClient.getDashboard(args.dashboard_id);
      return JSON.stringify(dashboard, null, 2);
    } catch (error) {
      throw new Error(`Failed to fetch dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Add search_dashboards tool (with optional parameters)
server.addTool({
  name: "search_dashboards",
  description: "Search dashboards by name or description",
  parameters: z.object({
    query: z.string().describe("Search query string"),
    limit: z.number().optional().describe("Maximum number of results to return"),
  }),
  execute: async (args) => {
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

// Add execute_dashboard_card tool (with multiple parameters)
server.addTool({
  name: "execute_dashboard_card",
  description: "Execute a specific card from a dashboard and get results",
  parameters: z.object({
    dashboard_id: z.number().describe("The ID of the dashboard containing the card"),
    card_id: z.number().describe("The ID of the card to execute"),
  }),
  execute: async (args) => {
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

// Add create_dashboard tool
server.addTool({
  name: "create_dashboard",
  description: "Create a new Metabase dashboard",
  parameters: z.object({
    name: z.string().describe("Name of the dashboard"),
    description: z.string().optional().describe("Optional description for the dashboard"),
    parameters: z.array(z.object({})).optional().describe("Optional parameters for the dashboard"),
    collection_id: z.number().optional().describe("Optional ID of the collection to save the dashboard in"),
  }),
  execute: async (args) => {
    try {
      const dashboardData: any = { name: args.name };
      if (args.description !== undefined) dashboardData.description = args.description;
      if (args.parameters !== undefined) dashboardData.parameters = args.parameters;
      if (args.collection_id !== undefined) dashboardData.collection_id = args.collection_id;

      const dashboard = await metabaseClient.createDashboard(dashboardData);
      return JSON.stringify(dashboard, null, 2);
    } catch (error) {
      throw new Error(`Failed to create dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Add get_dashboard_cards tool
server.addTool({
  name: "get_dashboard_cards",
  description: "Get all cards in a specific dashboard",
  parameters: z.object({
    dashboard_id: z.number().describe("The ID of the dashboard"),
  }),
  execute: async (args) => {
    try {
      // Get the full dashboard which includes cards information
      const dashboard = await metabaseClient.getDashboard(args.dashboard_id);
      const cards = dashboard.cards || [];
      return JSON.stringify(cards, null, 2);
    } catch (error) {
      throw new Error(`Failed to fetch cards for dashboard ${args.dashboard_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Start the server
server.start({
  transportType: "stdio",
});

console.error("FastMCP Metabase server started with dashboard tools");
