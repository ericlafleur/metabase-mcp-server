/**
 * Resource handlers for Metabase MCP Server
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { ErrorCode, McpError } from "../types/errors.js";
import {
  ListResourcesResult,
  ReadResourceResult,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

export class ResourceHandlers {
  constructor(private client: MetabaseClient) {}

  /**
   * Handle list resources request
   */
  async handleListResources(): Promise<ListResourcesResult> {
    const dashboards = await this.client.getDashboards();

    return {
      resources: dashboards.map((dashboard) => ({
        uri: `metabase://dashboard/${dashboard.id}`,
        mimeType: "application/json",
        name: dashboard.name,
        description: `Metabase dashboard: ${dashboard.name}`,
      })),
    };
  }

  /**
   * Handle resource templates request
   */
  async handleListResourceTemplates(): Promise<any> {
    return {
      resourceTemplates: [
        {
          uriTemplate: "metabase://dashboard/{id}",
          name: "Dashboard by ID",
          mimeType: "application/json",
          description: "Get a Metabase dashboard by its ID",
        },
        {
          uriTemplate: "metabase://card/{id}",
          name: "Card by ID",
          mimeType: "application/json",
          description: "Get a Metabase question/card by its ID",
        },
        {
          uriTemplate: "metabase://database/{id}",
          name: "Database by ID",
          mimeType: "application/json",
          description: "Get a Metabase database by its ID",
        },
        {
          uriTemplate: "metabase://collection/{id}",
          name: "Collection by ID",
          mimeType: "application/json",
          description: "Get a Metabase collection by its ID",
        },
        {
          uriTemplate: "metabase://user/{id}",
          name: "User by ID",
          mimeType: "application/json",
          description: "Get a Metabase user by its ID",
        },
        {
          uriTemplate: "metabase://table/{id}",
          name: "Table by ID",
          mimeType: "application/json",
          description: "Get a Metabase table by its ID",
        },
        {
          uriTemplate: "metabase://field/{id}",
          name: "Field by ID",
          mimeType: "application/json",
          description: "Get a Metabase field by its ID",
        },
      ],
    };
  }

  /**
   * Handle read resource request
   */
  async handleReadResource(uri: string): Promise<ReadResourceResult> {
    let match;

    try {
      // Handle dashboard resources
      if ((match = uri.match(/^metabase:\/\/dashboard\/(\d+)$/))) {
        const dashboardId = parseInt(match[1]);
        const dashboard = await this.client.getDashboard(dashboardId);

        return {
          contents: [
            {
              uri: uri,
              mimeType: "application/json",
              text: JSON.stringify(dashboard, null, 2),
            },
          ],
        };
      }

      // Handle question/card resources
      else if ((match = uri.match(/^metabase:\/\/card\/(\d+)$/))) {
        const cardId = parseInt(match[1]);
        const card = await this.client.getCard(cardId);

        return {
          contents: [
            {
              uri: uri,
              mimeType: "application/json",
              text: JSON.stringify(card, null, 2),
            },
          ],
        };
      }

      // Handle database resources
      else if ((match = uri.match(/^metabase:\/\/database\/(\d+)$/))) {
        const databaseId = parseInt(match[1]);
        const database = await this.client.getDatabase(databaseId);

        return {
          contents: [
            {
              uri: uri,
              mimeType: "application/json",
              text: JSON.stringify(database, null, 2),
            },
          ],
        };
      }

      // Handle collection resources
      else if ((match = uri.match(/^metabase:\/\/collection\/(\d+)$/))) {
        const collectionId = parseInt(match[1]);
        const collection = await this.client.getCollection(collectionId);

        return {
          contents: [
            {
              uri: uri,
              mimeType: "application/json",
              text: JSON.stringify(collection, null, 2),
            },
          ],
        };
      }

      // Handle user resources
      else if ((match = uri.match(/^metabase:\/\/user\/(\d+)$/))) {
        const userId = parseInt(match[1]);
        const user = await this.client.getUser(userId);

        return {
          contents: [
            {
              uri: uri,
              mimeType: "application/json",
              text: JSON.stringify(user, null, 2),
            },
          ],
        };
      }

      // Handle table resources
      else if ((match = uri.match(/^metabase:\/\/table\/(\d+)$/))) {
        const tableId = parseInt(match[1]);
        const table = await this.client.apiCall("GET", `/api/table/${tableId}`);

        return {
          contents: [
            {
              uri: uri,
              mimeType: "application/json",
              text: JSON.stringify(table, null, 2),
            },
          ],
        };
      }

      // Handle field resources
      else if ((match = uri.match(/^metabase:\/\/field\/(\d+)$/))) {
        const fieldId = parseInt(match[1]);
        const field = await this.client.apiCall("GET", `/api/field/${fieldId}`);

        return {
          contents: [
            {
              uri: uri,
              mimeType: "application/json",
              text: JSON.stringify(field, null, 2),
            },
          ],
        };
      } else {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Invalid URI format: ${uri}`
        );
      }
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to read resource: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
