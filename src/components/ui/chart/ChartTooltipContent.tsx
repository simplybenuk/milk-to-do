
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { useChart } from "./ChartContext"
import { getPayloadConfigFromPayload } from "./utils"
import { TooltipLabel } from "./TooltipLabel"
import { TooltipItem } from "./TooltipItem"

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
