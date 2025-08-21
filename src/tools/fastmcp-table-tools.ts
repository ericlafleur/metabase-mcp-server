import { z } from "zod";
import { MetabaseClient } from "../client/metabase-client.js";

export function addTableTools(server: any, metabaseClient: MetabaseClient) {
  // GET /api/table - List tables (optional ids filter)
  server.addTool({
    name: "list_tables",
    description: "List tables with optional ids filter",
    parameters: z.object({
      ids: z
        .array(z.number())
        .optional()
        .describe("Optional list of table IDs to filter by"),
    }),
    execute: async (args: { ids?: number[] } = {}) => {
      try {
        const result = await metabaseClient.getTables(args.ids);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to list tables: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // PUT /api/table - Bulk update tables
  server.addTool({
    name: "update_tables",
    description: "Bulk update multiple tables",
    parameters: z.object({
      ids: z.array(z.number()).describe("IDs of tables to update"),
      updates: z.object({}).describe("Update payload applied to all tables"),
    }),
    execute: async (args: { ids: number[]; updates: any }) => {
      try {
        const result = await metabaseClient.updateTables(args.ids, args.updates);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to bulk update tables: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/table/{id} - Get table
  server.addTool({
    name: "get_table",
    description: "Get a table by ID",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
      include_sensitive_fields: z
        .boolean()
        .optional()
        .describe("Include sensitive fields"),
      include_hidden_fields: z
        .boolean()
        .optional()
        .describe("Include hidden fields"),
      include_editable_data_model: z
        .boolean()
        .optional()
        .describe("Include editable data model"),
    }),
    execute: async (args: {
      table_id: number;
      include_sensitive_fields?: boolean;
      include_hidden_fields?: boolean;
      include_editable_data_model?: boolean;
    }) => {
      try {
        const result = await metabaseClient.getTable(args.table_id, {
          include_sensitive_fields: args.include_sensitive_fields,
          include_hidden_fields: args.include_hidden_fields,
          include_editable_data_model: args.include_editable_data_model,
        });
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // PUT /api/table/{id} - Update table
  server.addTool({
    name: "update_table",
    description: "Update a table",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
      updates: z.object({}).describe("Fields to update"),
    }),
    execute: async (args: { table_id: number; updates: any }) => {
      try {
        const result = await metabaseClient.updateTable(
          args.table_id,
          args.updates
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to update table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/table/{id}/fks - Foreign keys
  server.addTool({
    name: "get_table_fks",
    description: "Get foreign keys for a table",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
    }),
    execute: async (args: { table_id: number }) => {
      try {
        const result = await metabaseClient.getTableFks(args.table_id);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get FKs for table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/table/{id}/query_metadata - Query metadata
  server.addTool({
    name: "get_table_query_metadata",
    description: "Get query metadata for a table",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
      include_sensitive_fields: z.boolean().optional(),
      include_hidden_fields: z.boolean().optional(),
      include_editable_data_model: z.boolean().optional(),
    }),
    execute: async (args: {
      table_id: number;
      include_sensitive_fields?: boolean;
      include_hidden_fields?: boolean;
      include_editable_data_model?: boolean;
    }) => {
      try {
        const result = await metabaseClient.getTableQueryMetadata(
          args.table_id,
          {
            include_sensitive_fields: args.include_sensitive_fields,
            include_hidden_fields: args.include_hidden_fields,
            include_editable_data_model: args.include_editable_data_model,
          }
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get query metadata for table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/table/{id}/related - Related tables/views
  server.addTool({
    name: "get_table_related",
    description: "Get related tables and fields",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
    }),
    execute: async (args: { table_id: number }) => {
      try {
        const result = await metabaseClient.getTableRelated(args.table_id);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get related entities for table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/table/card__{id}/fks - FKs for card virtual table
  server.addTool({
    name: "get_card_table_fks",
    description: "Get foreign keys for a card's virtual table (card__{id})",
    parameters: z.object({
      card_id: z.number().describe("Card ID for the virtual table"),
    }),
    execute: async (args: { card_id: number }) => {
      try {
        const result = await metabaseClient.getCardTableFks(args.card_id);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get FKs for card table card__${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/table/card__{id}/query_metadata - Query metadata for card virtual table
  server.addTool({
    name: "get_card_table_query_metadata",
    description: "Get query metadata for a card's virtual table (card__{id})",
    parameters: z.object({
      card_id: z.number().describe("Card ID for the virtual table"),
    }),
    execute: async (args: { card_id: number }) => {
      try {
        const result = await metabaseClient.getCardTableQueryMetadata(
          args.card_id
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to get query metadata for card table card__${args.card_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // POST /api/table/{id}/append-csv - Append CSV to table
  server.addTool({
    name: "append_csv_to_table",
    description: "Append CSV content to a table",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
      filename: z.string().describe("CSV filename (for metadata only)"),
      file_content: z.string().describe("CSV file content as string"),
    }),
    execute: async (args: {
      table_id: number;
      filename: string;
      file_content: string;
    }) => {
      try {
        const result = await metabaseClient.appendCsvToTable(
          args.table_id,
          args.filename,
          args.file_content
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to append CSV to table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // POST /api/table/{id}/discard_values - Discard cached field values
  server.addTool({
    name: "discard_table_field_values",
    description: "Discard cached field values for a table",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
    }),
    execute: async (args: { table_id: number }) => {
      try {
        const result = await metabaseClient.discardTableFieldValues(
          args.table_id
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to discard values for table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // PUT /api/table/{id}/fields/order - Reorder fields
  server.addTool({
    name: "reorder_table_fields",
    description: "Reorder fields for a table",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
      field_order: z
        .array(z.number())
        .describe("Array of field IDs in desired order"),
    }),
    execute: async (args: { table_id: number; field_order: number[] }) => {
      try {
        const result = await metabaseClient.reorderTableFields(
          args.table_id,
          args.field_order
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to reorder fields for table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // POST /api/table/{id}/replace-csv - Replace table data with CSV
  server.addTool({
    name: "replace_table_csv",
    description: "Replace table data with provided CSV (Metabase CSV model)",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
      csv_file: z.string().describe("CSV file content as string"),
    }),
    execute: async (args: { table_id: number; csv_file: string }) => {
      try {
        const result = await metabaseClient.replaceTableCsv(
          args.table_id,
          args.csv_file
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to replace CSV for table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // POST /api/table/{id}/rescan_values - Rescan field values
  server.addTool({
    name: "rescan_table_field_values",
    description: "Rescan cached field values for a table",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
    }),
    execute: async (args: { table_id: number }) => {
      try {
        const result = await metabaseClient.rescanTableFieldValues(
          args.table_id
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to rescan values for table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // POST /api/table/{id}/sync_schema - Trigger schema sync
  server.addTool({
    name: "sync_table_schema",
    description: "Trigger schema sync for a table",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
    }),
    execute: async (args: { table_id: number }) => {
      try {
        const result = await metabaseClient.syncTableSchema(args.table_id);
        return JSON.stringify(
          { table_id: args.table_id, status: "schema_sync_triggered", result },
          null,
          2
        );
      } catch (error) {
        throw new Error(
          `Failed to sync schema for table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // GET /api/table/{table-id}/data - Sample table data
  server.addTool({
    name: "get_table_data",
    description: "Fetch sample data from a table",
    parameters: z.object({
      table_id: z.number().describe("Table ID"),
      limit: z.number().optional().describe("Row limit (default 1000)"),
    }),
    execute: async (args: { table_id: number; limit?: number }) => {
      try {
        const result = await metabaseClient.getTableData(
          args.table_id,
          args.limit
        );
        return JSON.stringify(result, null, 2);
      } catch (error) {
        throw new Error(
          `Failed to fetch data for table ${args.table_id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });
}
