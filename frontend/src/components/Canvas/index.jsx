import React, { Component } from 'react'
import { fabric } from 'fabric'
import { v4 } from 'uuid'
import { isMobile } from 'react-device-detect'
import Handler from './handlers/handler'
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
      (innerWidth * 0.8) / width,
      (innerHeight * 0.8) / height
    )

    const { id } = this.state
    const mergedCanvasOption = {
      ...options,
      ...canvasOption,
      width: Math.min(maxWidth, ratio * width),
      height: Math.min(maxHeight, ratio * height),
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
    // ;(async () => {
    //   await this.handler.setBackgroundImage(`/images/memes/${Memes[87].src}`)
    //   this.handler.addText('hi there')
    //   this.handler.addText('bye')

    //   console.log(this.handler.exportAsDataURL())

    //   this.handler.canvas.renderAll()
    // })()
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
    const { style, classes, fullscreen } = this.props
    const { id } = this.state
    return (
      <div
        ref={this.container}
        id={id}
        className="user-interactable"
        style={{ display: 'flex', justifyContent: 'center', ...style }}
      >
        <canvas id={`canvas_${id}`} style={{ border: '1px solid black' }} />
      </div>
    )
  }
}

export default Canvas
