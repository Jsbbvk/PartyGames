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
    this.rotate = { adjustRotation: 0, currentRotation: 0 }
    if (this.handler.isMobile) this.initHammer()
  }

  initHammer() {
    this.hammer = new Hammer(this.handler.container, {
      touchAction: 'pan-y pan-x',
    })
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
  }

  onPinchStart = (e) => {
    const object = this.handler.canvas.getActiveObject()
    if (!object || (object.type === 'i-text' && object.isEditing)) return
    this.scale.adjustScaleX = object.scaleX
    this.scale.adjustScaleY = object.scaleY
    this.rotate.adjustRotation -= e.rotation

    this.handler.setByPartial(object, {
      lockMovementX: true,
      lockMovementY: true,
      editable: false,
    })
  }

  onPinchMove = (e) => {
    this.scale.currentScaleX = this.scale.adjustScaleX * e.scale
    this.scale.currentScaleY = this.scale.adjustScaleY * e.scale
    this.rotate.currentRotation = this.rotate.adjustRotation + e.rotation

    const object = this.handler.canvas.getActiveObject()
    if (!object || (object.type === 'i-text' && object.isEditing)) return

    if (!(this.scale.currentScaleX > 0.5 && this.scale.currentScaleY > 0.5)) {
      this.scale.currentScaleY = object.scaleY
      this.scale.currentScaleX = object.scaleX
    }

    if (
      Math.abs(this.rotate.currentRotation % 90) <= 3 ||
      Math.abs(this.rotate.currentRotation % 90) >= 90 - 3
    ) {
      this.rotate.currentRotation =
        Math.round(
          (this.rotate.currentRotation +
            Math.sign(this.rotate.currentRotation) * 3) /
            90
        ) * 90
    }

    object.set({
      scaleX: this.scale.currentScaleX,
      scaleY: this.scale.currentScaleY,
    })
    object.rotate(this.rotate.currentRotation)
    object.setCoords()

    this.handler.canvas.renderAll()
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
    }, 150)

    this.scale.adjustScaleX = this.scale.currentScaleX
    this.scale.adjustScaleY = this.scale.currentScaleY
    this.rotate.adjustRotation = this.rotate.currentRotation
  }
}

export default HammerHandler
