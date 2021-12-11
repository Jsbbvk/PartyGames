import React, { Component } from 'react'
import { fabric } from 'fabric'
import { v4 } from 'uuid'
import ResizeObserver from 'resize-observer-polyfill'
import { isMobile } from 'react-device-detect'
import Handler from './handlers/handler'

const defaultCanvasOptions = {
  preserveObjectStacking: true,
  width: 500,
  height: 500,
  selection: true,
  defaultCursor: 'default',
  backgroundColor: 'rgb(247, 249, 251)',
  isFullscreen: false,
}

class Canvas extends Component {
  constructor() {
    super()

    this.handler = null
    this.canvas = null
    this.resizeObserver = null
    this.container = React.createRef(null)
    this.state = {
      id: v4(),
      loaded: false,
    }
  }

  // static defaultProps = {
  //   id: v4(),
  //   editable: true,
  //   zoomEnabled: true,
  //   minZoom: 25,
  //   maxZoom: 300,
  //   responsive: true,
  //   width: 0,
  //   height: 0,
  // }

  componentDidMount() {
    const {
      canvasOption,
      workareaOption = {},
      width,
      height,
      ...other
    } = this.props

    const { id } = this.state
    const mergedCanvasOption = {
      ...defaultCanvasOptions,
      ...canvasOption,
      // width,
      // height,
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
    fabric.Object.prototype.originX = 'center'
    fabric.Object.prototype.originY = 'center'
    fabric.Group.prototype.originX = 'center'
    fabric.Group.prototype.originY = 'center'

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
      workareaOption,
      isMobile,
      ...other,
    })
    ;(async () => {
      await this.handler.setBackgroundImage('/images/memes/joke.jpg')

      const fontOptions = {
        left: isMobile ? 50 : 100,
        top: isMobile ? 50 : 100,
        fontSize: isMobile ? 30 : 40,
      }
      const impactOptions = {
        fontFamily: 'Impact',
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        fontWeight: 'bold',
      }
      const arialOptions = {
        fontFamily: 'Arial',
        stroke: '#d8d8d8',
        strokeWidth: isMobile ? 1 : 1.25,
        fontWeight: 'bold',
      }

      this.handler.canvas.add(
        new fabric.IText('HELLO', {
          ...fontOptions,
          ...impactOptions,
        })
      )

      console.log(this.handler.canvas.toDataURL('png'))

      this.handler.canvas.renderAll()

      this.handleLoad()
    })()
  }

  componentDidUpdate(prevProps) {
    // if (
    //     this.props.width !== prevProps.width ||
    //     this.props.height !== prevProps.height
    // ) {
    //     this.handler.eventHandler.resize(
    //         this.props.width,
    //         this.props.height
    //     );
    // }
    // if (this.props.responsive !== prevProps.responsive) {
    //   if (!this.props.responsive) {
    //     this.destroyObserver()
    //   } else {
    //     this.destroyObserver()
    //     this.createObserver()
    //   }
    // }
  }

  componentWillUnmount() {
    this.destroyObserver()
    // this.handler.destroy()
  }

  handleLoad() {
    this.setState(
      {
        loaded: true,
      },
      () => {
        const { onLoad } = this.props
        if (onLoad) {
          onLoad(this.handler, this.canvas)
        }
      }
    )
  }

  destroyObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  }

  createObserver() {
    const { loaded } = this.state
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width = 0, height = 0 } =
        (entries[0] && entries[0].contentRect) || {}
      // this.handler.eventHandler.resize(width, height);

      if (!loaded) {
        this.handleLoad()
      }
    })
    this.resizeObserver.observe(this.container.current)
  }

  render() {
    const { style, classes, fullscreen } = this.props
    const { id } = this.state
    return (
      <div
        ref={this.container}
        id={id}
        className="user-interactable"
        style={{ ...style }}
      >
        <canvas id={`canvas_${id}`} style={{ border: '1px solid black' }} />
      </div>
    )
  }
}

export default Canvas
