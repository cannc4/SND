import React, { PureComponent } from 'react'
import { Text, Group } from 'react-konva'

class NameText extends PureComponent {
  render () {
    const { text, x, y, width, height } = this.props

    return (
      <Group ref={ref => (this.textGroup = ref)}
        x={x}
        y={y}
      >
        <Text
          text={text}
          fontSize={12}
          fontFamily={'Inconsolata'}
          fill={'green'}
          padding={20}
        />
      </Group>
    )
  }
}

export default NameText
