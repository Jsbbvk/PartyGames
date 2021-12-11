import { fabric } from 'fabric'
import to from 'await-to-js'

const objectOptions = {
  width: '500px',
  height: '500px',
}

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

  // TODO on text select, bringForward()

  setBackgroundImage(src) {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        const fabricImage = new fabric.Image(img)

        // const {width, height} = fabricImage

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
          left: this.canvas.width / 2,
          top: this.canvas.height / 2,
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
}
