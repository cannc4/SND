'use strict'

function undoRedo () {
  this.init({})
}

undoRedo.prototype = {
  init (obj) {
    if (this._stack && this.onremoveAction) {
      this._stack.forEach(this.onremoveAction)
    }
    this._stack = []
    this._stackInd = 0
    this._store = obj || {}
  },
  change (obj) {
    const act = {}

    const stack = this._stack

    const stackInd = this._stackInd
    let stackLen = stack.length

    if (stackInd < stackLen) {
      if (this.onremoveAction) {
        while (stackInd < stackLen) {
          this.onremoveAction(this._stack[--stackLen])
        }
      }
      stack.length = stackInd
    }
    ++this._stackInd
    act.redo = obj
    act.undo = this._composeUndo(this._store, obj)
    act.index = stack.push(act)
    this._change(act, 'redo', this.onnewAction)
  },
  goToAction (act) {
    let n = act.index - this._stackInd

    if (n < 0) {
      while (n++ < 0) { this.undo() }
    } else if (n > 0) {
      while (n-- > 0) { this.redo() }
    }
  },
  getCurrentAction () {
    return this._stack[this._stackInd - 1]
  },
  undo () {
    if (this._stackInd > 0) {
      return this._change(this._stack[--this._stackInd], 'undo', this.onundoAction)
    }
  },
  redo () {
    if (this._stackInd < this._stack.length) {
      return this._change(this._stack[this._stackInd++], 'redo', this.onredoAction)
    }
  },

  // private:
  _change (act, dir, fn) {
    const obj = act[dir]

    fn && fn(act)
    this._assign(this._store, obj)
    this.onchange && this.onchange(obj)
    return obj
  },
  _composeUndo (data, obj) {
    if (data && obj && typeof data === 'object' && typeof obj === 'object') {
      const undo = {}

      for (const k in obj) {
        if (data[k] !== obj[k]) {
          undo[k] = this._composeUndo(data[k], obj[k])
        }
      }
      return undo
    }
    return data
  },
  _copyObject (obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  _assign (a, b) {
    const aFrozen = Object.isFrozen(a)

    const aSealed = Object.isSealed(a)

    Object.entries(b).forEach(([k, val]) => {
      if (a[k] !== val) {
        if (val == null) {
          aSealed || delete a[k]
        } else if (typeof val !== 'object') {
          aFrozen || (a[k] = val)
        } else if (typeof a[k] !== 'object') {
          aFrozen || (a[k] = this._copyObject(val))
        } else {
          this._assign(a[k], val)
        }
      }
    })
    return a
  }
}
