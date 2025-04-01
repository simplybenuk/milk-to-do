
import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Component for rendering individual tooltip items
 * 
 * @param props - Props for the tooltip item
 * @returns React component
 */
export const TooltipItem = ({
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
