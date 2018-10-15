export function hsl2zaa ({ h, s, l }) {
  let str = '$'
  const length6 = (h % 10 + s % 10 + l % 10)
  str += (h / 10 | 0).toString(36)
  if (length6) {
    str += (h % 10)
  }
  str += (s / 10 | 0).toString(11)
  if (length6) {
    str += (s % 10)
  }
  str += (l / 10 | 0).toString(11)
  if (length6) {
    str += (l % 10)
  }
  return str
}
/**
 * /^\$([0-9a-z]\d(\d\d|a0){2,3}|[0-9a-z][0-9a]{2,3}?)$/i
 *
 * @param {string} str
 */
export function zaa2hsl (str) {
  if (str[0] === '$') {
    str = str.slice(1)
  }
  if (str.length === 3) {
    str = `${str[0]}0${str[1]}0${str[2]}0`
  }
  return {
    h: parseInt(str[0], 36) * 10 + parseInt(str[1], 10) | 0,
    s: parseInt(str[2], 11) * 10 + parseInt(str[3], 10) | 0,
    l: parseInt(str[4], 11) * 10 + parseInt(str[5], 10) | 0,
  }
}

