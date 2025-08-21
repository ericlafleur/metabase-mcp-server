import { z } from "zod";
import { MetabaseClient } from "../client/metabase-client.js";

export function addDatabaseTools(server: any, metabaseClient: MetabaseClient) {
  // GET /api/database - List all databases
  server.addTool({
    name: "list_databases",
    description: "Get all databases from Metabase",
    execute: async () => {
      try {
        const databases = await metabaseClient.getDatabases();
        return JSON.stringify(databases, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch databases: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/database/{id} - Get specific database details
  server.addTool({
    name: "get_database",
    description: "Get specific database details by ID",
    parameters: z.object({
      database_id: z.number().describe("The ID of the database to retrieve"),
    }),
    execute: async (args: { database_id: number }) => {
      try {
        const database = await metabaseClient.getDatabase(args.database_id);
        return JSON.stringify(database, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch database ${args.database_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/database - Create/add new database
  server.addTool({
    name: "create_database",
    description: "Add a new database connection to Metabase",
    parameters: z.object({
      engine: z.string().describe("Database engine type (e.g., postgres, mysql, redshift)"),
      name: z.string().describe("Display name for the database"),
      details: z.object({
        host: z.string().describe("Database host"),
        port: z.union([z.string(), z.number()]).describe("Database port"),
        db: z.string().describe("Database name"),
        user: z.string().describe("Database username"),
        password: z.string().describe("Database password"),
      }).passthrough().describe("Database connection details"),
      is_full_sync: z.boolean().optional().describe("Whether to perform full sync"),
      is_on_demand: z.boolean().optional().describe("Whether database is on-demand"),
      schedules: z.object({}).optional().describe("Sync schedules"),
    }),
    execute: async (args: { engine: string; name: string; details: any; is_full_sync?: boolean; is_on_demand?: boolean; schedules?: any }) => {
      try {
        const database = await metabaseClient.apiCall('POST', '/api/database', args);
        return JSON.stringify(database, null, 2);
      } catch (error) {
        throw new Error(`Failed to create database: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // PUT /api/database/{id} - Update database configuration
  server.addTool({
    name: "update_database",
    description: "Update database configuration",
    parameters: z.object({
      database_id: z.number().describe("The ID of the database to update"),
      name: z.string().optional().describe("New display name for the database"),
      engine: z.string().optional().describe("Database engine type"),
      details: z.object({}).optional().describe("Updated database connection details"),
      is_full_sync: z.boolean().optional().describe("Whether to perform full sync"),
      is_on_demand: z.boolean().optional().describe("Whether database is on-demand"),
      schedules: z.object({}).optional().describe("Updated sync schedules"),
    }),
    execute: async (args: { database_id: number; [key: string]: any }) => {
      try {
        const { database_id, ...updates } = args;
        const database = await metabaseClient.apiCall('PUT', `/api/database/${database_id}`, updates);
        return JSON.stringify(database, null, 2);
      } catch (error) {
        throw new Error(`Failed to update database ${args.database_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // DELETE /api/database/{id} - Remove database
  server.addTool({
    name: "delete_database",
    description: "Remove a database from Metabase",
    parameters: z.object({
      database_id: z.number().describe("The ID of the database to delete"),
    }),
    execute: async (args: { database_id: number }) => {
      try {
        await metabaseClient.apiCall('DELETE', `/api/database/${args.database_id}`);
        return JSON.stringify({
          database_id: args.database_id,
          action: "deleted",
          status: "success"
        }, null, 2);
      } catch (error) {
        throw new Error(`Failed to delete database ${args.database_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/database/validate - Validate database connection
  server.addTool({
    name: "validate_database",
    description: "Validate database connection details before creating",
    parameters: z.object({
      engine: z.string().describe("Database engine type (e.g., postgres, mysql, redshift)"),
      details: z.object({
        host: z.string().describe("Database host"),
        port: z.union([z.string(), z.number()]).describe("Database port"),
        db: z.string().describe("Database name"),
        user: z.string().describe("Database username"),
        password: z.string().describe("Database password"),
      }).passthrough().describe("Database connection details to validate"),
    }),
    execute: async (args: { engine: string; details: any }) => {
      try {
        const result = await metabaseClient.apiCall('POST', '/api/database/validate', args);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to validate database connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/database/sample_database - Add sample database
  server.addTool({
    name: "add_sample_database",
    description: "Add the Metabase sample database to your instance",
    execute: async () => {
      try {
        const database = await metabaseClient.apiCall('POST', '/api/database/sample_database');
        return JSON.stringify(database, null, 2);
      } catch (error) {
        throw new Error(`Failed to add sample database: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/database/{id}/healthcheck - Check database health
  server.addTool({
    name: "check_database_health",
    description: "Check the health/connectivity of a database",
    parameters: z.object({
      database_id: z.number().describe("The ID of the database to check"),
    }),
    execute: async (args: { database_id: number }) => {
      try {
        const result = await metabaseClient.apiCall('GET', `/api/database/${args.database_id}/healthcheck`);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(`Failed to check database health for ${args.database_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/database/{id}/metadata - Get database metadata
  server.addTool({
    name: "get_database_metadata",
    description: "Get complete metadata for a database including tables and fields",
    parameters: z.object({
      database_id: z.number().describe("The ID of the database"),
    }),
    execute: async (args: { database_id: number }) => {
      try {
        const metadata = await metabaseClient.apiCall('GET', `/api/database/${args.database_id}/metadata`);
        return JSON.stringify(metadata, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch metadata for database ${args.database_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/database/{id}/schemas - List all schemas in database
  server.addTool({
    name: "list_database_schemas",
    description: "List all schemas in a database",
    parameters: z.object({
      database_id: z.number().describe("The ID of the database"),
    }),
    execute: async (args: { database_id: number }) => {
      try {
        const schemas = await metabaseClient.apiCall('GET', `/api/database/${args.database_id}/schemas`);
        return JSON.stringify(schemas, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch schemas for database ${args.database_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // GET /api/database/{id}/schema/{schema} - Get specific schema details
  server.addTool({
    name: "get_database_schema",
    description: "Get details of a specific schema in a database",
    parameters: z.object({
      database_id: z.number().describe("The ID of the database"),
      schema_name: z.string().describe("The name of the schema"),
    }),
    execute: async (args: { database_id: number; schema_name: string }) => {
      try {
        const schema = await metabaseClient.apiCall('GET', `/api/database/${args.database_id}/schema/${encodeURIComponent(args.schema_name)}`);
        return JSON.stringify(schema, null, 2);
      } catch (error) {
        throw new Error(`Failed to fetch schema ${args.schema_name} for database ${args.database_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  // POST /api/database/{id}/sync_schema - Trigger schema sync
  server.addTool({
    name: "sync_database_schema",
    description: "Trigger a schema sync for a database to update metadata",
    parameters: z.object({
      database_id: z.number().describe("The ID of the database to sync"),
    }),
    execute: async (args: { database_id: number }) => {
      try {
        const result = await metabaseClient.apiCall('POST', `/api/database/${args.database_id}/sync_schema`);
        return JSON.stringify({
          database_id: args.database_id,
          action: "schema_sync_triggered",
          status: "success",
          result: result
        }, null, 2);
      } catch (error) {
        throw new Error(`Failed to sync schema for database ${args.database_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });
}
