import Konva from 'konva'

export function tip (text, [x, y], fill = '#555') {
  const label = new Konva.Label({
    x: x,
    y: y,
    draggable: true
  })

  // add a tag to the label
  label.add(new Konva.Tag({
    fill: fill,
    stroke: '#222',
    shadowColor: 'black',
    shadowBlur: 2,
    shadowOffset: [2, 2],
    shadowOpacity: 0.5,
    lineJoin: 'round',
    pointerDirection: 'up',
    pointerWidth: 10,
    pointerHeight: 10,
    cornerRadius: 3
  }))

  // add text to the label
  label.add(new Konva.Text({
    text: '[' + text + '] (' + x + ', ' + y + ')',
    fontSize: 10,
    lineHeight: 1,
    padding: 5,
    fill: 'white'
  }))

  return label
} {}
