
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"
import { useChart } from "./ChartContext"
import { getPayloadConfigFromPayload } from "./utils"

/** 
 * Export the original Tooltip component from Recharts 
 */
export const ChartTooltip = RechartsPrimitive.Tooltip

/**
 * Component for rendering the tooltip label section
 * 
 * @param props - Props for the tooltip label
 * @returns React component or null if hidden
 */
const TooltipLabel = ({ 
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

/**
 * Component for rendering individual tooltip items
 * 
 * @param props - Props for the tooltip item
 * @returns React component
 */
const TooltipItem = ({
  item,
  index,
  formatter,
  itemConfig,
  hideIndicator,
  indicator,
  nestLabel,
  color
}: {
  /** The tooltip item data */
  item: any;
  /** Item index in the tooltip */
  index: number;
  /** Custom formatter function */
  formatter?: (value: any, name: string, item: any, index: number, payload: any) => React.ReactNode;
  /** Configuration for this item */
  itemConfig: any;
  /** Whether to hide the color indicator */
  hideIndicator: boolean;
  /** Type of indicator to display */
  indicator: "line" | "dot" | "dashed";
  /** Whether to nest the label inside the item */
  nestLabel: boolean;
  /** Optional override color */
  color?: string;
}) => {
  const indicatorColor = color || item.payload.fill || item.color

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center"
      )}
    >
      {formatter && item?.value !== undefined && item.name ? (
        formatter(item.value, item.name, item, index, item.payload)
      ) : (
        <>
          {itemConfig?.icon ? (
            <itemConfig.icon />
          ) : (
            !hideIndicator && (
              <div
                className={cn(
                  "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                  {
                    "h-2.5 w-2.5": indicator === "dot",
                    "w-1": indicator === "line",
                    "w-0 border-[1.5px] border-dashed bg-transparent":
                      indicator === "dashed",
                    "my-0.5": nestLabel && indicator === "dashed",
                  }
                )}
                style={
                  {
                    "--color-bg": indicatorColor,
                    "--color-border": indicatorColor,
                  } as React.CSSProperties
                }
              />
            )
          )}
          <div
            className={cn(
              "flex flex-1 justify-between leading-none",
              nestLabel ? "items-end" : "items-center"
            )}
          >
            <div className="grid gap-1.5">
              {(itemConfig?.label || item.name) && (
                <span className="text-muted-foreground">
                  {itemConfig?.label || item.name}
                </span>
              )}
            </div>
            {item.value && (
              <span className="font-mono font-medium tabular-nums text-foreground">
                {item.value.toLocaleString()}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Custom tooltip content component with better styling and configuration options
 * 
 * @param props - Component props including tooltip data and styling options
 * @returns React component or null if not active
 */
export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      /** Whether to hide the tooltip label */
      hideLabel?: boolean;
      /** Whether to hide color indicators */
      hideIndicator?: boolean;
      /** Type of indicator to show */
      indicator?: "line" | "dot" | "dashed";
      /** Key to use for name lookup */
      nameKey?: string;
      /** Key to use for label lookup */
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    // If not active or no payload, don't render anything
    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    const tooltipLabel = (
      <TooltipLabel 
        label={label}
        labelFormatter={labelFormatter}
        payload={payload}
        hideLabel={hideLabel}
        labelClassName={labelClassName}
        config={config}
        labelKey={labelKey}
      />
    )

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)

            return (
              <React.Fragment key={item.dataKey}>
                <TooltipItem
                  item={item}
                  index={index}
                  formatter={formatter}
                  itemConfig={itemConfig}
                  hideIndicator={hideIndicator}
                  indicator={indicator}
                  nestLabel={nestLabel}
                  color={color}
                />
                {nestLabel && index === 0 ? tooltipLabel : null}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"
