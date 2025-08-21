#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { MetabaseClient } from "./client/metabase-client.js";
import { loadConfig, validateConfig } from "./utils/config.js";
import { addDashboardTools } from "./tools/fastmcp-dashboard-tools.js";

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

// Start the server
server.start({
  transportType: "stdio",
});

console.error("FastMCP Metabase server started with dashboard tools");
