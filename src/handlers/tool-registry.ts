/**
 * Tool registry that manages all tool handlers using config-driven approach
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { ConfigRegistry } from "./config-tool-registry.js";
import { ErrorCode, McpError } from "../types/errors.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ToolFilterOptions } from "../types/metabase.js";
import { AdditionalToolHandlers } from "./additional-tools.js";

export class ToolRegistry {
  private configRegistry: ConfigRegistry;
  private additionalHandlers: AdditionalToolHandlers;

  constructor(private client: MetabaseClient, private filterOptions?: ToolFilterOptions) {
    this.configRegistry = new ConfigRegistry(client);
    this.additionalHandlers = new AdditionalToolHandlers(client);
  }

  /**
   * Get all available tool schemas
   */
  getAllToolSchemas(): Tool[] {
    const configTools = this.configRegistry.getAllToolSchemas();
    const additionalTools = this.additionalHandlers.getToolSchemas();
    const allTools = [...configTools, ...additionalTools];

    return this.filterTools(allTools);
  }

  /**
   * Handle a tool call
   */
  async handleTool(name: string, args: any): Promise<any> {
    // Try config-driven tools first
    try {
      return await this.configRegistry.handleTool(name, args);
    } catch (error) {
      if (error instanceof McpError && error.code === ErrorCode.MethodNotFound) {
        // Fall back to additional tools
        return await this.additionalHandlers.handleTool(name, args);
      }
      throw error;
    }
  }

  /**
   * Filter tools based on filter options
   */
  private filterTools(tools: Tool[]): Tool[] {
    if (!this.filterOptions) {
      return tools;
    }

    // Define essential tools (core read operations)
    const essentialToolNames = new Set([
      'list_dashboards',
      'get_dashboard',
      'get_dashboard_cards',
      'get_dashboard_items',
      'list_cards',
      'execute_card',
      'get_card_dashboards',
      'list_databases',
      'get_database',
      'get_database_schema_tables',
      'get_database_schema_tables_for_schema',
      'get_database_schemas',
      'execute_query',
      'list_tables',
      'get_table',
      'list_collections',
      'get_collection_items',
      'list_users',
      'list_permission_groups',
      'search_content'
    ]);

    // Define write tools (tools that modify data)
    const writeToolNames = new Set([
      'create_dashboard',
      'update_dashboard',
      'delete_dashboard',
      'remove_card_from_dashboard',
      'update_dashboard_card',
      'post_dashboard_save',
      'post_dashboard_query',
      'post_dashboard_query_export',
      'put_dashboard_cards',
      'create_card',
      'update_card',
      'delete_card',
      'move_cards',
      'move_cards_to_collection',
      'copy_card',
      'create_database',
      'validate_database',
      'update_database',
      'delete_database',
      'update_table',
      'reorder_table_fields',
      'create_collection',
      'update_collection',
      'delete_collection',
      'move_to_collection'
    ]);

    const filteredTools = tools.filter(tool => {
      const isWriteTool = writeToolNames.has(tool.name);
      const isEssentialTool = essentialToolNames.has(tool.name);
      
      // If includeEssential is true, only include essential tools
      if (this.filterOptions!.includeEssential && !isEssentialTool) {
        return false;
      }
      
      // If includeWriteTools is true, only include write tools
      if (this.filterOptions!.includeWriteTools && !isWriteTool) {
        return false;
      }
      
      return true;
    });

    return filteredTools;
  }

}
