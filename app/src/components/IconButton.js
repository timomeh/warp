import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import Icon from 'components/Icon'

const Button = glamorous.button({
  border: 'none',
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  outline: 0,
  background: 'none',
  cursor: 'pointer'
})

const IconButton = props => {
  const { icon, onClick = () => {}, color } = props

  return (
    <Button onClick={onClick}>
      <Icon icon={icon} style={{ fill: color }} width={16} height={16} />
    </Button>
  )
}

IconButton.propTypes = {
  icon: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.string.isRequired
}

export default IconButton
