export default {
  paletteName: 'Fuji',
  cards: [
    { name: 'Background', color: '#1d141f' },
    { name: 'Text', color: '#f0ebdb' },
    { name: '{}()[]', color: '#bfc0c5' },
    { name: 'Invalid', color: '#FF5370' },
    { name: 'Comment', color: '#72747d' },
    { name: 'Variables', color: '#c3bbe2' },
    { name: 'Property Name', color: '#c3bbe2' },
    { name: 'Keyword', color: '#6ea451' },
    { name: 'Storage', color: '#778a33' },
    { name: 'Operator', color: '#6da895' },
    { name: 'Constant, Numeric, Color, Escape Characters', color: '#c274a7' },
    { name: 'Math, JSON', color: '#c274a7' },
    { name: 'Booleans and null', color: '#c274a7' },
    { name: 'String', color: '#db9da7' },
    { name: 'Function', color: '#8b81c4' },
    { name: 'Class', color: '#f5c133' },
    { name: 'Built-in Class', color: '#bf8ed4' },
  ].map((item, i) => {
    item.textMode = !!i
    return item
  }),
  bgColor: '#1d141f',
}
