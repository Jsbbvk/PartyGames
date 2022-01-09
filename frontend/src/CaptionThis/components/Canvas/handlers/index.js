/* eslint-disable no-param-reassign */
import { fabric } from 'fabric'
import {
  objectOptions,
  fontOptions,
  impactOptions,
  arialOptions,
  defaultCanvasOptions,
  TRANSACTION_TYPES,
} from '../constants'
import EventHandler from './EventHandler'
import HammerHandler from './HammerHandler'
import TransactionHandler from './TransactionHandler'

export default class Handler {
  constructor(options) {
    this.initialize(options)
  }

  initialize = (options) => {
    this.initOptions(options)
    this.initHandlers()
    this.initCallback(options)
  }

  initOptions = (options) => {
    this.id = options?.id
    this.canvas = options?.canvas
    this.container = options?.container
    this.width = options?.width
    this.height = options?.height
    this.isMobile = options?.isMobile
    this.editable = true
  }

  initHandlers = () => {
    this.hammerHandler = new HammerHandler(this)
    this.eventHandler = new EventHandler(this)
    this.transactionHandler = new TransactionHandler(this)
  }

  initCallback = (options) => {
    this.onTransaction = options.onTransaction
    this.onSelect = options.onSelect
  }

  clear = () => {
    if (!this.editable) return

    this.canvas.discardActiveObject()
    this.canvas.getObjects().forEach((obj) => {
      if (obj.id === 'workarea') return
      this.canvas.remove(obj)
    })
    this.canvas.renderAll()
  }

  remove = (target, save = true) => {
    if (!this.editable) return

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

    if (save && !this.transactionHandler.active)
      this.transactionHandler.save(TRANSACTION_TYPES.remove)
  }

  alignText = (align) => {
    if (!this.editable) return

    const text = this.canvas.getActiveObject()

    if (!text || text?.type !== 'i-text') return
    this.setByPartial(text, { textAlign: align })
  }

  setTextFill = (color) => {
    if (!this.editable) return

    const text = this.canvas.getActiveObject()

    if (!text || text?.type !== 'i-text') return
    this.setByPartial(text, { fill: color })
  }

  setEditable = (canEdit) => {
    this.editable = canEdit
    if (!canEdit) this.canvas.discardActiveObject()
    this.canvas.getObjects().forEach((obj) => {
      obj.selectable = canEdit
      obj.evented = canEdit
    })
    this.canvas.renderAll()
  }

  undo = () => this.editable && this.transactionHandler.undo()

  redo = () => this.editable && this.transactionHandler.redo()

  addText = (str, options) => {
    if (!this.editable) return

    const text = new fabric.IText(str)
    text.set({
      ...fontOptions,
      ...arialOptions,
      left: this.canvas.width / 2,
      top: this.canvas.height / 6,
      originX: 'center',
      originY: 'center',
      cursorColor: 'black',
      initial: true,
      ...options,
    })

    this.canvas.add(text)
    text.enterEditing()
    text.selectAll()
    this.canvas.setActiveObject(text)
    this.canvas.requestRenderAll()

    if (!this.transactionHandler.active) this.transactionHandler.save('add')
  }

  setBackgroundImage(src) {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        const fabricImage = new fabric.Image(img)

        const ratio = Math.min(
          this.canvas.width / fabricImage.width,
          window.innerHeight / defaultCanvasOptions.height // set max height
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
    return this.canvas.toDataURL('image/png', 1.0)
  }

  setByPartial(obj, option) {
    if (!this.editable) return

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
