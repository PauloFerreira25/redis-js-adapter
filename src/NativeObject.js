
class NativeObject {
  converter (val) {
    // console.log(this.isPrimitive(val))
    if (this.isPrimitive(val)) {
      return this.converterPrimitive(val)
    } else {
    //   console.log(this.isObject(val))
      if (this.isObject(val)) {
        return this.converterObject(val)
      } else {
        if (this.isArray(val)) {
          return this.converterArray(val)
        }
      }
    }
  }

  isArray (val) {
    return Array.isArray(val)
  }

  isObject (val) {
    return typeof val === 'object'
  }

  isBoolean (val) {
    if (String(val).toLocaleLowerCase() === 'true' || String(val).toLocaleLowerCase() === 'false') { return true } else {
      return false
    }
  }

  isPrimitive (val) {
    return typeof val === 'object' ? val === null : typeof val !== 'function'
  }

  isNumeric (num) {
    return !isNaN(num)
  }

  converterPrimitive (val) {
    if (this.isBoolean(val)) {
      return val === 'true'
    }
    if (this.isNumeric(val)) {
      return Number(val)
    }
    return val
  }

  converterArray (val) {
    return val.map(e => {
      return this.converter(e)
    })
  }

  converterObject (val) {
    // console.log(val)
    const t = Object.entries(val).reduce((curr, item) => {
      curr[item[0]] = this.converter(item[1])
      return curr
    }, {})
    // console.log({ t })
    return t
  }
}
module.exports = NativeObject
