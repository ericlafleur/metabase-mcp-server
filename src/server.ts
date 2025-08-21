#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { MetabaseClient } from "./client/metabase-client.js";
import { loadConfig, validateConfig } from "./utils/config.js";
import { addDashboardTools } from "./tools/dashboard-tools.js";
import { addDatabaseTools } from "./tools/database-tools.js";
import { addCardTools } from "./tools/card-tools.js";
import { addTableTools } from "./tools/table-tools.js";
import { addAdditionalTools } from "./tools/additional-tools.js";

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

// Add all dashboard tools
addDashboardTools(server, metabaseClient);

// Add all database tools
addDatabaseTools(server, metabaseClient);

// Add all card tools
addCardTools(server, metabaseClient);

// Add all table tools
addTableTools(server, metabaseClient);

// Add additional tools (collections/search/move)
addAdditionalTools(server, metabaseClient);

// Start the server
server.start({
  transportType: "stdio",
});