
import { ChartConfig } from "./ChartContext";

/**
 * Retrieves the configuration for a specific chart element from the payload
 * 
 * @param {ChartConfig} config - The chart configuration object
 * @param {any} payload - The chart data payload
 * @param {string} key - The data key to lookup in the configuration
 * @returns {any} The configuration for the specific element or undefined if not found
 */
export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: any,
  key: string
): ChartConfig[string] | undefined {
  return config?.[key] || config?.[payload?.dataKey] || config?.[payload?.name];
}
