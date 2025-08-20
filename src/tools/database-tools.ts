/**
 * Database tools configuration for config-driven tool registry
 */

import { ToolConfig, defaultResponseFormatter } from "../types/tool-config.js";
import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";

export const databaseTools: Record<string, ToolConfig> = {
  "list_databases": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      // Use getDatabases() method for simple case, apiCall for complex parameters
      if (!args.include && !args.include_analytics && !args.saved && 
          !args.include_editable_data_model && !args.exclude_uneditable_details && 
          !args.include_only_uploadable && !args.router_database_id) {
        const databases = await client.getDatabases();
        return defaultResponseFormatter(databases);
      }
      
      // For complex parameters, use apiCall
      const params = new URLSearchParams();
      if (args.include) params.append('include', args.include);
      if (args.include_analytics) params.append('include_analytics', args.include_analytics.toString());
      if (args.saved) params.append('saved', args.saved.toString());
      if (args.include_editable_data_model) params.append('include_editable_data_model', args.include_editable_data_model.toString());
      if (args.exclude_uneditable_details) params.append('exclude_uneditable_details', args.exclude_uneditable_details.toString());
      if (args.include_only_uploadable) params.append('include_only_uploadable', args.include_only_uploadable.toString());
      if (args.router_database_id) params.append('router_database_id', args.router_database_id.toString());

      const url = params.toString() ? `/api/database?${params.toString()}` : '/api/database';
      const databases = await client.apiCall("GET", url);
      
      return defaultResponseFormatter(databases);
    }
  },

  "create_database": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
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

      const database = await client.apiCall("POST", "/api/database", databaseData);
      return defaultResponseFormatter(database);
    }
  },

  "create_sample_database": {
    name: "create_sample_database",
    description: "Add the sample database as a new Database",
    inputSchema: {
      type: "object",
      properties: {}
    },
    handler: async (client: MetabaseClient, args: any) => {
      const database = await client.apiCall("POST", "/api/database/sample_database");
      return defaultResponseFormatter(database);
    }
  },

  "validate_database": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { details } = args;

      if (!details) {
        throw new McpError(ErrorCode.InvalidParams, "Details are required");
      }

      if (!details.details || !details.engine) {
        throw new McpError(ErrorCode.InvalidParams, "Details must contain 'details' object and 'engine' string");
      }

      const result = await client.apiCall("POST", "/api/database/validate", details);
      return defaultResponseFormatter(result);
    }
  },

  "get_database": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      // Use getDatabase() method for simple case, apiCall for complex parameters
      if (!args.include && !args.include_editable_data_model && !args.exclude_uneditable_details) {
        const database = await client.getDatabase(id);
        return defaultResponseFormatter(database);
      }
      
      // For complex parameters, use apiCall
      const params = new URLSearchParams();
      if (args.include) params.append('include', args.include);
      if (args.include_editable_data_model) params.append('include_editable_data_model', args.include_editable_data_model.toString());
      if (args.exclude_uneditable_details) params.append('exclude_uneditable_details', args.exclude_uneditable_details.toString());

      const url = params.toString() ? `/api/database/${id}?${params.toString()}` : `/api/database/${id}`;
      const database = await client.apiCall("GET", url);
      return defaultResponseFormatter(database);
    }
  },

  "update_database": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
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

      const database = await client.apiCall("PUT", `/api/database/${id}`, updateData);
      return defaultResponseFormatter(database);
    }
  },

  "delete_database": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const result = await client.apiCall("DELETE", `/api/database/${id}`);
      return defaultResponseFormatter(result);
    }
  },

  "discard_database_field_values": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const result = await client.apiCall("POST", `/api/database/${id}/discard_values`);
      return defaultResponseFormatter(result);
    }
  },

  "dismiss_database_spinner": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const result = await client.apiCall("POST", `/api/database/${id}/dismiss_spinner`);
      return defaultResponseFormatter(result);
    }
  },

  "get_database_fields": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const fields = await client.apiCall("GET", `/api/database/${id}/fields`);
      return defaultResponseFormatter(fields);
    }
  },

  "get_database_healthcheck": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const health = await client.apiCall("GET", `/api/database/${id}/healthcheck`);
      return defaultResponseFormatter(health);
    }
  },

  "get_database_idfields": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const idFields = await client.apiCall("GET", `/api/database/${id}/idfields`);
      return defaultResponseFormatter(idFields);
    }
  },

  "get_database_metadata": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const metadata = await client.apiCall("GET", `/api/database/${id}/metadata`);
      return defaultResponseFormatter(metadata);
    }
  },

  "rescan_database_field_values": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const result = await client.apiCall("POST", `/api/database/${id}/rescan_values`);
      return defaultResponseFormatter(result);
    }
  },

  "get_database_schema_tables": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const params = new URLSearchParams();
      if (args.include_hidden) params.append('include_hidden', args.include_hidden.toString());
      if (args.include_editable_data_model) params.append('include_editable_data_model', args.include_editable_data_model.toString());

      const url = params.toString() ? `/api/database/${id}/schema_tables?${params.toString()}` : `/api/database/${id}/schema_tables`;
      const schemaTables = await client.apiCall("GET", url);
      return defaultResponseFormatter(schemaTables);
    }
  },

  "get_database_schema_tables_for_schema": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id, schema } = args;

      if (!id || !schema) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID and schema are required");
      }

      const params = new URLSearchParams();
      if (args.include_hidden) params.append('include_hidden', args.include_hidden.toString());
      if (args.include_editable_data_model) params.append('include_editable_data_model', args.include_editable_data_model.toString());

      const url = params.toString() ? `/api/database/${id}/schema/${encodeURIComponent(schema)}?${params.toString()}` : `/api/database/${id}/schema/${encodeURIComponent(schema)}`;
      const tables = await client.apiCall("GET", url);
      return defaultResponseFormatter(tables);
    }
  },

  "get_database_schemas": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const params = new URLSearchParams();
      if (args.include_editable_data_model) params.append('include_editable_data_model', args.include_editable_data_model.toString());
      if (args.include_hidden) params.append('include_hidden', args.include_hidden.toString());

      const url = params.toString() ? `/api/database/${id}/schemas?${params.toString()}` : `/api/database/${id}/schemas`;
      const schemas = await client.apiCall("GET", url);
      return defaultResponseFormatter(schemas);
    }
  },

  "sync_database_schema": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const result = await client.apiCall("POST", `/api/database/${id}/sync_schema`);
      return defaultResponseFormatter(result);
    }
  },

  "get_database_syncable_schemas": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const schemas = await client.apiCall("GET", `/api/database/${id}/syncable_schemas`);
      return defaultResponseFormatter(schemas);
    }
  },

  "get_database_usage_info": {
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
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const usageInfo = await client.apiCall("GET", `/api/database/${id}/usage_info`);
      return defaultResponseFormatter(usageInfo);
    }
  },

  "execute_query": {
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
    handler: async (client: MetabaseClient, args: any) => {
      const { database_id, query, native_parameters } = args;

      if (!database_id || !query) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Database ID and query are required"
        );
      }

      // Use executeQuery() method from MetabaseClient
      const result = await client.executeQuery(database_id, query, native_parameters || []);
      return defaultResponseFormatter(result);
    }
  },

  "execute_query_export": {
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
    handler: async (client: MetabaseClient, args: any) => {
      const { export_format, query, format_rows = false, pivot_results = false, visualization_settings = {} } = args;

      if (!export_format || !query) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Export format and query are required"
        );
      }

      const exportPayload = {
        query,
        format_rows,
        pivot_results,
        visualization_settings,
      };

      const result = await client.apiCall("POST", `/api/dataset/${export_format}`, exportPayload);
      return defaultResponseFormatter(result);
    }
  },

  "get_database_autocomplete_suggestions": {
    name: "get_database_autocomplete_suggestions",
    description: "Get autocomplete suggestions for a database",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          minimum: 1,
          description: "Database ID"
        }
      },
      required: ["id"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const suggestions = await client.apiCall("GET", `/api/database/${id}/autocomplete_suggestions`);
      return defaultResponseFormatter(suggestions);
    }
  },

  "get_database_card_autocomplete_suggestions": {
    name: "get_database_card_autocomplete_suggestions",
    description: "Get card autocomplete suggestions for a database",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          minimum: 1,
          description: "Database ID"
        },
        prefix: {
          type: "string",
          description: "Prefix for autocomplete suggestions"
        }
      },
      required: ["id", "prefix"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id, prefix } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      if (!prefix) {
        throw new McpError(ErrorCode.InvalidParams, "Prefix is required");
      }

      const suggestions = await client.apiCall("GET", `/api/database/${id}/card_autocomplete_suggestions`, {
        prefix: prefix
      });
      
      return defaultResponseFormatter(suggestions);
    }
  },

  "get_database_schema_tables_without_schema": {
    name: "get_database_schema_tables_without_schema",
    description: "Get schema tables for a database without specifying schema",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          minimum: 1,
          description: "Database ID"
        },
        include_hidden: {
          type: "boolean",
          description: "Include hidden tables"
        },
        include_editable_data_model: {
          type: "boolean",
          description: "Only include tables for which the current user has data model editing permissions"
        }
      },
      required: ["id"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id, include_hidden, include_editable_data_model } = args;

      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Database ID is required");
      }

      const params = new URLSearchParams();
      if (include_hidden) params.append('include_hidden', include_hidden.toString());
      if (include_editable_data_model) params.append('include_editable_data_model', include_editable_data_model.toString());

      const url = params.toString() ? `/api/database/${id}/schema_tables_without_schema?${params.toString()}` : `/api/database/${id}/schema_tables_without_schema`;
      const schemaTables = await client.apiCall("GET", url);
      return defaultResponseFormatter(schemaTables);
    }
  },

  "get_virtual_database_datasets": {
    name: "get_virtual_database_datasets",
    description: "Get datasets for a virtual database",
    inputSchema: {
      type: "object",
      properties: {
        virtual_db: {
          type: "string",
          description: "Virtual database identifier"
        }
      },
      required: ["virtual_db"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { virtual_db } = args;

      if (!virtual_db) {
        throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier is required");
      }

      const datasets = await client.apiCall("GET", `/api/database/${virtual_db}/datasets`);
      return defaultResponseFormatter(datasets);
    }
  },

  "get_virtual_database_datasets_for_schema": {
    name: "get_virtual_database_datasets_for_schema",
    description: "Get datasets for a virtual database schema",
    inputSchema: {
      type: "object",
      properties: {
        virtual_db: {
          type: "string",
          description: "Virtual database identifier"
        },
        schema: {
          type: "string",
          description: "Schema name"
        }
      },
      required: ["virtual_db", "schema"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { virtual_db, schema } = args;

      if (!virtual_db || !schema) {
        throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier and schema are required");
      }

      const datasets = await client.apiCall("GET", `/api/database/${virtual_db}/schema/${encodeURIComponent(schema)}/datasets`);
      return defaultResponseFormatter(datasets);
    }
  },

  "get_virtual_database_metadata": {
    name: "get_virtual_database_metadata",
    description: "Get metadata for a virtual database",
    inputSchema: {
      type: "object",
      properties: {
        virtual_db: {
          type: "string",
          description: "Virtual database identifier"
        }
      },
      required: ["virtual_db"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { virtual_db } = args;

      if (!virtual_db) {
        throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier is required");
      }

      const metadata = await client.apiCall("GET", `/api/database/${virtual_db}/metadata`);
      return defaultResponseFormatter(metadata);
    }
  },

  "get_virtual_database_schema_tables": {
    name: "get_virtual_database_schema_tables",
    description: "Get schema tables for a virtual database",
    inputSchema: {
      type: "object",
      properties: {
        virtual_db: {
          type: "string",
          description: "Virtual database identifier"
        },
        schema: {
          type: "string",
          description: "Schema name"
        }
      },
      required: ["virtual_db", "schema"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { virtual_db, schema } = args;

      if (!virtual_db || !schema) {
        throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier and schema are required");
      }

      const tables = await client.apiCall("GET", `/api/database/${virtual_db}/schema/${encodeURIComponent(schema)}/tables`);
      return defaultResponseFormatter(tables);
    }
  },

  "get_virtual_database_schemas": {
    name: "get_virtual_database_schemas",
    description: "Get schemas for a virtual database",
    inputSchema: {
      type: "object",
      properties: {
        virtual_db: {
          type: "string",
          description: "Virtual database identifier"
        }
      },
      required: ["virtual_db"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { virtual_db } = args;

      if (!virtual_db) {
        throw new McpError(ErrorCode.InvalidParams, "Virtual database identifier is required");
      }

      const schemas = await client.apiCall("GET", `/api/database/${virtual_db}/schemas`);
      return defaultResponseFormatter(schemas);
    }
  }
};
