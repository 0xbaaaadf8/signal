import StageItem from "components/Stage/Item"
import Rect from "model/Rect"

export default class TempoGraphItem extends StageItem {
  constructor(id, x, y, width, height, fillColor, strokeColor) {
    super()
    this.id = id
    this.bounds = new Rect(x, y, width, height)
    this.fillColor = fillColor
    this.strokeColor = strokeColor
  }

  render(ctx) {
    ctx.fillStyle = this.fillColor
    ctx.strokeStyle = this.strokeColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height)
    ctx.fill()
    ctx.stroke()
  }
}
