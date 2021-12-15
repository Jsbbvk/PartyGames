class EventHandler {
  constructor(handler) {
    this.handler = handler
    this.initEvents()
  }

  initEvents = () => {
    this.handler.canvas.on('selection:cleared', this.handleTextExit)
    this.handler.canvas.on('object:rotating', this.handleObjectRotating)
    window.addEventListener('keydown', this.keydown, false)

    if (this.handler.isMobile) {
      this.handler.canvas.on('text:editing:entered', this.handleScroll)
    }
  }

  destroy = () => {
    this.handler.canvas.off('text:editing:exited', this.handleTextExit)
    this.handler.canvas.off('object:rotating', this.handleObjectRotating)
    window.removeEventListener('keydown', this.keydown, false)

    if (this.handler.isMobile) {
      this.handler.canvas.off('text:editing:entered', this.handleScroll)
    }
  }

  handleObjectRotating = (e) => {
    if (this.handler.isMobile) return
    const { target } = e

    const angleThreshold = 3
    if (
      Math.abs(target.angle % 90) <= angleThreshold ||
      Math.abs(target.angle % 90) >= 90 - angleThreshold
    ) {
      const offset = Math.abs(target.angle % 90) <= angleThreshold ? 0 : 1
      this.handler.setByPartial(target, {
        angle:
          Math.round(
            (target.angle + Math.sign(target.angle) * angleThreshold) / 90
          ) * 90,
      })
    }
  }

  keydown = (e) => {
    if (e.code === 'Backspace' || e.code === 'Delete') this.handler.remove()
    // TODO ctrl-z (ctrl-shift-z ctrl-y)
  }

  handleTextExit = (e) => {
    if (e.deselected[0]?.text === '') {
      this.handler.remove(e.deselected[0])
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
    if (this.handler.isMobile && y > height / 2)
      doScrolling(Math.max(0, y + window.scrollY - height / 4), 250)
  }
}

export default EventHandler
