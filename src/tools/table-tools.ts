/**
 * Table tools configuration for config-driven tool registry
 */

import { ToolConfig, defaultResponseFormatter } from "../types/tool-config.js";
import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";

export const tableTools: Record<string, ToolConfig> = {
  list_tables: {
    name: "list_tables",
    description: "Get all Tables. Optionally include additional metadata.",
    inputSchema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          items: { type: "number" },
          description: "Optional list of table IDs to filter by"
        }
      }
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { ids } = args;
      const tables = await client.getTables(ids);
      return defaultResponseFormatter(tables);
    }
  },

  update_tables: {
    name: "update_tables",
    description: "Update all Tables in ids",
    inputSchema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          items: { type: "number" },
          description: "List of table IDs to update"
        },
        updates: {
          type: "object",
          description: "Update data for the tables"
        }
      },
      required: ["ids", "updates"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { ids, updates } = args;
      
      if (!ids || !updates) {
        throw new McpError(ErrorCode.InvalidParams, "Table IDs and updates are required");
      }
      
      const result = await client.updateTables(ids, updates);
      return defaultResponseFormatter(result);
    }
  },

  get_card_table_fks: {
    name: "get_card_table_fks",
    description: "Return FK info for virtual table for a Card",
    inputSchema: {
      type: "object",
      properties: {
        card_id: {
          type: "number",
          description: "ID of the card"
        }
      },
      required: ["card_id"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { card_id } = args;
      
      if (!card_id) {
        throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
      }
      
      const response = await client.getCardTableFks(card_id);
      return defaultResponseFormatter(response);
    }
  },

  get_table: {
    name: "get_table",
    description: "Get Table with ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "Table ID"
        },
        include_editable_data_model: {
          type: "boolean",
          description: "Include editable data model information"
        },
        include_hidden_fields: {
          type: "boolean",
          description: "Include hidden fields in response"
        },
        include_sensitive_fields: {
          type: "boolean",
          description: "Include sensitive fields in response"
        }
      },
      required: ["id"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id, include_editable_data_model, include_hidden_fields, include_sensitive_fields } = args;
      
      if (!id) {
        throw new McpError(ErrorCode.InvalidRequest, "Table ID is required");
      }
      
      const response = await client.getTable(id, {
        include_editable_data_model,
        include_hidden_fields,
        include_sensitive_fields
      });
      return defaultResponseFormatter(response);
    }
  },

  update_table: {
    name: "update_table",
    description: "Update Table with ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "Table ID"
        },
        display_name: {
          type: "string",
          description: "Display name for the table"
        },
        entity_type: {
          type: "string",
          description: "Entity type of the table"
        },
        visibility_type: {
          type: "string",
          enum: ["normal", "hidden", "technical", "cruft"],
          description: "Visibility type of the table"
        },
        description: {
          type: "string",
          description: "Description of the table"
        },
        caveats: {
          type: "string",
          description: "Caveats about the table"
        },
        points_of_interest: {
          type: "string",
          description: "Points of interest about the table"
        }
      },
      required: ["id"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id, ...updateData } = args;
      
      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
      }
      
      const response = await client.updateTable(id, updateData);
      return defaultResponseFormatter(response);
    }
  },

  append_csv_to_table: {
    name: "append_csv_to_table",
    description: "Inserts the rows of an uploaded CSV file into the table identified by :id. The table must have been created by uploading a CSV file.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          minimum: 1,
          description: "Table ID - value must be an integer greater than zero"
        },
        filename: {
          type: "string",
          description: "Name of the CSV file to upload"
        },
        file_content: {
          type: "string",
          description: "CSV file content as string or file path"
        }
      },
      required: ["id", "filename", "file_content"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id, filename, file_content } = args;
      
      if (!id || id < 1) {
        throw new McpError(ErrorCode.InvalidParams, "Table ID is required and must be greater than zero");
      }
      
      if (!filename || !file_content) {
        throw new McpError(ErrorCode.InvalidParams, "Filename and file content are required");
      }
      
      const response = await client.appendCsvToTable(id, filename, file_content);
      return defaultResponseFormatter(response);
    }
  },

  discard_table_field_values: {
    name: "discard_table_field_values",
    description: "Discard FieldValues for table",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "Table ID"
        }
      },
      required: ["id"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;
      
      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
      }
      
      const response = await client.discardTableFieldValues(id);
      return defaultResponseFormatter(response);
    }
  },

  reorder_table_fields: {
    name: "reorder_table_fields",
    description: "Reorder fields in a table",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          minimum: 1,
          description: "Table ID - value must be an integer greater than zero"
        },
        field_order: {
          type: "array",
          items: { type: "number" },
          description: "Array of field IDs in desired order"
        }
      },
      required: ["id", "field_order"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id, field_order } = args;
      
      if (!id || id < 1) {
        throw new McpError(ErrorCode.InvalidParams, "Table ID is required and must be greater than zero");
      }
      
      if (!field_order || !Array.isArray(field_order)) {
        throw new McpError(ErrorCode.InvalidParams, "Field order array is required");
      }
      
      const response = await client.reorderTableFields(id, field_order);
      return defaultResponseFormatter(response);
    }
  },

  get_table_fks: {
    name: "get_table_fks",
    description: "Get foreign keys for table",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "Table ID"
        }
      },
      required: ["id"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;
      
      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
      }
      
      const response = await client.getTableFks(id);
      return defaultResponseFormatter(response);
    }
  },

  get_table_related: {
    name: "get_table_related",
    description: "Return related entities for a table",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "Table ID"
        }
      },
      required: ["id"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;
      
      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
      }
      
      const response = await client.getTableRelated(id);
      return defaultResponseFormatter(response);
    }
  },

  replace_table_csv: {
    name: "replace_table_csv",
    description: "Replaces the contents of the table identified by :id with the rows of an uploaded CSV file. The table must have been created by uploading a CSV file.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          minimum: 1,
          description: "Table ID - value must be an integer greater than zero"
        },
        csv_file: {
          type: "string",
          description: "CSV file content or file path to upload"
        }
      },
      required: ["id", "csv_file"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id, csv_file } = args;
      
      if (!id || id < 1) {
        throw new McpError(ErrorCode.InvalidParams, "Table ID is required and must be greater than zero");
      }
      
      if (!csv_file) {
        throw new McpError(ErrorCode.InvalidParams, "CSV file is required");
      }
      
      const response = await client.replaceTableCsv(id, csv_file);
      return defaultResponseFormatter(response);
    }
  },

  rescan_table_field_values: {
    name: "rescan_table_field_values",
    description: "Trigger FieldValues update for table",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "Table ID"
        }
      },
      required: ["id"]
    },
    handler: async (client: MetabaseClient, args: any) => {
      const { id } = args;
      
      if (!id) {
        throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
      }
      
      const response = await client.rescanTableFieldValues(id);
      return defaultResponseFormatter(response);
    }
  }
};
