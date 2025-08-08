/**
 * Dashboard-related tool handlers
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class DashboardToolHandlers {
  constructor(private client: MetabaseClient) {}

  getToolSchemas(): Tool[] {
    return [
      {
        name: "list_dashboards",
        description: "List all dashboards in Metabase",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "create_dashboard",
        description: "Create a new Metabase dashboard",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the dashboard" },
            description: {
              type: "string",
              description: "Optional description for the dashboard",
            },
            parameters: {
              type: "array",
              description: "Optional parameters for the dashboard",
              items: { type: "object" },
            },
            collection_id: {
              type: "number",
              description:
                "Optional ID of the collection to save the dashboard in",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "update_dashboard",
        description: "Update an existing Metabase dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard to update",
            },
            name: { type: "string", description: "New name for the dashboard" },
            description: {
              type: "string",
              description: "New description for the dashboard",
            },
            parameters: {
              type: "array",
              description: "New parameters for the dashboard",
              items: { type: "object" },
            },
            collection_id: { type: "number", description: "New collection ID" },
            archived: {
              type: "boolean",
              description: "Set to true to archive the dashboard",
            },
          },
          required: ["dashboard_id"],
        },
      },
      {
        name: "delete_dashboard",
        description: "Delete a Metabase dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard to delete",
            },
            hard_delete: {
              type: "boolean",
              description:
                "Set to true for hard delete, false (default) for archive",
              default: false,
            },
          },
          required: ["dashboard_id"],
        },
      },
      {
        name: "get_dashboard_cards",
        description: "Get all cards in a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
          },
          required: ["dashboard_id"],
        },
      },
      // {
      //   name: "add_card_to_dashboard",
      //   description: "(DEPRECATED -- Use the PUT /api/dashboard/:id endpoint instead.) Update Cards and Tabs on a Dashboard",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       dashboard_id: {
      //         type: "number",
      //         description: "ID of the dashboard",
      //         minimum: 1,
      //       },
      //       cards: {
      //         type: "array",
      //         description: "Array of dashboard cards",
      //         items: {
      //           type: "object",
      //           properties: {
      //             id: {
      //               type: "number",
      //               description: "DashboardCard ID",
      //             },
      //             col: {
      //               type: "number",
      //               description: "Column position",
      //               minimum: 0,
      //             },
      //             row: {
      //               type: "number",
      //               description: "Row position",
      //               minimum: 0,
      //             },
      //             size_x: {
      //               type: "number",
      //               description: "Width in grid units",
      //               minimum: 1,
      //             },
      //             size_y: {
      //               type: "number",
      //               description: "Height in grid units",
      //               minimum: 1,
      //             },
      //             parameter_mappings: {
      //               type: "array",
      //               description: "Parameter mappings for the card",
      //               items: { type: "object" },
      //             },
      //             series: {
      //               type: "array",
      //               description: "Series data for the card",
      //               items: { type: "object" },
      //             },
      //           },
      //           required: ["id", "col", "row", "size_x", "size_y"],
      //         },
      //       },
      //       tabs: {
      //         type: "array",
      //         description: "Array of dashboard tabs",
      //         items: {
      //           type: "object",
      //           properties: {
      //             id: {
      //               type: "number",
      //               description: "DashboardTab ID",
      //             },
      //             name: {
      //               type: "string",
      //               description: "Tab name",
      //               minLength: 1,
      //             },
      //           },
      //           required: ["id", "name"],
      //         },
      //       },
      //     },
      //     required: ["dashboard_id", "cards"],
      //   },
      // },
      {
        name: "remove_card_from_dashboard",
        description: "Remove a card from a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
            dashcard_id: {
              type: "number",
              description: "ID of the dashboard card (not the card itself)",
            },
          },
          required: ["dashboard_id", "dashcard_id"],
        },
      },
      {
        name: "update_dashboard_card",
        description: "Update card position, size, and settings on a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
            dashcard_id: {
              type: "number",
              description: "ID of the dashboard card",
            },
            row: {
              type: "number",
              description: "New row position",
            },
            col: {
              type: "number",
              description: "New column position",
            },
            size_x: {
              type: "number",
              description: "New width in grid units",
            },
            size_y: {
              type: "number",
              description: "New height in grid units",
            },
            parameter_mappings: {
              type: "array",
              description: "Updated parameter mappings",
              items: { type: "object" },
            },
            visualization_settings: {
              type: "object",
              description: "Updated visualization settings",
            },
          },
          required: ["dashboard_id", "dashcard_id"],
        },
      },
      {
        name: "get_dashboard_embeddable",
        description: "Get embeddable dashboards",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_dashboard_params_valid_filter_fields",
        description: "Get valid filter fields for dashboard parameters",
        inputSchema: {
          type: "object",
          properties: {
            filtered: {
              type: "array",
              description: "Array of field IDs that are being filtered",
              items: { type: "number" },
            },
            filtering: {
              type: "array",
              description: "Array of field IDs that are doing the filtering",
              items: { type: "number" },
            },
          },
          required: ["filtered"],
        },
      },
      // {
      //   name: "post_dashboard_pivot_query",
      //   description: "Execute a pivot query for a dashboard card",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       dashboard_id: {
      //         type: "number",
      //         description: "ID of the dashboard",
      //         minimum: 1,
      //       },
      //       dashcard_id: {
      //         type: "number",
      //         description: "ID of the dashboard card",
      //         minimum: 1,
      //       },
      //       card_id: {
      //         type: "number",
      //         description: "ID of the card",
      //         minimum: 1,
      //       },
      //       parameters: {
      //         type: "array",
      //         description: "Optional parameters for the pivot query",
      //         items: {
      //           type: "object",
      //           properties: {
      //             id: {
      //               type: "string",
      //               description: "Parameter ID",
      //               minLength: 1,
      //             },
      //           },
      //           required: ["id"],
      //         },
      //       },
      //     },
      //     required: ["dashboard_id", "dashcard_id", "card_id"],
      //   },
      // },
      {
        name: "get_dashboard_public",
        description: "Get public dashboards",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "post_dashboard_save",
        description: "Save a denormalized description of dashboard",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Optional name of the dashboard"
            },
            description: {
              type: "string",
              description: "Optional description of the dashboard",
            },
            parameters: {
              type: "array",
              description: "Optional dashboard parameters",
              items: { type: "object" },
            },
            cards: {
              type: "array",
              description: "Optional dashboard cards",
              items: { type: "object" },
            },
          },
          required: [],
        },
      },
      // {
      //   name: "post_dashboard_save_to_collection",
      //   description: "Save a denormalized description of dashboard into collection with ID :parent-collection-id",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       parent_collection_id: {
      //         type: "number",
      //         description: "ID of the parent collection",
      //         minimum: 1,
      //       },
      //       name: {
      //         type: "string",
      //         description: "Name of the dashboard",
      //         minLength: 1,
      //       },
      //       description: {
      //         type: "string",
      //         description: "Optional description of the dashboard",
      //       },
      //       parameters: {
      //         type: "array",
      //         description: "Optional dashboard parameters",
      //         items: { type: "object" },
      //       },
      //       cards: {
      //         type: "array",
      //         description: "Optional dashboard cards",
      //         items: { type: "object" },
      //       },
      //     },
      //     required: ["parent_collection_id", "name"],
      //   },
      // },
      {
        name: "post_dashboard_query",
        description: "Execute a query for a dashboard card",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
            dashcard_id: {
              type: "number",
              description: "ID of the dashboard card",
            },
            card_id: {
              type: "number",
              description: "ID of the card",
            },
            dashboard_load_id: {
              type: "string",
              description: "Dashboard load identifier",
            },
            parameters: {
              type: "array",
              description: "Query parameters",
              items: { type: "object" },
            },
          },
          required: ["dashboard_id", "dashcard_id", "card_id"],
        },
      },
      {
        name: "post_dashboard_query_export",
        description: "Run the query associated with a Saved Question (Card) in the context of a Dashboard that includes it, and return its results as a file in the specified format",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
              minimum: 1,
            },
            dashcard_id: {
              type: "number",
              description: "ID of the dashboard card",
              minimum: 1,
            },
            card_id: {
              type: "number",
              description: "ID of the card",
              minimum: 1,
            },
            export_format: {
              type: "string",
              description: "Export format (csv, xlsx, json)",
              enum: ["csv", "xlsx", "json"],
            },
            format_rows: {
              type: "boolean",
              description: "Whether to format rows",
              default: false,
            },
            pivot_results: {
              type: "boolean",
              description: "Whether to pivot results",
              default: false,
            },
            parameters: {
              type: "array",
              description: "Query parameters array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "Parameter ID",
                    minLength: 1,
                  },
                },
                required: ["id"],
              },
              default: [],
            },
          },
          required: ["dashboard_id", "dashcard_id", "card_id", "export_format"],
        },
      },
      // {
      //   name: "get_dashboard_execute",
      //   description: "Fetches the values for filling in execution parameters. Pass PK parameters and values to select",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       dashboard_id: {
      //         type: "number",
      //         description: "ID of the dashboard",
      //         minimum: 1,
      //       },
      //       dashcard_id: {
      //         type: "number",
      //         description: "ID of the dashboard card",
      //         minimum: 1,
      //       },
      //       parameters: {
      //         type: "string",
      //         description: "Query parameters as valid JSON string",
      //       },
      //     },
      //     required: ["dashboard_id", "dashcard_id"],
      //   },
      // },
      // {
      //   name: "post_dashboard_execute",
      //   description: "Execute the associated Action in the context of a Dashboard and DashboardCard that includes it",
      //   inputSchema: {
      //     type: "object",
      //     properties: {
      //       dashboard_id: {
      //         type: "number",
      //         description: "ID of the dashboard",
      //         minimum: 1,
      //       },
      //       dashcard_id: {
      //         type: "number",
      //         description: "ID of the dashboard card",
      //         minimum: 1,
      //       },
      //       parameters: {
      //         type: "object",
      //         description: "Mapped dashboard parameters with values",
      //         additionalProperties: true,
      //       },
      //     },
      //     required: ["dashboard_id", "dashcard_id"],
      //   },
      // },
      {
        name: "post_dashboard_public_link",
        description: "Create a public link for a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
          },
          required: ["dashboard_id"],
        },
      },
      {
        name: "delete_dashboard_public_link",
        description: "Delete a public link for a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
          },
          required: ["dashboard_id"],
        },
      },
      {
        name: "post_dashboard_copy",
        description: "Copy a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            from_dashboard_id: {
              type: "number",
              description: "ID of the dashboard to copy from",
            },
            name: {
              type: "string",
              description: "Name for the new dashboard",
            },
            description: {
              type: "string",
              description: "Description for the new dashboard",
            },
            collection_id: {
              type: "number",
              description: "ID of the collection to save the copy in",
            },
          },
          required: ["from_dashboard_id"],
        },
      },
      {
        name: "get_dashboard",
        description: "Get a specific dashboard by ID",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
          },
          required: ["dashboard_id"],
        },
      },
      {
        name: "put_dashboard_cards",
        description: "Update all cards in a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
            cards: {
              type: "array",
              description: "Array of dashboard cards",
              items: { type: "object" },
            },
          },
          required: ["dashboard_id", "cards"],
        },
      },
      {
        name: "get_dashboard_items",
        description: "Get all items in a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
          },
          required: ["dashboard_id"],
        },
      },
      {
        name: "get_dashboard_param_remapping",
        description: "Fetch the remapped value for a given value of the parameter with ID :param-key",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
              minimum: 1,
            },
            param_key: {
              type: "string",
              description: "Parameter key",
            },
            value: {
              type: "string",
              description: "Value to fetch remapping for",
            },
          },
          required: ["dashboard_id", "param_key", "value"],
        },
      },
      {
        name: "get_dashboard_param_search",
        description: "Fetch possible values of the parameter whose ID is :param-key that contain :query. Optionally restrict values by passing query parameters like other-parameter=value",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
              minimum: 1,
            },
            param_key: {
              type: "string",
              description: "Parameter key",
            },
            query: {
              type: "string",
              description: "Search query",
              minLength: 1,
            },
            query_params: {
              type: "object",
              description: "Optional query parameters to filter search results (e.g., {\"def\": \"100\"})",
              additionalProperties: true,
            },
          },
          required: ["dashboard_id", "param_key", "query"],
        },
      },
      {
        name: "get_dashboard_param_values",
        description: "Fetch possible values of the parameter whose ID is :param-key. Optionally restrict values by passing query parameters like other-parameter=value",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
              minimum: 1,
            },
            param_key: {
              type: "string",
              description: "Parameter key",
            },
            query_params: {
              type: "object",
              description: "Optional query parameters to filter values (e.g., {\"def\": \"100\"})",
              additionalProperties: true,
            },
          },
          required: ["dashboard_id", "param_key"],
        },
      },
      {
        name: "get_dashboard_query_metadata",
        description: "Get query metadata for a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
          },
          required: ["dashboard_id"],
        },
      },
      {
        name: "get_dashboard_related",
        description: "Get related items for a dashboard",
        inputSchema: {
          type: "object",
          properties: {
            dashboard_id: {
              type: "number",
              description: "ID of the dashboard",
            },
          },
          required: ["dashboard_id"],
        },
      },
    ];
  }

  async handleTool(name: string, args: any): Promise<any> {
    switch (name) {
      case "list_dashboards":
        return await this.listDashboards();

      case "create_dashboard":
        return await this.createDashboard(args);

      case "update_dashboard":
        return await this.updateDashboard(args);

      case "delete_dashboard":
        return await this.deleteDashboard(args);

      case "get_dashboard_cards":
        return await this.getDashboardCards(args);

      case "add_card_to_dashboard":
        return await this.addCardToDashboard(args);

      case "remove_card_from_dashboard":
        return await this.removeCardFromDashboard(args);

      case "update_dashboard_card":
        return await this.updateDashboardCard(args);

      case "get_dashboard_embeddable":
        return await this.getDashboardEmbeddable();

      case "get_dashboard_params_valid_filter_fields":
        return await this.getDashboardParamsValidFilterFields(args);

      case "post_dashboard_pivot_query":
        return await this.postDashboardPivotQuery(args);

      case "get_dashboard_public":
        return await this.getDashboardPublic();

      case "post_dashboard_save":
        return await this.postDashboardSave(args);

      case "post_dashboard_save_to_collection":
        return await this.postDashboardSaveToCollection(args);

      case "post_dashboard_query":
        return await this.postDashboardQuery(args);

      case "post_dashboard_query_export":
        return await this.postDashboardQueryExport(args);

      case "get_dashboard_execute":
        return await this.getDashboardExecute(args);

      case "post_dashboard_execute":
        return await this.postDashboardExecute(args);

      case "post_dashboard_public_link":
        return await this.postDashboardPublicLink(args);

      case "delete_dashboard_public_link":
        return await this.deleteDashboardPublicLink(args);

      case "post_dashboard_copy":
        return await this.postDashboardCopy(args);

      case "get_dashboard":
        return await this.getDashboard(args);

      case "put_dashboard_cards":
        return await this.putDashboardCards(args);

      case "get_dashboard_items":
        return await this.getDashboardItems(args);

      case "get_dashboard_param_remapping":
        return await this.getDashboardParamRemapping(args);

      case "get_dashboard_param_search":
        return await this.getDashboardParamSearch(args);

      case "get_dashboard_param_values":
        return await this.getDashboardParamValues(args);

      case "get_dashboard_query_metadata":
        return await this.getDashboardQueryMetadata(args);

      case "get_dashboard_related":
        return await this.getDashboardRelated(args);

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown dashboard tool: ${name}`
        );
    }
  }

  private async listDashboards(): Promise<any> {
    const dashboards = await this.client.getDashboards();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(dashboards, null, 2),
        },
      ],
    };
  }

  private async createDashboard(args: any): Promise<any> {
    const { name, description, parameters, collection_id } = args;

    if (!name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Missing required field: name"
      );
    }

    const dashboardData: any = { name };
    if (description !== undefined) dashboardData.description = description;
    if (parameters !== undefined) dashboardData.parameters = parameters;
    if (collection_id !== undefined)
      dashboardData.collection_id = collection_id;

    const dashboard = await this.client.createDashboard(dashboardData);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(dashboard, null, 2),
        },
      ],
    };
  }

  private async updateDashboard(args: any): Promise<any> {
    const { dashboard_id, ...updateFields } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
    }

    if (Object.keys(updateFields).length === 0) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "No fields provided for update"
      );
    }

    const dashboard = await this.client.updateDashboard(
      dashboard_id,
      updateFields
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(dashboard, null, 2),
        },
      ],
    };
  }

  private async deleteDashboard(args: any): Promise<any> {
    const { dashboard_id, hard_delete = false } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
    }

    await this.client.deleteDashboard(dashboard_id, hard_delete);

    return {
      content: [
        {
          type: "text",
          text: hard_delete
            ? `Dashboard ${dashboard_id} permanently deleted.`
            : `Dashboard ${dashboard_id} archived.`,
        },
      ],
    };
  }

  private async getDashboardCards(args: any): Promise<any> {
    const { dashboard_id } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
    }

    const dashboard = await this.client.getDashboard(dashboard_id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(dashboard.cards || [], null, 2),
        },
      ],
    };
  }

  private async addCardToDashboard(args: any): Promise<any> {
    const { dashboard_id, cards, tabs = [] } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
    }

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      throw new McpError(ErrorCode.InvalidParams, "Cards array is required and must not be empty");
    }

    for (const card of cards) {
      if (!card.id || typeof card.col !== 'number' || typeof card.row !== 'number' ||
          !card.size_x || !card.size_y) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Each card must have id, col, row, size_x, and size_y properties"
        );
      }
    }

    if (tabs.length > 0) {
      for (const tab of tabs) {
        if (!tab.id || !tab.name || tab.name.trim().length === 0) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Each tab must have id and non-empty name properties"
          );
        }
      }
    }

    const requestBody = {
      cards,
      tabs,
    };

    const result = await this.client.apiCall(
      "PUT",
      `/api/dashboard/${dashboard_id}/cards`,
      requestBody
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

  private async removeCardFromDashboard(args: any): Promise<any> {
    const { dashboard_id, dashcard_id } = args;

    if (!dashboard_id || !dashcard_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Dashboard ID and Dashcard ID are required"
      );
    }

    try {
      // Approach 1: Direct DELETE (standard approach)
      await this.client.apiCall(
        "DELETE",
        `/api/dashboard/${dashboard_id}/cards/${dashcard_id}`
      );
    } catch (error) {
      // Approach 2: Try alternative endpoint
      try {
        await this.client.apiCall(
          "DELETE",
          `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}`
        );
      } catch (altError) {
        // Approach 3: Update dashboard without the card
        const dashboard = await this.client.getDashboard(dashboard_id);
        const updatedCards = (dashboard.cards || []).filter(
          (card: any) => card.id !== dashcard_id
        );

        await this.client.apiCall(
          "PUT",
          `/api/dashboard/${dashboard_id}/cards`,
          { cards: updatedCards }
        );
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `Card with dashcard ID ${dashcard_id} removed from dashboard ${dashboard_id}`,
        },
      ],
    };
  }

  private async updateDashboardCard(args: any): Promise<any> {
    const { dashboard_id, dashcard_id, ...updateFields } = args;

    if (!dashboard_id || !dashcard_id) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Dashboard ID and Dashcard ID are required"
      );
    }

    if (Object.keys(updateFields).length === 0) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "No fields provided for update"
      );
    }

    let result;

    try {
      // Approach 1: Direct PUT to specific card
      result = await this.client.apiCall(
        "PUT",
        `/api/dashboard/${dashboard_id}/cards/${dashcard_id}`,
        updateFields
      );
    } catch (error) {
      // Approach 2: Try alternative endpoint
      try {
        result = await this.client.apiCall(
          "PUT",
          `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}`,
          updateFields
        );
      } catch (altError) {
        // Approach 3: Update entire dashboard cards array
        const dashboard = await this.client.getDashboard(dashboard_id);
        const updatedCards = (dashboard.cards || []).map((card: any) => {
          if (card.id === dashcard_id) {
            return { ...card, ...updateFields };
          }
          return card;
        });

        result = await this.client.apiCall(
          "PUT",
          `/api/dashboard/${dashboard_id}/cards`,
          { cards: updatedCards }
        );
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDashboardEmbeddable(): Promise<any> {
    const result = await this.client.apiCall("GET", "/api/dashboard/embeddable");
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDashboardParamsValidFilterFields(args: any): Promise<any> {
    const { filtered, filtering } = args;

    if (!filtered || !Array.isArray(filtered)) {
      throw new McpError(ErrorCode.InvalidParams, "filtered parameter is required and must be an array");
    }

    const queryParams = new URLSearchParams();
    filtered.forEach(field_id => queryParams.append('filtered', field_id.toString()));
    if (filtering && Array.isArray(filtering)) {
      filtering.forEach(field_id => queryParams.append('filtering', field_id.toString()));
    }

    const result = await this.client.apiCall("GET", `/api/dashboard/params/valid-filter-fields?${queryParams.toString()}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async postDashboardPivotQuery(args: any): Promise<any> {
    const { dashboard_id, dashcard_id, card_id, parameters } = args;

    if (!dashboard_id || !dashcard_id || !card_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id, dashcard_id, and card_id are required");
    }

    const requestBody: any = {};
    if (parameters !== undefined) requestBody.parameters = parameters;

    const result = await this.client.apiCall(
      "POST",
      `/api/dashboard/pivot/${dashboard_id}/dashcard/${dashcard_id}/card/${card_id}/query`,
      requestBody
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

  private async getDashboardPublic(): Promise<any> {
    const result = await this.client.apiCall("GET", "/api/dashboard/public");
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async postDashboardSave(args: any): Promise<any> {
    const { name, description, parameters, cards } = args;

    const requestBody: any = {};
    if (name !== undefined) requestBody.name = name;
    if (description !== undefined) requestBody.description = description;
    if (parameters !== undefined) requestBody.parameters = parameters;
    if (cards !== undefined) requestBody.cards = cards;

    const result = await this.client.apiCall("POST", "/api/dashboard/save", requestBody);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async postDashboardSaveToCollection(args: any): Promise<any> {
    const { parent_collection_id, name, description, parameters, cards } = args;

    if (!parent_collection_id || !name) {
      throw new McpError(ErrorCode.InvalidParams, "parent_collection_id and name are required");
    }

    const requestBody: any = { name };
    if (description !== undefined) requestBody.description = description;
    if (parameters !== undefined) requestBody.parameters = parameters;
    if (cards !== undefined) requestBody.cards = cards;

    const result = await this.client.apiCall(
      "POST",
      `/api/dashboard/save/collection/${parent_collection_id}`,
      requestBody
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

  private async postDashboardQuery(args: any): Promise<any> {
    const { dashboard_id, dashcard_id, card_id, dashboard_load_id, parameters } = args;

    if (!dashboard_id || !dashcard_id || !card_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id, dashcard_id, and card_id are required");
    }

    const requestBody: any = {};
    if (dashboard_load_id !== undefined) requestBody.dashboard_load_id = dashboard_load_id;
    if (parameters !== undefined) requestBody.parameters = parameters;

    const result = await this.client.apiCall(
      "POST",
      `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}/card/${card_id}/query`,
      requestBody
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

  private async postDashboardQueryExport(args: any): Promise<any> {
    const {
      dashboard_id,
      dashcard_id,
      card_id,
      export_format,
      format_rows = false,
      pivot_results = false,
      parameters = []
    } = args;

    if (!dashboard_id || !dashcard_id || !card_id || !export_format) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id, dashcard_id, card_id, and export_format are required");
    }

    const requestBody: any = {
      format_rows,
      pivot_results,
      parameters,
    };

    const result = await this.client.apiCall(
      "POST",
      `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}/card/${card_id}/query/${export_format}`,
      requestBody
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

  private async getDashboardExecute(args: any): Promise<any> {
    const { dashboard_id, dashcard_id, parameters } = args;

    if (!dashboard_id || !dashcard_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id and dashcard_id are required");
    }

    let url = `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}/execute`;
    if (parameters) {
      const encodedParams = encodeURIComponent(parameters);
      url += `?parameters=${encodedParams}`;
    }

    const result = await this.client.apiCall("GET", url);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async postDashboardExecute(args: any): Promise<any> {
    const { dashboard_id, dashcard_id, parameters } = args;

    if (!dashboard_id || !dashcard_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id and dashcard_id are required");
    }

    const requestBody: any = {};
    if (parameters !== undefined) requestBody.parameters = parameters;

    const result = await this.client.apiCall(
      "POST",
      `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}/execute`,
      requestBody
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

  private async postDashboardPublicLink(args: any): Promise<any> {
    const { dashboard_id } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
    }

    const result = await this.client.apiCall("POST", `/api/dashboard/${dashboard_id}/public_link`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async deleteDashboardPublicLink(args: any): Promise<any> {
    const { dashboard_id } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
    }

    const result = await this.client.apiCall("DELETE", `/api/dashboard/${dashboard_id}/public_link`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async postDashboardCopy(args: any): Promise<any> {
    const { from_dashboard_id, name, description, collection_id } = args;

    if (!from_dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "from_dashboard_id is required");
    }

    const requestBody: any = {};
    if (name !== undefined) requestBody.name = name;
    if (description !== undefined) requestBody.description = description;
    if (collection_id !== undefined) requestBody.collection_id = collection_id;

    const result = await this.client.apiCall("POST", `/api/dashboard/${from_dashboard_id}/copy`, requestBody);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDashboard(args: any): Promise<any> {
    const { dashboard_id } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
    }

    const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async putDashboardCards(args: any): Promise<any> {
    const { dashboard_id, cards } = args;

    if (!dashboard_id || !cards) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id and cards are required");
    }

    const result = await this.client.apiCall("PUT", `/api/dashboard/${dashboard_id}/cards`, { cards });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDashboardItems(args: any): Promise<any> {
    const { dashboard_id } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
    }

    const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/items`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDashboardParamRemapping(args: any): Promise<any> {
    const { dashboard_id, param_key, value } = args;

    if (!dashboard_id || !param_key || !value) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id, param_key, and value are required");
    }

    if (dashboard_id < 1) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id must be greater than zero");
    }

    const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/params/${param_key}/remapping?value=${encodeURIComponent(value)}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDashboardParamSearch(args: any): Promise<any> {
    const { dashboard_id, param_key, query, query_params = {} } = args;

    if (!dashboard_id || !param_key || !query) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id, param_key, and query are required");
    }

    if (dashboard_id < 1) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id must be greater than zero");
    }

    if (query.length < 1) {
      throw new McpError(ErrorCode.InvalidParams, "query must not be empty");
    }

    const queryString = Object.keys(query_params).length > 0
      ? '?' + Object.entries(query_params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')
      : '';

    const encodedQuery = encodeURIComponent(query);
    const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/params/${param_key}/search/${encodedQuery}${queryString}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDashboardParamValues(args: any): Promise<any> {
    const { dashboard_id, param_key, query_params = {} } = args;

    if (!dashboard_id || !param_key) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id and param_key are required");
    }

    if (dashboard_id < 1) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id must be greater than zero");
    }

    const queryString = Object.keys(query_params).length > 0
      ? '?' + Object.entries(query_params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')
      : '';

    const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/params/${param_key}/values${queryString}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDashboardQueryMetadata(args: any): Promise<any> {
    const { dashboard_id } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
    }

    const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/query_metadata`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getDashboardRelated(args: any): Promise<any> {
    const { dashboard_id } = args;

    if (!dashboard_id) {
      throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
    }

    const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/related`);
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
