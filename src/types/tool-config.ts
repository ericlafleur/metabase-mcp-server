/**
 * Tool configuration interface for config-driven tool registry
 */

import { MetabaseClient } from "../client/metabase-client.js";

export interface ToolConfig {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
  handler: (client: MetabaseClient, args: any) => Promise<any>;
  validate?: (args: any) => void;
  transformArgs?: (args: any) => any;
}

export function defaultResponseFormatter(result: any): any {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
