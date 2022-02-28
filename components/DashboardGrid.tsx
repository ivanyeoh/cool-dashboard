import { useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { fillBlanks } from "../utils/grid";
import DashboardWidget, { DashboardWidgetType } from "./DashboardWidget";

type DashboardGridOptions = {
  minWidgetSize?: number,
  maxColumns?: number,
  minRows?: number,
  widgets?: DashboardWidgetType[],
  readOnly?: boolean,
  onRemove?: (id: number | string) => void
  onAdd?: (widget: DashboardWidgetType) => void
  onSwap?: (oldItem: Layout, newItem: Layout) => void
  onResize?: (widget: Layout) => void
}

const DashboardGrid = ({
  minWidgetSize = 100,
  maxColumns = 6,
  minRows = 2,
  widgets,
  readOnly = false,
  onRemove,
  onAdd,
  onSwap,
  onResize,
}: DashboardGridOptions) => {
  const [items, setItems] = useState(widgets || [])
  const canvasWidth = (maxColumns * minWidgetSize) + (maxColumns * 10)
  const filledWidgets = fillBlanks(items, { columns: maxColumns, rows: minRows })?.map((item) => {
    return {
      i: item.id,
      ...item,
    }
  })

  const addWidget = (x: number, y: number) => () => {
    const id = Math.ceil(Math.random() * 1000000)
    const newWidget = {
      id,
      i: id,
      component: "NiceChart",
      x,
      y,
      w: 2,
      h: 2
    }

    setItems(filledWidgets?.concat(newWidget))

    onAdd?.(newWidget)
  }

  const removeWidget = (x: number, y: number) => () => {
    setItems(filledWidgets?.filter((w) => !(w.y === y && w.x === x)))
    const widget = filledWidgets.find((w) => w.y === y && w.x === x)
    if (widget) {
      onRemove?.(widget.id)
    }
  }

  return (
    <div style={{ width: canvasWidth }}>
      <GridLayout
        className={`layout dashboard-grid ${readOnly ? "read-only" : ""}`}
        cols={maxColumns}
        rowHeight={minWidgetSize}
        width={canvasWidth}
        margin={[10, 10]}
        isBounded
        onDragStop={(_, oldItem, newItem) => {
          onSwap?.(oldItem, newItem)
        }}
        onResizeStop={(_, oldItem, newItem) => {
          onResize?.(newItem)
        }}
        onLayoutChange={(layout) => {
          const updatedLayoutProps = layout.filter((updated) => {
            const widget = filledWidgets.find((w) => w.id.toString() === updated.i.toString())
            return updated?.x !== widget?.x || updated?.y !== widget?.y || updated?.w !== widget?.w || updated?.h !== widget?.h
          })
          if (updatedLayoutProps?.length) {
            setItems((items) => {
              const updatedWidgets = items.filter(({ blank }) => !blank).map((widget) => {
                const updated = updatedLayoutProps.find((item) => item.i.toString() === widget.id.toString())
                if (updated) {
                  return {
                    ...widget,
                    ...updated,
                  }
                }
                return widget
              })
              return updatedWidgets
            })
          }
        }}
      >
        {
          filledWidgets?.map((widget) => {
            const item = (
              widget.blank ? (
                !readOnly &&
                <button key={widget.id}
                  data-grid={{
                    ...widget,
                    isBounded: true,
                    isResizable: false,
                    isDraggable: false
                  }}
                  className="dashboard-grid-widget-add"
                  onClick={addWidget(widget.x, widget.y)}
                >
                  ➕
                </button>
              ) : (
                <div key={widget.id}
                  data-grid={{
                    ...widget,
                    isBounded: true,
                    static: readOnly === true,
                  }}
                  className="dashboard-grid-widget">
                  {!readOnly && (<button className="dashboard-grid-widget-remove" onClick={removeWidget(widget.x, widget.y)}>✖️</button>)}
                  <DashboardWidget widget={widget} readOnly={readOnly} />
                </div>
              )
            )
            return item
          })
        }
      </GridLayout>
    </div>
  )
}

export default DashboardGrid
