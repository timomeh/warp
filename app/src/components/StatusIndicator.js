import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import { css } from 'glamor'

import Icon from 'components/Icon'
import icons from 'bits/icons'

const rotate = css.keyframes({
  'from': { transform: 'rotate(0deg)' },
  'to': { transform: 'rotate(360deg)' }
})

const Pending = glamorous.div(({ size }) => ({
  display: 'inline-block',
  width: size,
  height: size,
  borderRadius: '50%',
  border: `${size*0.1875}px solid white`
}))

const Active = glamorous.div(({ size }) => ({
  display: 'inline-block',
  width: size,
  height: size,
  borderRadius: '50%',
  border: `${size*0.1875}px solid rgba(255, 255, 255, 0.5)`,
  borderLeft: `${size*0.1875}px solid #FFFFFF`,
  animation: `${rotate} 1s infinite linear`
}))

const StatusIndicator = props => {
  const { status, size = 16 } = props

  switch (status) {
    case "success":
      return <Icon icon={icons.checkmark} width={size} height={size} style={{ fill: 'white' }} />
    case "pending":
      return <Pending size={size} />
    case "init":
    case "active":
      return <Active size={size} />
    case "queued":
      return <Icon icon={icons.hourglass} width={size} height={size} style={{ fill: 'white' }} />
    case "failed":
      return <Icon icon={icons.times} width={size} height={size} style={{ fill: 'white' }} />
    default:
      return <div>?</div>
  }
}



StatusIndicator.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.number
}

export default StatusIndicator
