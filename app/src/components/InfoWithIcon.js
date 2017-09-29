import React from 'react'
import PropTypes from 'prop-types'

import InfoWithGraphic from 'components/InfoWithGraphic'
import Icon from 'components/Icon'

const InfoWithIcon = props => {
  const { size = 14, icon, info, isMultiline = false } = props

  return (
    <InfoWithGraphic
      isMultiline={isMultiline}
      graphic={
        <Icon
          width={size}
          height={size}
          style={{ fill: '#6A6A6A'}}
          icon={icon}
        />
      }
      info={info}
    />
  )
}

InfoWithIcon.propTypes = {
  isMultiline: PropTypes.bool,
  icon: PropTypes.object.isRequired,
  size: PropTypes.number,
  info: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
}

export default InfoWithIcon
