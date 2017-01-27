
function keydownHandler (handler) {
  return function (e) {
    if (
      e.which !== 17 && // Ctrl
      e.which !== 91 && // Cmd
      e.which !== 18 && // Alt
      e.which !== 16 // Shift
    ) {
      handler(e)
    }
  }
}

function Keystroke (handler, priority) {
  this.handler = handler
  this.priority = priority || 100
}

const keystrokes = [
  new Keystroke((e) => {
    if ((!e.ctrlKey && !e.metaKey) || e.altKey) {
      return
    }
  }),
]

window.addEventListener('keydown', keydownHandler((e) => {
  keystrokes.some(function (keystroke) {
    if (keystroke.handler(e)) {
      return true
    }
  })
}))
