import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { fontWeight } from 'bits/styles'

const Name = glamorous.span({
  marginRight: 4
})

const Outer = glamorous.span({
  display: 'flex',
  flexFlow: 'row nowarp',
  alignItems: 'center',
  fontSize: 14,
  fontWeight: fontWeight.semibold,
  color: '#595959'
})

const Info = props => {
  const { name, value } = props

  return (
    <Outer>
      <Name>{name}:</Name>
      {value}
    </Outer>
  )
}

Info.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
}

export default Info
