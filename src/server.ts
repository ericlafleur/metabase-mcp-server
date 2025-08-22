#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { MetabaseClient } from "./client/metabase-client.js";
import { loadConfig, validateConfig } from "./utils/config.js";
import { addDashboardTools } from "./tools/dashboard-tools.js";
import { addDatabaseTools } from "./tools/database-tools.js";
import { addCardTools } from "./tools/card-tools.js";
import { addTableTools } from "./tools/table-tools.js";
import { addAdditionalTools } from "./tools/additional-tools.js";
import { parseToolFilterOptions } from "./utils/tool-filters.js";

// Parse command line arguments for tool filtering
const filterOptions = parseToolFilterOptions();

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

// Override addTool to apply filtering
const originalAddTool = server.addTool.bind(server);
server.addTool = function(toolConfig: any) {
  const { metadata = {}, ...restConfig } = toolConfig;
  const { isWrite, isEssential } = metadata;

  // Skip non-essential tools when essential mode is enabled
  if (filterOptions.essentialOnly && !isEssential) {
    return;
  }

  // Skip non-write tools when write mode is disabled
  if (filterOptions.writeMode && !isWrite) {
    return;
  }

  // Register the tool
  originalAddTool(restConfig);
};

// Adding all tools to the server
addDashboardTools(server, metabaseClient);
addDatabaseTools(server, metabaseClient);
addCardTools(server, metabaseClient);
addTableTools(server, metabaseClient);
addAdditionalTools(server, metabaseClient);

// Log filtering status
if (filterOptions.essentialOnly) {
  console.error(`INFO: Essential mode enabled`);
}
if (filterOptions.writeMode) {
  console.error(`INFO: Write operations enabled`);
}

// Start the server
server.start({
  transportType: "stdio",
});