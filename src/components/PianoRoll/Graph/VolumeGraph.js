import React from "react"
import LineGraphControl from "./LineGraphControl"

export default function VolumeGraph({
  width,
  height,
  scrollLeft,
  events,
  transform,
  dispatch,
  color
}) {
  return <LineGraphControl
    className="VolumeGraph"
    width={width}
    height={height}
    scrollLeft={scrollLeft}
    transform={transform}
    maxValue={127}
    lineWidth={2}
    events={events.filter(e => e.controllerType === 0x07)}
    axis={[0, 0x20, 0x40, 0x60, 0x80 - 1]}
    createEvent={obj => dispatch("CREATE_VOLUME", obj)}
    onClickAxis={e => dispatch("CREATE_VOLUME", { value: e.value })}
    color={color}
  />
}
