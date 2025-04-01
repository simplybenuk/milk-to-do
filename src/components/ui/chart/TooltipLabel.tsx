
import * as React from "react"
import { cn } from "@/lib/utils"
import { useChart } from "./ChartContext"
import { getPayloadConfigFromPayload } from "./utils"

/**
 * Component for rendering the tooltip label section
 * 
 * @param props - Props for the tooltip label
 * @returns React component or null if hidden
 */
export const TooltipLabel = ({ 
  label, 
  labelFormatter, 
  payload, 
  hideLabel, 
  labelClassName, 
  config,
  labelKey
}: {
  /** The label text or node */
  label: React.ReactNode;
  /** Custom formatter for the label */
  labelFormatter?: (value: any, payload: any[]) => React.ReactNode;
  /** Tooltip payload data */
  payload?: any[];
  /** Whether to hide the label */
  hideLabel?: boolean;
  /** Additional CSS class for the label */
  labelClassName?: string;
  /** Chart configuration */
  config: any;
  /** Key to use for label lookup */
  labelKey?: string;
}) => {
  if (hideLabel || !payload?.length) {
    return null
  }

  const [item] = payload
  const key = `${labelKey || item.dataKey || item.name || "value"}`
  const itemConfig = getPayloadConfigFromPayload(config, item, key)
  const value =
    !labelKey && typeof label === "string"
      ? config[label as keyof typeof config]?.label || label
      : itemConfig?.label

  if (labelFormatter) {
    return (
      <div className={cn("font-medium", labelClassName)}>
        {labelFormatter(value, payload)}
      </div>
    )
  }

  if (!value) {
    return null
  }

  return <div className={cn("font-medium", labelClassName)}>{value}</div>
}
