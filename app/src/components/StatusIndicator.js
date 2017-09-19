import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import { css } from 'glamor'

const rotate = css.keyframes({
  'from': { transform: 'rotate(0deg)' },
  'to': { transform: 'rotate(360deg)' }
})

const Finished = glamorous.div({
  display: 'inline-block',
  width: 16,
  height: 16,
  borderRadius: '50%',
  backgroundColor: '#9CCC65'
})

const Pending = glamorous.div({
  display: 'inline-block',
  width: 16,
  height: 16,
  borderRadius: '50%',
  border: '3px solid #FDD835'
})

const Active = glamorous.div({
  display: 'inline-block',
  width: 16,
  height: 16,
  borderRadius: '50%',
  border: '3px solid #FFEEA1',
  borderLeft: '3px solid #FFD61F',
  animation: `${rotate} 1s infinite linear`
})

const Errored = () => (
  <svg width="16px" height="16px" viewBox="0 0 16 16" fill="#D0021B">
    <polygon points="5 0 11 0 16 5 16 11 11.0527372 16 5 16 0 11 0 5"></polygon>
  </svg>
)

const StatusIndicator = props => {
  const { type } = props

  switch (type) {
    case "finished":
      return <Finished />
    case "pending":
      return <Pending />
    case "active":
      return <Active />
    case "errored":
      return <Errored />
    default:
      return <div>?</div>
  }
}



StatusIndicator.propTypes = {
  type: PropTypes.string.isRequired
}

export default StatusIndicator

export function stories({ storiesOf }) {
  storiesOf('StatusIndicator', module)
    .add('finished', () => <StatusIndicator type="finished" />)
    .add('pending', () => <StatusIndicator type="pending" />)
    .add('active', () => <StatusIndicator type="active" />)
    .add('errored', () => <StatusIndicator type="errored" />)
}
