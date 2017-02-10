import RiotKeyManager from '../RiotManager.js'
import store from './store.js'


export const keymaps = [
  // { key: 'ctrl+shift+alt+left',
  //   action: 'cursorColumnSelectLeft',
  //   mode: 'default' },
  { key: 'ctrl+c',
    action: 'copy',
    mode: 'default' },
  {key: 'ctrl+a',
    action: 'selectAll',
    mode: 'default' },
  { key: 'shift+w',
    action: 'cursorColumnSelectLeft',
    mode: 'default' },
]
const keyManager = new RiotKeyManager({})

keyManager.addStore(store)
keyManager.addKeymap('default', [
  { key: 'ctrl+z',
    action: 'undo',
    mode: 'default' },
  { key: 'ctrl+y',
    action: 'redo',
    mode: 'default' },
  { key: 'ctrl+shift+z',
    action: 'redo',
    mode: 'default' },
])
export default keyManager
