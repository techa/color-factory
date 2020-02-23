import 'lzma/src/lzma_worker.js' /* global LZMA */
import base64 from 'base64-js'


export function searchToObject () {
  // modified from https://stackoverflow.com/a/7090123/806777
  return window.location.search.slice(1).split('&').reduce((result, value) => {
    const parts = value.split('=').map(decodeURIComponent)
    if (parts[0]) {
      let val = parts[1]
      try {
        val = base64.toByteArray(val)
        val = LZMA.decompress(val)
        val = JSON.parse(val)
      } catch (error) {
        console.error(`ParseError: ${error}`)
        return result
      }
      result[parts[0]] = val
    }
    return result
  }, {})
}

export function objectToUrl (object, key) {
  let val = ''
  try {
    val = JSON.stringify(object)
    val = LZMA.compress(val)
    val = base64.fromByteArray(val)
  } catch (error) {
    throw new Error(`ParseError: ${error}`)
  }
  const href = `?${encodeURIComponent(key || 'data')}=${encodeURIComponent(val)}`
  window.history.replaceState('', document.title, href)
}

