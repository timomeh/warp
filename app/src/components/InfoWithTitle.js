import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { fontWeight } from 'bits/styles'

const Name = glamorous.div({
  marginRight: 4,
  fontWeight: fontWeight.semibold,
})

const Value = glamorous.div({
  minWidth: 0,
  flex: 1
})

const Outer = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  fontSize: 14,
  color: '#595959'
})

const TitleValue = props => {
  const { name, value } = props

  return (
    <Outer>
      <Name>{name}</Name>
      <Value>{value}</Value>
    </Outer>
  )
}

TitleValue.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
}

export default TitleValue
