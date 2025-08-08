/**
 * Database-related tool handlers
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class DatabaseToolHandlers {
  constructor(private client: MetabaseClient) {}

  getToolSchemas(): Tool[] {
    return [
      {
        name: "list_databases",
        description: "Fetch all Databases. Optionally include tables, saved questions, and filter by permissions.",
        inputSchema: {
          type: "object",
          properties: {
            include: {
              type: "string",
              enum: ["tables"],
              description: "Include tables in the response"
            },
            include_analytics: {
              type: "boolean",
              default: false,
              description: "Include analytics information"
            },
            saved: {
              type: "boolean", 
              default: false,
              description: "Include saved questions virtual database"
            },
            include_editable_data_model: {
              type: "boolean",
              default: false,
              description: "Only include DBs for which the current user has data model editing permissions"
            },
            exclude_uneditable_details: {
              type: "boolean",
              default: false,
              description: "Only include DBs for which the current user can edit the DB details"
            },
            include_only_uploadable: {
              type: "boolean",
              default: false,
              description: "Only include DBs into which Metabase can insert new data"
            },
            router_database_id: {
              type: "integer",
              minimum: 1,
              description: "Router database ID filter"
            }
          }
        }
      },
      {
        name: "create_database",
        description: "Add a new Database",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 1,
              description: "Name of the database connection"
            },
            engine: {
              type: "string", 
              minLength: 1,
              description: "Database engine - must be a valid database engine"
            },
            details: {
              type: "object",
              description: "Connection details - must be a map"
            },
            auto_run_queries: {
              type: "boolean",
              description: "Whether to auto-run queries"
            },
            cache_ttl: {
              type: "integer",
              minimum: 1,
              description: "Cache TTL - must be an integer greater than zero"
            },
            connection_source: {
              type: "string",
              enum: ["admin", "setup"],
              default: "admin",
              description: "Connection source"
            },
            is_full_sync: {
              type: "boolean",
              default: true,
              description: "Whether to perform full schema sync"
            },
            is_on_demand: {
              type: "boolean", 
              default: false,
              description: "Whether this is an on-demand database"
            },
            schedules: {
              type: "object",
              description: "Schedule configuration - must be a valid map of schedule maps for a DB"
            }
          },
          required: ["name", "engine", "details"]
        }
      },
      {
        name: "create_sample_database",
        description: "Add the sample database as a new Database",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "validate_database",
        description: "Validate that we can connect to a database given a set of details",
        inputSchema: {
          type: "object",
          properties: {
            details: {
              type: "object",
              properties: {
                details: {
                  type: "object",
                  description: "Database connection details"
                },
                engine: {
                  type: "string",
                  minLength: 1,
                  description: "Database engine - must be a valid database engine"
                }
              },
              required: ["details", "engine"]
            }
          },
          required: ["details"]
        }
      },
      {
        name: "get_database",
        description: "Get a single Database with id. Optionally include tables and fields.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            },
            include: {
              type: "string",
              enum: ["tables", "tables.fields"],
              description: "Include tables or tables with fields"
            },
            include_editable_data_model: {
              type: "boolean",
              description: "Only return tables for which the current user has data model editing permissions"
            },
            exclude_uneditable_details: {
              type: "boolean", 
              description: "Exclude database details if user lacks edit permissions"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "update_database",
        description: "Update a Database",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            },
            name: {
              type: "string",
              minLength: 1,
              description: "Database name"
            },
            engine: {
              type: "string",
              minLength: 1,
              description: "Database engine"
            },
            details: {
              type: "object",
              description: "Connection details"
            },
            auto_run_queries: {
              type: "boolean",
              description: "Whether to auto-run queries"
            },
            cache_ttl: {
              type: "integer",
              minimum: 1,
              description: "Cache TTL in seconds"
            },
            caveats: {
              type: "string",
              description: "Database caveats"
            },
            description: {
              type: "string",
              description: "Database description"
            },
            points_of_interest: {
              type: "string",
              description: "Points of interest"
            },
            refingerprint: {
              type: "boolean",
              description: "Whether to refingerprint the database"
            },
            schedules: {
              type: "object",
              description: "Schedule configuration"
            },
            settings: {
              type: "object",
              description: "Database settings"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "delete_database",
        description: "Delete a Database",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      // {
      //   name: "get_database_autocomplete_suggestions",
      //   description: "Return a list of autocomplete suggestions for a database",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       id: {
      //         type: "integer",
      //         minimum: 1,
      //         description: "Database ID"
      //       }
      //     },
      //     required: ["id"]
      //   }
      // },
      // {
      //   name: "get_database_card_autocomplete_suggestions", 
      //   description: "Return a list of autocomplete suggestions for a database based on saved cards",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       id: {
      //         type: "integer",
      //         minimum: 1,
      //         description: "Database ID"
      //       },
      //       prefix: {
      //         type: "string",
      //         description: "Prefix to filter suggestions" 
      //       }
      //     },
      //     required: ["id", "prefix"]
      //   }
      // },
      {
        name: "discard_database_field_values",
        description: "Discard the FieldValues belonging to this Database",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "dismiss_database_spinner",
        description: "Dismiss the database sync spinner",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "get_database_fields",
        description: "Get all Fields belonging to a Database",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "get_database_healthcheck",
        description: "Check the health status of a database connection",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "get_database_idfields",
        description: "Get all ID fields for a Database",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "get_database_metadata",
        description: "Get metadata for a Database, including all tables and fields",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "rescan_database_field_values",
        description: "Rescan the FieldValues for a Database",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
//       {
//   name: "get_database_schema_tables_without_schema",
//   description: "Return a list of Tables for a Database whose schema is nil or empty string",
//   inputSchema: {
//     type: "object",
//     properties: {
//       id: {
//         type: "integer",
//         minimum: 1,
//         description: "Database ID"
//       },
//       include_hidden: {
//         type: "boolean",
//         default: false,
//         description: "Include hidden tables"
//       },
//       include_editable_data_model: {
//         type: "boolean",
//         default: false,
//         description: "Only include tables for which the current user has data model editing permissions"
//       }
//     },
//     required: ["id"]
//   }
// },
      {
        name: "get_database_schema_tables",
        description: "Returns a list of all the schemas with tables found for the database id. Excludes schemas with no tables.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            },
            include_hidden: {
              type: "boolean",
              default: false,
              description: "Include hidden schemas"
            },
            include_editable_data_model: {
              type: "boolean",
              default: false,
              description: "Only include schemas for which the current user has data model editing permissions"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "get_database_schema_tables_for_schema",
        description: "Returns a list of Tables for the given Database id and schema",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            },
            schema: {
              type: "string",
              description: "Schema name"
            },
            include_hidden: {
              type: "boolean",
              default: false,
              description: "Include hidden tables"
            },
            include_editable_data_model: {
              type: "boolean",
              default: false,
              description: "Only include tables for which the current user has data model editing permissions"
            }
          },
          required: ["id", "schema"]
        }
      },
      {
        name: "get_database_schemas",
        description: "Returns a list of all the schemas with tables found for the database id",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            },
            include_editable_data_model: {
              type: "boolean",
              default: false,
              description: "Only include schemas for which the current user has data model editing permissions"
            },
            include_hidden: {
              type: "boolean",
              default: false,
              description: "Include hidden schemas"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "sync_database_schema",
        description: "Trigger a manual update of the schema metadata for this Database",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "get_database_syncable_schemas",
        description: "Returns a list of all syncable schemas found for the database id",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "get_database_usage_info",
        description: "Get usage info for a database. Returns a map with keys are models and values are the number of entities that use this database",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              minimum: 1,
              description: "Database ID"
            }
          },
          required: ["id"]
        }
      },
      // {
      //   name: "get_virtual_database_datasets",
      //   description: "Returns a list of all the datasets found for the saved questions virtual database",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       virtual_db: {
      //         type: "string",
      //         description: "Virtual database identifier"
      //       }
      //     },
      //     required: ["virtual_db"]
      //   }
      // },
      // {
      //   name: "get_virtual_database_datasets_for_schema",
      //   description: "Returns a list of Tables for the datasets virtual database",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       virtual_db: {
      //         type: "string",
      //         description: "Virtual database identifier"
      //       },
      //       schema: {
      //         type: "string",
      //         description: "Schema name"
      //       }
      //     },
      //     required: ["virtual_db", "schema"]
      //   }
      // },
      // {
      //   name: "get_virtual_database_metadata",
      //   description: "Endpoint that provides metadata for the Saved Questions 'virtual' database",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       virtual_db: {
      //         type: "string",
      //         description: "Virtual database identifier"
      //       }
      //     },
      //     required: ["virtual_db"]
      //   }
      // },
      // {
      //   name: "get_virtual_database_schema_tables",
      //   description: "Returns a list of Tables for the saved questions virtual database",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       virtual_db: {
      //         type: "string",
      //         description: "Virtual database identifier"
      //       },
      //       schema: {
      //         type: "string",
      //         description: "Schema name"
      //       }
      //     },
      //     required: ["virtual_db", "schema"]
      //   }
      // },
      // {
      //   name: "get_virtual_database_schemas",
      //   description: "Returns a list of all the schemas found for the saved questions virtual database",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       virtual_db: {
      //         type: "string",
      //         description: "Virtual database identifier"
      //       }
      //     },
      //     required: ["virtual_db"]
      //   }
      // },
      {
        name: "execute_query",
        description: "Execute a SQL query against a Metabase database",
        inputSchema: {
          type: "object",
          properties: {
            database_id: {
              type: "number",
              description: "ID of the database to query",
            },
            query: { type: "string", description: "SQL query to execute" },
            native_parameters: {
              type: "array",
              description: "Optional parameters for the query",
              items: { type: "object" },
            },
          },
          required: ["database_id", "query"],
        },
      },
      {
        name: "execute_query_export",
        description: "Execute a query and download the result data as a file in the specified format",
        inputSchema: {
          type: "object",
          properties: {
            export_format: {
              type: "string",
              description: "Export format (e.g., csv, json, xlsx)",
            },
            query: {
              type: "object",
              description: "Query object to execute",
            },
            format_rows: {
              type: "boolean",
              default: false,
              description: "Whether to format rows",
            },
            pivot_results: {
              type: "boolean", 
              default: false,
              description: "Whether to pivot results",
            },
            visualization_settings: {
              type: "object",
              default: {},
              description: "Visualization settings object",
            },
          },
          required: ["export_format", "query"],
        },
      }
    ];
  }

  async handleTool(name: string, args: any): Promise<any> {
    switch (name) {
      case "list_databases":
        return await this.listDatabases();
      case "create_database":
        return await this.createDatabase(args);
      case "create_sample_database":
        return await this.createSampleDatabase();
      case "validate_database":
        return await this.validateDatabase(args);
      case "get_database":
        return await this.getDatabase(args);
      case "update_database":
        return await this.updateDatabase(args);
      case "delete_database":
        return await this.deleteDatabase(args);
      case "get_database_autocomplete_suggestions":
        return await this.getDatabaseAutocompleteSuggestions(args);
      case "get_database_card_autocomplete_suggestions":
        return await this.getDatabaseCardAutocompleteSuggestions(args);
      case "discard_database_field_values":
        return await this.discardDatabaseFieldValues(args);
      case "dismiss_database_spinner":
        return await this.dismissDatabaseSpinner(args);
      case "get_database_fields":
        return await this.getDatabaseFields(args);
      case "get_database_healthcheck":
        return await this.getDatabaseHealthcheck(args);
      case "get_database_idfields":
        return await this.getDatabaseIdFields(args);
      case "get_database_metadata":
        return await this.getDatabaseMetadata(args);
      case "rescan_database_field_values":
        return await this.rescanDatabaseFieldValues(args);
      case "get_database_schema_tables_without_schema":
        return await this.getDatabaseSchemaTablesWithoutSchema(args);
      case "get_database_schema_tables":
        return await this.getDatabaseSchemaTables(args);
      case "get_database_schema_tables_for_schema":
        return await this.getDatabaseSchemaTablesForSchema(args);
      case "get_database_schemas":
        return await this.getDatabaseSchemas(args);
      case "sync_database_schema":
        return await this.syncDatabaseSchema(args);
      case "get_database_syncable_schemas":
        return await this.getDatabaseSyncableSchemas(args);
      case "get_database_usage_info":
        return await this.getDatabaseUsageInfo(args);
      case "get_virtual_database_datasets":
        return await this.getVirtualDatabaseDatasets(args);
      case "get_virtual_database_datasets_for_schema":
        return await this.getVirtualDatabaseDatasetsForSchema(args);
      case "get_virtual_database_metadata":
        return await this.getVirtualDatabaseMetadata(args);
      case "get_virtual_database_schema_tables":
        return await this.getVirtualDatabaseSchemaTables(args);
      case "get_virtual_database_schemas":
        return await this.getVirtualDatabaseSchemas(args);
      case "execute_query":
        return await this.executeQuery(args);
      case "execute_query_export":
        return await this.executeQueryExport(args);
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown database tool: ${name}`
        );
    }
  }

  private async listDatabases(): Promise<any> {
    const databases = await this.client.getDatabases();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(databases, null, 2),
        },
      ],
    };
  }

  private async createDatabase(args: any): Promise<any> {
    const { name, engine, details } = args;

    if (!name || !engine || !details) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Name, engine, and details are required"
      );
    }

    const databaseData = {
      name,
      engine,
      details,
      ...(args.auto_run_queries !== undefined && { auto_run_queries: args.auto_run_queries }),
      ...(args.cache_ttl !== undefined && { cache_ttl: args.cache_ttl }),
      ...(args.connection_source !== undefined && { connection_source: args.connection_source }),
      ...(args.is_full_sync !== undefined && { is_full_sync: args.is_full_sync }),
      ...(args.is_on_demand !== undefined && { is_on_demand: args.is_on_demand }),
      ...(args.schedules !== undefined && { schedules: args.schedules }),
    };

    const database = await this.client.apiCall("POST", "/api/database", databaseData);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(database, null, 2),
        },
      ],
    };
  }

  private async createSampleDatabase(): Promise<any> {
    const database = await this.client.apiCall("POST", "/api/database/sample_database");
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(database, null, 2),
        },
      ],
    };
  }

  private async validateDatabase(args: any): Promise<any> {
    const { details } = args;

    if (!details) {
      throw new McpError(ErrorCode.InvalidParams, "Details are required");
    }

    if (!details.details || !details.engine) {
      throw new McpError(ErrorCode.InvalidParams, "Details must contain 'details' object and 'engine' string");
    }

    const result = await this.client.apiCall("POST", "/api/database/validate", details);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDatabase(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const params = new URLSearchParams();
    if (args.include) params.append('include', args.include);
    if (args.include_editable_data_model) params.append('include_editable_data_model', args.include_editable_data_model.toString());
    if (args.exclude_uneditable_details) params.append('exclude_uneditable_details', args.exclude_uneditable_details.toString());

    const url = params.toString() ? `/api/database/${id}?${params.toString()}` : `/api/database/${id}`;
    const database = await this.client.apiCall("GET", url);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(database, null, 2),
        },
      ],
    };
  }

  private async updateDatabase(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const updateData = {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.engine !== undefined && { engine: args.engine }),
      ...(args.details !== undefined && { details: args.details }),
      ...(args.auto_run_queries !== undefined && { auto_run_queries: args.auto_run_queries }),
      ...(args.cache_ttl !== undefined && { cache_ttl: args.cache_ttl }),
      ...(args.caveats !== undefined && { caveats: args.caveats }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.points_of_interest !== undefined && { points_of_interest: args.points_of_interest }),
      ...(args.refingerprint !== undefined && { refingerprint: args.refingerprint }),
      ...(args.schedules !== undefined && { schedules: args.schedules }),
      ...(args.settings !== undefined && { settings: args.settings }),
    };

    const database = await this.client.apiCall("PUT", `/api/database/${id}`, updateData);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(database, null, 2),
        },
      ],
    };
  }

  private async deleteDatabase(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const result = await this.client.apiCall("DELETE", `/api/database/${id}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDatabaseAutocompleteSuggestions(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const suggestions = await this.client.apiCall("GET", `/api/database/${id}/autocomplete_suggestions`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(suggestions, null, 2),
        },
      ],
    };
  }

private async getDatabaseCardAutocompleteSuggestions(args: any): Promise<any> {
  const { id, prefix } = args;

  if (!id) {
    throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
  }

  if (!prefix) {
    throw new McpError(ErrorCode.InvalidParams, "Prefix is required");
  }

  const params = new URLSearchParams();
  params.append('prefix', prefix);

  // Changed the endpoint URL to match Metabase's API
  const url = `/api/database/${id}/card_autocomplete_suggestions`;
  const suggestions = await this.client.apiCall("GET", url, {
    prefix: prefix
  });
  
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(suggestions, null, 2),
      },
    ],
  };
}

  private async discardDatabaseFieldValues(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const result = await this.client.apiCall("POST", `/api/database/${id}/discard_values`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async dismissDatabaseSpinner(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const result = await this.client.apiCall("POST", `/api/database/${id}/dismiss_spinner`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDatabaseFields(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const fields = await this.client.apiCall("GET", `/api/database/${id}/fields`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(fields, null, 2),
        },
      ],
    };
  }

  private async getDatabaseHealthcheck(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const health = await this.client.apiCall("GET", `/api/database/${id}/healthcheck`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(health, null, 2),
        },
      ],
    };
  }

  private async getDatabaseIdFields(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const idFields = await this.client.apiCall("GET", `/api/database/${id}/idfields`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(idFields, null, 2),
        },
      ],
    };
  }

  private async getDatabaseMetadata(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const metadata = await this.client.apiCall("GET", `/api/database/${id}/metadata`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(metadata, null, 2),
        },
      ],
    };
  }

  private async rescanDatabaseFieldValues(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const result = await this.client.apiCall("POST", `/api/database/${id}/rescan_values`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

    private async getDatabaseSchemaTablesWithoutSchema(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const params = new URLSearchParams();
    if (args.include_hidden) params.append('include_hidden', args.include_hidden.toString());
    if (args.include_editable_data_model) params.append('include_editable_data_model', args.include_editable_data_model.toString());

    const url = params.toString() ? `/api/database/${id}/schema/?${params.toString()}` : `/api/database/${id}/schema/`;
    const tables = await this.client.apiCall("GET", url);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tables, null, 2),
        },
      ],
    };
  }

  private async getDatabaseSchemaTables(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const params = new URLSearchParams();
    if (args.include_hidden !== undefined) {
      params.append('include_hidden', args.include_hidden.toString());
    }
    if (args.include_editable_data_model !== undefined) {
      params.append('include_editable_data_model', args.include_editable_data_model.toString());
    }

    // Changed URL to match Metabase's API endpoint
    const url = `/api/database/${id}/schemas`;
    const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;
    
    const schemas = await this.client.apiCall("GET", finalUrl);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(schemas, null, 2),
        },
      ],
    };
}

  private async getDatabaseSchemaTablesForSchema(args: any): Promise<any> {
    const { id, schema } = args;

    if (!id || !schema) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID and schema are required");
    }

    const params = new URLSearchParams();
    if (args.include_hidden) params.append('include_hidden', args.include_hidden.toString());
    if (args.include_editable_data_model) params.append('include_editable_data_model', args.include_editable_data_model.toString());

    const url = params.toString() ? `/api/database/${id}/schema/${schema}?${params.toString()}` : `/api/database/${id}/schema/${schema}`;
    const tables = await this.client.apiCall("GET", url);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tables, null, 2),
        },
      ],
    };
  }

  private async getDatabaseSchemas(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const params = new URLSearchParams();
    if (args.include_editable_data_model) params.append('include_editable_data_model', args.include_editable_data_model.toString());
    if (args.include_hidden) params.append('include_hidden', args.include_hidden.toString());

    const url = params.toString() ? `/api/database/${id}/schemas?${params.toString()}` : `/api/database/${id}/schemas`;
    const schemas = await this.client.apiCall("GET", url);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(schemas, null, 2),
        },
      ],
    };
  }

  private async syncDatabaseSchema(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const result = await this.client.apiCall("POST", `/api/database/${id}/sync_schema`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDatabaseSyncableSchemas(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const schemas = await this.client.apiCall("GET", `/api/database/${id}/syncable_schemas`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(schemas, null, 2),
        },
      ],
    };
  }

  private async getDatabaseUsageInfo(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
    }

    const usageInfo = await this.client.apiCall("GET", `/api/database/${id}/usage_info`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(usageInfo, null, 2),
        },
      ],
    };
  }

  private async getVirtualDatabaseDatasets(args: any): Promise<any> {
    const { virtual_db } = args;

    if (!virtual_db) {
      throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier is required");
    }

    const datasets = await this.client.apiCall("GET", `/api/database/${virtual_db}/datasets`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(datasets, null, 2),
        },
      ],
    };
  }

  private async getVirtualDatabaseDatasetsForSchema(args: any): Promise<any> {
    const { virtual_db, schema } = args;

    if (!virtual_db || !schema) {
      throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier and schema are required");
    }

    const datasets = await this.client.apiCall("GET", `/api/database/${virtual_db}/datasets/${schema}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(datasets, null, 2),
        },
      ],
    };
  }

  private async getVirtualDatabaseMetadata(args: any): Promise<any> {
    const { virtual_db } = args;

    if (!virtual_db) {
      throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier is required");
    }

    const metadata = await this.client.apiCall("GET", `/api/database/${virtual_db}/metadata`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(metadata, null, 2),
        },
      ],
    };
  }

  private async getVirtualDatabaseSchemaTables(args: any): Promise<any> {
    const { virtual_db, schema } = args;

    if (!virtual_db || !schema) {
      throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier and schema are required");
    }

    const tables = await this.client.apiCall("GET", `/api/database/${virtual_db}/schema/${schema}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tables, null, 2),
        },
      ],
    };
  }

  private async getVirtualDatabaseSchemas(args: any): Promise<any> {
    const { virtual_db } = args;

    if (!virtual_db) {
      throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier is required");
    }

    const schemas = await this.client.apiCall("GET", `/api/database/${virtual_db}/schemas`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(schemas, null, 2),
        },
      ],
    };
  }

  private async executeQuery(args: any): Promise<any> {
    const { database_id, query, native_parameters = [] } = args;

    if (!database_id || !query) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Database ID and query are required"
      );
    }

    const result = await this.client.executeQuery(
      database_id,
      query,
      native_parameters
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async executeQueryExport(args: any): Promise<any> {
    const { 
      export_format, 
      query, 
      format_rows = false, 
      pivot_results = false, 
      visualization_settings = {} 
    } = args;

    if (!export_format || !query) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Export format and query are required"
      );
    }

    const result = await this.client.executeQueryExport(
      export_format,
      query,
      format_rows,
      pivot_results,
      visualization_settings
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
}
