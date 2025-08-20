/**
 * Config-driven tool registry that manages all tool handlers using declarative configurations
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ToolConfig } from "../types/tool-config.js";
import { dashboardTools } from "../tools/dashboard-tools.js";
import { cardTools } from "../tools/card-tools.js";
import { databaseTools } from "../tools/database-tools.js";
import { tableTools } from "../tools/table-tools.js";

export class ConfigRegistry {
  private toolConfigs: Record<string, ToolConfig>;

  constructor(private client: MetabaseClient) {
    this.toolConfigs = {
      ...dashboardTools,
      ...cardTools,
      ...databaseTools,
      ...tableTools,
    };
  }

  /**
   * Get all available tool schemas
   */
  getAllToolSchemas(): Tool[] {
    return Object.values(this.toolConfigs).map(config => ({
      name: config.name,
      description: config.description,
      inputSchema: config.inputSchema,
    }));
  }

  /**
   * Handle a tool call using the config-driven approach
   */
  async handleTool(name: string, args: any): Promise<any> {
    const toolConfig = this.toolConfigs[name];
    
    if (!toolConfig) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    try {
      // Run validation
      if (toolConfig.validate) {
        toolConfig.validate(args);
      }

      // Transform arguments
      const transformedArgs = toolConfig.transformArgs ? toolConfig.transformArgs(args) : args;

      // Execute the handler
      const result = await toolConfig.handler(this.client, transformedArgs);
      
      return result;
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
    }
  }
}
