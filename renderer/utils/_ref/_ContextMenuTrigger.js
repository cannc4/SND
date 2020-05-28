import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Group, Rect } from 'react-konva'

export default class ContextMenuTriggerKonva extends Component {
  constructor (props) {
    super(props)

    this.state = {
      relContainingRect: null,
      absContainingRect: null
    }

    this.onClick = this.onClick.bind(this)
  }

  componentDidMount () {
    this.setState({
      relContainingRect: this.contextElem.getClientRect({ relativeTo: this.contextElem.getParent() }),
      absContainingRect: this.contextElem.getClientRect()
    })
  }

  onClick (e) {
    if (e.evt.button === 2) {
      const absContainingRect = this.state.absContainingRect
      const relContainingRect = this.state.relContainingRect
      if (this.props.menuRef) {
        this.props.menuRef.setVisibility(
          true,
          e.evt.offsetX - (absContainingRect.x - relContainingRect.x),
          e.evt.offsetY - (absContainingRect.y - relContainingRect.y))
      }
    }
  }

  render () {
    const containingRect = this.state.relContainingRect
    console.log(containingRect)

    return (<Group ref={elem => this.contextElem = elem}>
      {containingRect &&
      <Rect
        onMouseUp={this.onClick}
        y={containingRect.y}
        x={containingRect.x}
        width={containingRect.width}
        height={containingRect.height}
        fill='transparent' />
      }
      {this.props.children}
    </Group>)
  }
}

ContextMenuTriggerKonva.props = {
  children: PropTypes.node
}
