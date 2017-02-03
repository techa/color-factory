import DiffMatchPatch from 'diff-match-patch'
const dmp = new DiffMatchPatch()

function makePatches (oldContent, newContent) {
  return dmp.patch_make(oldContent, newContent)
}
function applyPatches (patches, content) {
  return dmp.patch_apply(patches, content)[0]
}
function reversePatches (patches) {
  patches = dmp.patch_deepCopy(patches).reverse()
  patches.forEach((patch) => {
    patch.diffs.forEach((diff) => {
      diff[0] = -diff[0]
    })
  })
  return patches
}

export class Undo {
  constructor (initialState, stateChange) {
    this.undoStack = []
    this.currentPatches = []
    this.redoStack = []

    this.stringify = typeof initialState !== 'string'
    this.currentStateText = JSON.stringify(initialState)
    this.currentState = JSON.parse(this.currentStateText)
    this.stateChange = typeof stateChange === 'function' ? stateChange : function () {}

    this.undoMax = 50
  }

  undo () {
    const patches = this.undoStack.pop()
    if (!patches) {
      return
    }
    this.redoStack.push(this.currentPatches)
    this.currentPatches = patches
    this.restoreState()
    return this.currentState
  }
  redo () {
    const patches = this.redoStack.pop()
    if (!patches) {
      return
    }
    this.undoStack.push(this.currentPatches)
    this.currentPatches = patches
    this.restoreState(true)
    return this.currentState
  }

  saveState (newState, typing) {
    let currentTime, lastTime

    const newStateText = JSON.stringify(newState)
    const currentStateText = this.currentStateText = JSON.stringify(this.currentState)

    return new Promise((resolve, reject) => {
      console.log('saveState', currentStateText !== newStateText, makePatches(currentStateText, newStateText))
      if (currentStateText !== newStateText) {
        this.redoStack.length = 0

        currentTime = Date.now()
        if (!typing || (typing && currentTime - lastTime > 1000)) {
          this.undoStack.push(makePatches(currentStateText, newStateText))
          while (this.undoStack.length > this.undoMax) {
            this.undoStack.shift()
          }
        }

        this.currentState = JSON.parse(newStateText)
        lastTime = currentTime
        this.stateChange()
      }
    })
  }

  restoreState (isForward) {
    if (!isForward) {
      this.currentPatches = reversePatches(this.currentPatches)
    }

    const newState = applyPatches(this.currentPatches, this.currentStateText)
    this.currentState = JSON.parse(newState)
    this.stateChange()
  }
}
