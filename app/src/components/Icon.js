import React from 'react'
import PropTypes from 'prop-types'

const Icon = props => {
  const {
    icon,
    width = 24,
    height = 24,
    style
  } = props

  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={icon.viewBox}>
      {icon.path}
    </svg>
  )
}

Icon.propTypes = {
  icon: PropTypes.shape({
    viewBox: PropTypes.string.isRequired,
    path: PropTypes.node.isRequired
  }).isRequired,
  width: PropTypes.number,
  height: PropTypes.number
}

export default Icon
