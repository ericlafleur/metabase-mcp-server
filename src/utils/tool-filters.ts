/**
 * Tool filtering utilities for --write and --essential flags
 */

export interface ToolFilterOptions {
  writeMode: boolean;
  essentialOnly: boolean;
}

/**
 * Parse command line arguments for tool filtering options
 */
export function parseToolFilterOptions(): ToolFilterOptions {
  const args = process.argv.slice(2);
  
  return {
    writeMode: args.includes('--write'),
    essentialOnly: args.includes('--essential')
  };
}
