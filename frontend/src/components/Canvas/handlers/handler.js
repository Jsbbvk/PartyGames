import { fabric } from 'fabric'
import to from 'await-to-js'
import {
  objectOptions,
  fontOptions,
  impactOptions,
  arialOptions,
} from '../constants'

export default class Handler {
  constructor(options) {
    this.initialize(options)
  }

  initialize(options) {
    this.initOptions(options)
  }

  initOptions(options) {
    this.id = options?.id
    this.canvas = options?.canvas
    this.container = options?.container
    this.width = options?.width
    this.height = options?.height
    this.isMobile = options?.isMobile
  }

  addText(str) {
    const text = new fabric.IText(str)
    text.set({
      ...fontOptions,
      ...arialOptions,
      left: (this.canvas.width - text.width) / 2,
      top: (this.canvas.height - text.height) / 2,
    })
    this.canvas.add(text)
    this.canvas.requestRenderAll()
  }

  setBackgroundImage(src) {
    return new Promise((resolve) => {
      // TODO add a max Height
      const img = new Image()
      img.src = src
      img.onload = () => {
        const fabricImage = new fabric.Image(img)

        const ratio = Math.min(
          this.canvas.width / fabricImage.width,
          this.canvas.height / fabricImage.height
        )
        this.canvas.setDimensions({
          width: fabricImage.width * ratio,
          height: fabricImage.height * ratio,
        })
        fabricImage.set({
          scaleX: ratio,
          scaleY: ratio,
          selectable: false,
        })

        this.canvas.setBackgroundImage(
          fabricImage,
          this.canvas.renderAll.bind(this.canvas)
        )

        resolve()
      }
    })
  }

  exportAsDataURL() {
    return this.canvas.toDataURL('png')
  }

  destroy() {
    this.canvas.renderAll()
    // unbind all handlers
  }
}
