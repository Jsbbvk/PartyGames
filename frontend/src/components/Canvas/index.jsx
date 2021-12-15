import React, { Component } from 'react'
import { fabric } from 'fabric'
import { v4 } from 'uuid'
import { isMobile } from 'react-device-detect'
import Handler from './handlers/Handler'
import { defaultCanvasOptions } from './constants'
import Memes from '../../constants/memes'

class Canvas extends Component {
  constructor() {
    super()

    this.handler = null
    this.canvas = null
    this.resizeObserver = null
    this.container = React.createRef(null)
    this.state = {
      id: v4(),
    }
  }

  componentDidMount() {
    const { canvasOption, ...other } = this.props

    const { width, height, maxWidth, maxHeight, ...options } =
      defaultCanvasOptions
    const { innerHeight, innerWidth } = window
    const ratio = Math.min(
      (innerWidth * 0.9) / width,
      (innerHeight * 0.9) / height
    )

    const { id } = this.state
    const mergedCanvasOption = {
      ...options,
      ...canvasOption,
      width: Math.min(maxWidth, ratio * width),
      height: Math.min(maxHeight, ratio * height),
      allowTouchScrolling: isMobile,
    }

    // initiating "theme"
    fabric.Object.prototype.cornerColor = 'white'
    fabric.Object.prototype.cornerStrokeColor = '#86cbf9'
    fabric.Object.prototype.borderColor = '#24a3f8'
    fabric.Object.prototype.cornerStyle = 'rect'
    fabric.Object.prototype.cornerSize = 8
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.hasControls = !isMobile
    fabric.Group.prototype.hasControls = !isMobile
    /* eslint-disable */
    ;(function () {
      if (!isMobile) return
      var defaultOnTouchStartHandler = fabric.Canvas.prototype._onTouchStart
      fabric.util.object.extend(fabric.Canvas.prototype, {
        _onTouchStart: function (e) {
          var target = this.findTarget(e)

          if (this.allowTouchScrolling && !target && !this.isDrawingMode) {
            return
          }

          defaultOnTouchStartHandler.call(this, e)
        },
      })
    })()
    // /* eslint-enable */

    this.canvas = new fabric.Canvas(`canvas_${id}`, mergedCanvasOption)

    this.canvas.setBackgroundColor(
      mergedCanvasOption.backgroundColor,
      this.canvas.renderAll.bind(this.canvas)
    )
    this.canvas.renderAll()

    this.handler = new Handler({
      id,
      width,
      height,
      canvas: this.canvas,
      container: this.container.current,
      canvasOption: mergedCanvasOption,
      isMobile,
      ...other,
    })
  }

  componentWillUnmount() {
    this.handler.destroy()
  }

  async setBackgroundImage(src, name) {
    await this.handler.setBackgroundImage(`/images/memes/${src}`)
  }

  addText(text) {
    this.handler.addText(text || '')
  }

  render() {
    const { style } = this.props
    const { id } = this.state
    return (
      <div
        ref={this.container}
        id={id}
        style={{
          display: 'flex',
          justifyContent: 'center',
          touchAction: 'pan-y pan-x !important',
        }}
      >
        <canvas id={`canvas_${id}`} style={{ border: '1px solid black' }} />
      </div>
    )
  }
}

export default Canvas
