import { fabric } from 'fabric'
import throttle from 'lodash/throttle'

class TransactionHandler {
  constructor(handler) {
    this.handler = handler

    this.redos = []
    this.undos = []
    this.state = []
    this.active = false
  }

  save = (type) => {
    if (!this.handler.editable) return

    try {
      const { objects } = this.handler.canvas.toJSON()

      if (this.state) {
        const json = JSON.stringify(this.state)
        this.redos = []
        this.undos.push({
          type,
          json,
        })
      }

      this.state = objects.filter((obj) => obj.id !== 'workarea')
      this.emitTransaction()
    } catch (error) {
      console.error(error)
    }
  }

  emitTransaction = () => {
    if (this.handler.onTransaction) {
      this.handler.onTransaction({
        undos: this.undos,
        redos: this.redos,
      })
    }
  }

  resetState = () => {
    if (!this.handler.editable) return

    this.state = this.handler.canvas
      .toJSON()
      .objects.filter((obj) => obj.id !== 'workarea')

    this.emitTransaction()
  }

  redo = throttle(() => {
    if (!this.handler.editable) return

    const redo = this.redos.pop()
    if (!redo) {
      return
    }

    this.undos.push({
      type: 'undo',
      json: JSON.stringify(this.state),
    })
    this.replay(redo)
  }, 100)

  undo = throttle(() => {
    if (!this.handler.editable) return

    const undo = this.undos.pop()

    if (!undo) {
      return
    }

    this.redos.push({
      type: 'redo',
      json: JSON.stringify(this.state),
    })
    this.replay(undo)
  }, 100)

  replay = (transaction) => {
    if (!this.handler.editable) return

    const objects = JSON.parse(transaction.json)
    this.state = objects
    this.active = true
    this.handler.canvas.renderOnAddRemove = false
    this.handler.clear()
    this.handler.canvas.discardActiveObject()

    fabric.util.enlivenObjects(
      objects,
      (enlivenObjects) => {
        enlivenObjects.forEach((obj) => {
          obj.set({
            hasControls: !this.handler.isMobile,
            selectable: !obj.lockAllActions,
            evented: !obj.lockAllActions,
            hoverCursor: obj.lockAllActions ? 'default' : 'move',
          })
          // eslint-disable-next-line no-underscore-dangle
          const targetIndex = this.handler.canvas._objects.length
          this.handler.canvas.insertAt(obj, targetIndex, false)
        })
        this.handler.canvas.renderOnAddRemove = true
        this.active = false
        this.handler.canvas.renderAll()
        this.emitTransaction()
      },
      null
    )
  }
}

export default TransactionHandler
