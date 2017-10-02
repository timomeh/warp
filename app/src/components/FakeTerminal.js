import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { fontFamily } from 'bits/styles'

const Terminal = glamorous.pre({
  margin: 0,
  fontFamily: fontFamily.code,
  fontWeight: 500,
  color: '#FFFFFF',
  fontSize: 12,
  backgroundColor: '#2F2F2F',
  borderRadius: 3,
  padding: 12,
  overflow: 'auto'
})

const FakeTerminal = props => {
  const { text } = props

  return (
    <Terminal>{text}</Terminal>
  )
}

FakeTerminal.propTypes = {
  text: PropTypes.string
}

export default FakeTerminal
