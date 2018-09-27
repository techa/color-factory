export default {
  paletteName: 'Hsl Color Circle',
  cards: [
    ...Array.from('0123456789abcdefghijklmnopqrstuvwxyz')
      .map((name, i) => ({ name, color: `hsl(${i * 10},100%,50%)` })),
    {
      text: '',
      align: 'center',
    },
  ],
  bgColor: '#222222',
  sortX: 'deg',
  sortY: 'saturationv',
}
