import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import glamorous from 'glamorous'

const Colored = glamorous.div(({ diff }) => {
  switch (diff) {
    case 'under': return { color: '#8BC34A'}
    case 'over': return { color: '#D32F2F'}
    case 'same': return { color: '#9A9A9A'}
    default: return { color: '#9A9A9A'}
  }
})

const DurationDiff = props => {
  const { startedAt, finishedAt, mean } = props

  const durationS = moment(finishedAt).diff(moment(startedAt))/1000 | 0
  const meanS = (mean | 0)
  const diffS = durationS - meanS
  const plusMinus = diffS >= 0 ? (diffS > 0 ? '+' : '±') : '-'
  const diffString = plusMinus + moment.utc(Math.abs(diffS)*1000).format("mm:ss")

  const diffRatio = durationS/meanS

  let diffType
  if (diffRatio > 1.15) diffType = 'over'
  else if (diffRatio < 0.85) diffType = 'under'
  else diffType = 'same'

  return (
    <Colored diff={diffType}>({diffString})</Colored>
  )
}

DurationDiff.propTypes = {
  startedAt: PropTypes.string.isRequired,
  finishedAt: PropTypes.string.isRequired,
  mean: PropTypes.number.isRequired
}

export default DurationDiff
