/**
 * Table-related tool handlers
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class TableToolHandlers {
  constructor(private client: MetabaseClient) {}

  getToolSchemas(): Tool[] {
    return [
      {
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
        }
      },
      {
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
        }
      },
      {
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
        }
      },
      // {
      //   name: "get_card_table_query_metadata",
      //   description: "Return metadata for the 'virtual' table for a Card",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       id: {
      //         type: "number",
      //         minimum: 1,
      //         description: "Card ID - value must be an integer greater than zero"
      //       }
      //     },
      //     required: ["id"]
      //   }
      // },
      {
        name: "get_table",
        description: "Get Table with ID",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "Table ID"
            },
            include_sensitive_fields: {
              type: "boolean",
              default: false,
              description: "Include sensitive fields in response"
            },
            include_hidden_fields: {
              type: "boolean",
              default: false,
              description: "Include hidden fields in response"
            },
            include_editable_data_model: {
              type: "boolean",
              default: false,
              description: "Include editable data model information"
            }
          },
          required: ["id"]
        }
      },
      {
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
        }
      },
      {
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
        }
      },
      {
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
        }
      },
      {
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
        }
      },
      {
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
        }
      },
      // {
      //   name: "get_table_query_metadata",
      //   description: "Get metadata about a Table useful for running queries. Returns DB, fields, field FKs, and field values. Passing include_hidden_fields=true will include any hidden Fields in the response. Passing include_sensitive_fields=true will include any sensitive Fields in the response. Passing include_editable_data_model=true will check that the current user has write permissions for the table's data model.",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       id: {
      //         type: "number",
      //         minimum: 1,
      //         description: "Table ID - value must be an integer greater than zero"
      //       },
      //       include_sensitive_fields: {
      //         type: "boolean",
      //         default: false,
      //         description: "Include sensitive fields in metadata"
      //       },
      //       include_hidden_fields: {
      //         type: "boolean",
      //         default: false,
      //         description: "Include hidden fields in metadata"
      //       },
      //       include_editable_data_model: {
      //         type: "boolean",
      //         default: false,
      //         description: "Check that the current user has write permissions for the table's data model"
      //       }
      //     },
      //     required: ["id"]
      //   }
      // },
      {
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
        }
      },
      {
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
        }
      },
      {
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
        }
      },
      // {
      //   name: "sync_table_schema",
      //   description: "Trigger manual schema update for table",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       id: {
      //         type: "number",
      //         minimum: 1,
      //         description: "Table ID - value must be an integer greater than zero"
      //       }
      //     },
      //     required: ["id"]
      //   }
      // },
      // {
      //   name: "get_table_data",
      //   description: "Get the data for the given table",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       table_id: {
      //         type: "number",
      //         minimum: 1,
      //         description: "Table ID - value must be an integer greater than zero"
      //       },
      //       limit: {
      //         type: "number",
      //         minimum: 1,
      //         description: "Maximum number of rows to return (default: 1000 to prevent timeouts)"
      //       }
      //     },
      //     required: ["table_id"]
      //   }
      // }
    ];
  }

  async handleTool(name: string, args: any): Promise<any> {
    switch (name) {
      case "list_tables":
        return await this.listTables(args);
      case "update_tables":
        return await this.updateTables(args);
      case "get_card_table_fks":
        return await this.getCardTableFks(args);
      case "get_card_table_query_metadata":
        return await this.getCardTableQueryMetadata(args);
      case "get_table":
        return await this.getTable(args);
      case "update_table":
        return await this.updateTable(args);
      case "append_csv_to_table":
        return await this.appendCsvToTable(args);
      case "discard_table_field_values":
        return await this.discardTableFieldValues(args);
      case "reorder_table_fields":
        return await this.reorderTableFields(args);
      case "get_table_fks":
        return await this.getTableFks(args);
      case "get_table_query_metadata":
        return await this.getTableQueryMetadata(args);
      case "get_table_related":
        return await this.getTableRelated(args);
      case "replace_table_csv":
        return await this.replaceTableCsv(args);
      case "rescan_table_field_values":
        return await this.rescanTableFieldValues(args);
      case "sync_table_schema":
        return await this.syncTableSchema(args);
      case "get_table_data":
        return await this.getTableData(args);
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown table tool: ${name}`
        );
    }
  }

  private async listTables(args: any): Promise<any> {
    const tables = await this.client.getTables(args.ids);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tables, null, 2),
        },
      ],
    };
  }

  private async updateTables(args: any): Promise<any> {
    const { ids, updates } = args;

    if (!ids || !updates) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table IDs and updates are required"
      );
    }

    const result = await this.client.updateTables(ids, updates);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getCardTableFks(args: any): Promise<any> {
    const { card_id } = args;

    if (!card_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Card ID is required"
      );
    }

    const fks = await this.client.getCardTableFks(card_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(fks, null, 2),
        },
      ],
    };
  }

  private async getCardTableQueryMetadata(args: any): Promise<any> {
    const { id } = args;

    if (!id || id < 1) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Card ID is required and must be greater than zero"
      );
    }

    const metadata = await this.client.getCardTableQueryMetadata(id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(metadata, null, 2),
        },
      ],
    };
  }

  private async getTable(args: any): Promise<any> {
    const { id, include_sensitive_fields, include_hidden_fields, include_editable_data_model } = args;

    if (!id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required"
      );
    }

    const table = await this.client.getTable(id, {
      include_sensitive_fields,
      include_hidden_fields,
      include_editable_data_model
    });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(table, null, 2),
        },
      ],
    };
  }

  private async updateTable(args: any): Promise<any> {
    const { id, ...updateData } = args;

    if (!id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required"
      );
    }

    const result = await this.client.updateTable(id, updateData);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async appendCsvToTable(args: any): Promise<any> {
    const { id, filename, file_content } = args;

    if (!id || id < 1) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required and must be greater than zero"
      );
    }

    if (!filename) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Filename is required"
      );
    }

    if (!file_content) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "File content is required"
      );
    }

    const result = await this.client.appendCsvToTable(id, filename, file_content);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async discardTableFieldValues(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required"
      );
    }

    const result = await this.client.discardTableFieldValues(id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async reorderTableFields(args: any): Promise<any> {
    const { id, field_order } = args;

    if (!id || id < 1) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required and must be greater than zero"
      );
    }

    if (!field_order || !Array.isArray(field_order)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Field order array is required"
      );
    }

    const result = await this.client.reorderTableFields(id, field_order);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getTableFks(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required"
      );
    }

    const fks = await this.client.getTableFks(id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(fks, null, 2),
        },
      ],
    };
  }

  private async getTableQueryMetadata(args: any): Promise<any> {
    const { id, include_sensitive_fields, include_hidden_fields, include_editable_data_model } = args;

    if (!id || id < 1) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required and must be greater than zero"
      );
    }

    const metadata = await this.client.getTableQueryMetadata(id, {
      include_sensitive_fields,
      include_hidden_fields,
      include_editable_data_model
    });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(metadata, null, 2),
        },
      ],
    };
  }

  private async getTableRelated(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required"
      );
    }

    const related = await this.client.getTableRelated(id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(related, null, 2),
        },
      ],
    };
  }

  private async replaceTableCsv(args: any): Promise<any> {
    const { id, csv_file } = args;

    if (!id || id < 1) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required and must be greater than zero"
      );
    }

    if (!csv_file) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "CSV file is required"
      );
    }

    const result = await this.client.replaceTableCsv(id, csv_file);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async rescanTableFieldValues(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required"
      );
    }

    const result = await this.client.rescanTableFieldValues(id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async syncTableSchema(args: any): Promise<any> {
    const { id } = args;

    if (!id || id < 1) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required and must be greater than zero"
      );
    }

    const result = await this.client.syncTableSchema(id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getTableData(args: any): Promise<any> {
    const { table_id, limit } = args;

    if (!table_id || table_id < 1) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Table ID is required and must be greater than zero"
      );
    }

    const data = await this.client.getTableData(table_id, limit);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
}
