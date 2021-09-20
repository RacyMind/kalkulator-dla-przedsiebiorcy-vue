function deepEqual (object1, object2) {
  if (object1 === null && object2 === null) {
    return true
  }
  if (object1 === null && object2 !== null) {
    return false
  }
  if (object2 === null && object1 !== null) {
    return false
  }
  if (typeof object1 === 'undefined' || typeof object2 === 'undefined') {
    return false
  }

  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false
    }
  }

  return true
}

function isObject (object) {
  return object != null && typeof object === 'object'
}

export { deepEqual }
