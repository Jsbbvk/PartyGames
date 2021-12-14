import Hammer from 'hammerjs'

class HammerHandler {
  constructor(handler) {
    this.handler = handler
    this.scale = {
      adjustScaleX: 0,
      adjustScaleY: 0,
      currentScaleX: 0,
      currentScaleY: 0,
    }
    if (this.handler.isMobile) this.initHammer()
  }

  initHammer() {
    this.hammer = new Hammer(this.handler.container)
    this.hammer.get('pinch').set({ enable: true })
    this.hammer.get('rotate').set({ enable: true })
    const pinch = this.hammer.get('pinch')
    const rotate = this.hammer.get('rotate')
    const pan = this.hammer.get('pan')
    pinch.recognizeWith(rotate)
    pan.recognizeWith(pinch)

    this.hammer.on('pinchstart rotatestart', this.onPinchStart)
    this.hammer.on('pinchend rotateend', this.onPinchEnd)
    this.hammer.on('pinchmove rotatemove', this.onPinchMove)
    this.hammer.on('panstart', () => console.log('pan'))
  }

  onPinchStart = (e) => {
    console.log('pinch start')
    const object = this.handler.canvas.getActiveObject()
    if (!object || (object.type === 'i-text' && object.isEditing)) return
    this.scale.adjustScaleX = object.scaleX
    this.scale.adjustScaleY = object.scaleY

    this.handler.setByPartial(object, {
      lockMovementX: true,
      lockMovementY: true,
      editable: false,
    })
  }

  onPinchMove = (e) => {
    this.scale.currentScaleX = this.scale.adjustScaleX * e.scale
    this.scale.currentScaleY = this.scale.adjustScaleY * e.scale

    const object = this.handler.canvas.getActiveObject()
    if (!object || (object.type === 'i-text' && object.isEditing)) return

    if (!(this.scale.currentScaleX > 0.5 && this.scale.currentScaleY > 0.5)) {
      this.scale.currentScaleY = object.scaleY
      this.scale.currentScaleX = object.scaleX
    }

    console.log(
      this.scale.currentScaleX,
      this.scale.currentScaleY,
      this.scale?.adjustScaleX,
      this.scale?.adjustScaleX,
      e.scale
    )

    this.handler.setByPartial(object, {
      scaleX: this.scale.currentScaleX,
      scaleY: this.scale.currentScaleY,
    })
  }

  onPinchEnd = (e) => {
    const object = this.handler.canvas.getActiveObject()
    if (!object || (object.type === 'i-text' && object.isEditing)) return

    setTimeout(() => {
      this.handler.setByPartial(object, {
        lockMovementX: false,
        lockMovementY: false,
        editable: true,
      })
    }, 250)

    this.scale.adjustScaleX = this.scale.currentScaleX
    this.scale.adjustScaleY = this.scale.currentScaleY
  }
}

export default HammerHandler
