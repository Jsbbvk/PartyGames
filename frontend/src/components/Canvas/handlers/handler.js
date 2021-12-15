import { fabric } from 'fabric'
import {
  objectOptions,
  fontOptions,
  impactOptions,
  arialOptions,
} from '../constants'
import { EventHandler, HammerHandler } from '.'

export default class Handler {
  constructor(options) {
    this.initialize(options)
  }

  initialize = (options) => {
    this.initOptions(options)
    this.initHandlers()
  }

  initOptions = (options) => {
    this.id = options?.id
    this.canvas = options?.canvas
    this.container = options?.container
    this.width = options?.width
    this.height = options?.height
    this.isMobile = options?.isMobile
  }

  initHandlers = () => {
    this.hammerHandler = new HammerHandler(this)
    this.eventHandler = new EventHandler(this)
  }

  remove = (target) => {
    const activeObject = target || this.canvas.getActiveObject()
    if (
      !activeObject ||
      (activeObject.type === 'i-text' && activeObject.isEditing)
    )
      return

    if (activeObject.type !== 'activeSelection') {
      this.canvas.discardActiveObject()
      this.canvas.remove(activeObject)
    } else {
      const { _objects: activeObjects } = activeObject
      this.canvas.discardActiveObject()
      activeObjects.forEach((obj) => {
        this.canvas.remove(obj)
      })
    }
  }

  addText(str) {
    const text = new fabric.IText(str)
    text.set({
      ...fontOptions,
      ...arialOptions,
      left: this.canvas.width / 2,
      top: this.canvas.height / 6,
      originX: 'center',
      originY: 'center',
      cursorColor: 'black',
    })

    this.canvas.add(text)
    text.enterEditing()
    text.selectAll()
    this.canvas.setActiveObject(text)
    this.canvas.requestRenderAll()

    // text.hiddenTextarea.addEventListener('blur', () => {
    //   text.text = 'out'
    // })
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
          (window.innerHeight * 0.65) / fabricImage.height
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

  setByPartial(obj, option) {
    if (!obj) {
      return
    }
    obj.set(option)
    obj.setCoords()
    this.canvas.renderAll()
  }

  destroy() {
    this.hammerHandler.destroy()
    this.eventHandler.destroy()
  }
}
