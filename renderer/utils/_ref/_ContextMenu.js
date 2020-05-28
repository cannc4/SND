import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Rect, Text, Group } from 'react-konva'

class DefaultContextMenuItem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      relContainingRect: null
    }
  }

  componentDidMount () {
    this.setState({
      relContainingRect: this.contextElem.getClientRect({ relativeTo: this.contextElem.getParent() })
    })
  }

  render () {
    const containingRect = this.state.relContainingRect

    return (
      <Group
        ref={elem => this.contextElem = elem}
        x={this.props.x}
        y={this.props.y}
        onMouseUp={this.props.onClick}
        onMouseLeave={this.props.onMouseLeave}
        onMouseOver={this.props.onMouseOver}>
        { (this.props.minWidth && containingRect) && <Rect
          fill={!this.props.isActive ? '#404040' : '#666666'}
          width={this.props.minWidth}
          height={containingRect.height} />
        }
        <Text
          text={this.props.text}
          fontSize={12}
          fontFamily={'Inconsolata'}
          fill={'#ffffff'}
          padding={10} />
      </Group>
    )
  }
}

export default class ContextMenuKonva extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      activeIndex: null,
      relContainingRect: null,
      isMouseOver: null,
      visible: false,
      x: 0,
      y: 0
    }

    this.setVisibility = this.setVisibility.bind(this)
    this.onDocumentClick = this.onDocumentClick.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.visible && !prevState.visible) {
      document.addEventListener('mouseup', this.onDocumentClick)
      this.setState({
        relContainingRect: this.contextElem.getClientRect({ relativeTo: this.contextElem.getParent() })
      })
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onDocumentClick)
  }

  setVisibility (visible, x, y) {
    this.setState({
      isMouseOver: visible ? true : null,
      visible,
      x,
      y })
  }

  onDocumentClick () {
    // if clicked outside set visibility to false
    // remove the event listener
    if (this.state.isMouseOver !== null &&
            !this.state.isMouseOver &&
            this.state.visible) {
      this.setVisibility(false, 0, 0)
      document.removeEventListener('click', this.onDocumentClick)
    }
  }

  render () {
    if (!this.state.visible) {
      return null
    }

    const itemHeight = 25
    const containingRect = this.state.relContainingRect
    // if item is text create menu item
    // if item is an array create a sub menu -> this should be

    const items = []

    this.props.menuItems.forEach((item, i) => {
      if (typeof item === 'Array') {
        // multi level selections
      }

      const menuItem = <this.props.ContextMenuItemComponent
        onMouseLeave={() => this.setState({ activeIndex: null })}
        onMouseOver={() => this.setState({ activeIndex: i })}
        isActive={i === this.state.activeIndex}
        minWidth={containingRect && containingRect.width}
        key={i}
        x={this.state.x}
        y={this.state.y + i * itemHeight}
        text={item.text}
        onClick={item.onClick} />

      items.push(menuItem)
    })

    return <Group
      ref={elem => this.contextElem = elem}
      onMouseLeave={() => this.setState({ isMouseOver: false })}
      onMouseOver={() => this.setState({ isMouseOver: true })}>
      {containingRect && <Rect
        x={this.state.x}
        y={this.state.y}
        width={containingRect.width}
        height={containingRect.height}
        fill={'#404040'} />
      }
      {items}
    </Group>
  }
}

ContextMenuKonva.props = {
  ContextMenuItemComponent: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  menuItems: PropTypes.array,
  visible: PropTypes.bool
}

ContextMenuKonva.defaultProps = {
  ContextMenuItemComponent: DefaultContextMenuItem,
  x: 0,
  y: 0,
  width: 100,
  visible: false
}
