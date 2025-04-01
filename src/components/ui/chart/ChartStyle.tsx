
import * as React from "react"
import { ChartConfig } from "./ChartContext"

/** CSS selectors for different themes */
export const THEMES = { light: "", dark: ".dark" } as const

/**
 * Component that injects CSS variables for chart colors based on the theme
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the chart
 * @param {ChartConfig} props.config - Chart configuration object
 * @returns {React.ReactElement | null} Style element or null if no color config exists
 */
export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}
