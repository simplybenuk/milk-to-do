
import * as React from "react"

/**
 * Configuration for chart elements including labels, icons, and theming
 * @typedef {Object} ChartConfig
 */
export type ChartConfig = {
  [k in string]: {
    /** Label to display for this chart element */
    label?: React.ReactNode
    /** Icon component to represent this chart element */
    icon?: React.ComponentType
  } & (
    | { 
        /** Direct color value for the chart element */
        color?: string; 
        theme?: never 
      }
    | { 
        color?: never; 
        /** Theme-specific colors for light and dark modes */
        theme: Record<"light" | "dark", string> 
      }
  )
}

/** Props for the Chart context provider */
type ChartContextProps = {
  /** Configuration object for chart elements */
  config: ChartConfig
}

/**
 * React context for sharing chart configuration across components
 */
export const ChartContext = React.createContext<ChartContextProps | null>(null)

/**
 * Hook to access chart configuration
 * @returns {ChartContextProps} The chart context value
 * @throws {Error} When used outside of a ChartContainer
 */
export function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}
