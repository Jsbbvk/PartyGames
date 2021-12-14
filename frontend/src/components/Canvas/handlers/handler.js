import { fabric } from 'fabric'
import {
  objectOptions,
  fontOptions,
  impactOptions,
  arialOptions,
} from '../constants'
import HammerHandler from './HammerHandler'

export default class Handler {
  constructor(options) {
    this.initialize(options)
  }

  initialize(options) {
    this.initOptions(options)
    this.hammerHandler = new HammerHandler(this)

    this.canvas.on('text:editing:entered', this.handleScroll)
    this.canvas.on('selection:cleared', this.handleTextExit)
  }

  initOptions(options) {
    this.id = options?.id
    this.canvas = options?.canvas
    this.container = options?.container
    this.width = options?.width
    this.height = options?.height
    this.isMobile = options?.isMobile
  }

  handleTextExit = (e) => {
    if (e.deselected[0]?.text === '') {
      this.canvas.remove(e.deselected[0])
    }
  }

  handleScroll = (e) => {
    function doScrolling(elementY, duration) {
      const startingY = window.pageYOffset
      const diff = elementY - startingY
      let start

      // Bootstrap our animation - it will get called right before next frame shall be rendered.
      window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp
        // Elapsed milliseconds since start of scrolling.
        const time = timestamp - start
        // Get percent of completion in range [0, 1].
        const percent = Math.min(time / duration, 1)

        window.scrollTo(0, startingY + diff * percent)

        // Proceed with animation as long as we wanted it to.
        if (time < duration) {
          window.requestAnimationFrame(step)
        }
      })
    }

    const y = e.target.hiddenTextarea.getBoundingClientRect().top
    const height = window.innerHeight
    if (this.isMobile && y > height / 2)
      doScrolling(Math.max(0, y + window.scrollY - height / 4), 250)
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

  destroy() {
    this.canvas.renderAll()
    // unbind all handlers
    this.canvas.off('text:editing:entered', this.handleScroll)
    this.canvas.off('text:editing:exited', this.handleTextExit)
  }

  setByPartial(obj, option) {
    if (!obj) {
      return
    }
    obj.set(option)
    obj.setCoords()
    this.canvas.renderAll()
  }
}
