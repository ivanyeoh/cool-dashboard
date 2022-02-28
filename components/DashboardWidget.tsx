export type DashboardWidgetType = {
  id: number | string
  i?: number | string
  component?: string
  dataUrl?: string
  blank?: boolean
  w: number
  h: number
  x: number
  y: number
}

const DashboardWidget = ({ widget, readOnly }: { widget: DashboardWidgetType, readOnly: boolean }) => {
  return (
    <div key={widget.id}>
      {widget.component}
    </div>
  )
}

export default DashboardWidget
