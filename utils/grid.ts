import { DashboardWidgetType } from "../components/DashboardWidget";

type GridCell = {
  x: number
  y: number
  widget: DashboardWidgetType
}

function getBlankWidget({ x, y }: { x: number, y: number }) {
  return {
    id: `blank-${x}-${y}`,
    x,
    y,
    w: 1,
    h: 1,
    blank: true
  }
}

function getPositionOccupiedMap(widgets: DashboardWidgetType[]) {
  const occupied = {} as Record<string, DashboardWidgetType>
  widgets.forEach((widget) => {
    for (let x = widget.x; x < widget.x + widget.w; x++) {
      for (let y = widget.y; y < widget.y + widget.h; y++) {
        if (!widget.blank) {
          occupied[`${x},${y}`] = widget
        }
      }
    }
  })
  return occupied
}

function getMaxY(widgets: DashboardWidgetType[]) {
  let max = 0
  widgets.forEach((widget) => {
    for (let x = widget.x; x < widget.x + widget.w; x++) {
      for (let y = widget.y; y < widget.y + widget.h; y++) {
        max = Math.max(max, y)
      }
    }
  })
  return max
}

function toGridPositions(columns: number, rows: number) {
  const grid = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      grid.push({ x, y })
    }
  }
  return grid
}

function toGridCells(widgets: DashboardWidgetType[], columns: number): GridCell[] {
  const occupyMap = getPositionOccupiedMap(widgets)
  const maxY = getMaxY(widgets)
  const cells = toGridPositions(columns, maxY + 1).map(({ x, y }) => {
    return {
      x,
      y,
      widget: occupyMap[`${x},${y}`]
    }
  })
  return cells
}

function toDashboardWidgets(cells: GridCell[]): DashboardWidgetType[] {
  let inserted = {} as Record<string, boolean>
  const dashboardWidgets = cells.flatMap((cell) => {
    if (cell.widget?.blank) return cell.widget

    if (cell.widget && !inserted[cell.widget.id]) {
      inserted[cell.widget.id] = true
      return cell.widget
    }

    return null as any
  }).filter(Boolean) || []

  return dashboardWidgets
}

function fillBlankCells(cells: GridCell[]) {
  const filledCells = cells.map((cell) => {
    if (cell.widget) return cell
    return { ...cell, widget: getBlankWidget({ x: cell.x, y: cell.y }) }
  })
  return filledCells
}

function removeTotallyBlankRows(cells: GridCell[], columns: number) {
  const maxY = cells.reduce((max, { y }) => Math.max(max, y), 0)
  const nonBlankRows = [] as GridCell[][]
  for (let y = 0; y <= maxY; y++) {
    const yCells = cells.filter(({ y: cellY }) => cellY === y)
    const blankCells = yCells.filter(({ widget }) => widget?.blank)
    const isTotallyBlank = blankCells.length === columns
    if (!isTotallyBlank) {
      nonBlankRows.push(yCells)
    }
  }

  const shiftedCells = nonBlankRows.flatMap((row, rowY) => {
    return row.map((cell) => {
      return {
        ...cell,
        y: rowY,
        widget: cell.widget.blank ? getBlankWidget({ x: cell.x, y: rowY }) : {
          ...cell.widget,
          y: rowY
        }
      }
    })
  })

  return shiftedCells
}

function isFullyOccupied(widgets: DashboardWidgetType[]) {
  return widgets?.every(({ blank }) => !blank)

}

function appendBlankRow(widgets: DashboardWidgetType[], columns: number) {
  const nextY = getMaxY(widgets) + 1
  return widgets.concat(Array(columns).fill(null).map((_, i) => getBlankWidget({ x: i, y: nextY })))
}

export function fillBlanks(widgets: DashboardWidgetType[], { columns = 6, rows = 2 }: { columns: number, rows?: number }) {
  if (!widgets?.length) {
    const blankWidgets = toGridPositions(columns, rows).map(getBlankWidget)
    return blankWidgets
  }

  let cells = toGridCells(widgets, columns)
  cells = fillBlankCells(cells)
  cells = removeTotallyBlankRows(cells, columns)

  let dashboardWidgets = toDashboardWidgets(cells)
  if (isFullyOccupied(dashboardWidgets)) {
    dashboardWidgets = appendBlankRow(dashboardWidgets, columns)
  }

  return dashboardWidgets
}

