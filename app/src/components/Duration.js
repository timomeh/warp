import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import glamorous from 'glamorous'

import icons from 'bits/icons'
import InfoWithIcon from 'components/InfoWithIcon'
import InfoWithTitle from 'components/InfoWithTitle'
import Timer from 'components/Timer'
import DurationDiff from 'components/DurationDiff'

const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap'
})

const Item = glamorous.div({
  '&:not(:last-of-type)': { marginRight: 16 }
})

const Duration = props => {
  const { startedAt, finishedAt, mean, hideMean = false } = props

  function timesToDuration(from, to) {
    if (from == null && to == null) return "–"
    else if (to == null) return <Timer datetime={from} />
    else return moment(moment(to).diff(moment(from))).format("mm:ss")
  }

  const duration = timesToDuration(startedAt, finishedAt)
  const meanDurationMs = moment.duration(mean, 'seconds').asMilliseconds()
  const meanDuration = moment.utc(meanDurationMs).format("mm:ss")

  return (
    <InfoWithIcon
      isMultiline
      icon={icons.duration}
      info={
        <Row>
          <Item>
            <InfoWithTitle
              name="Duration:"
              value={duration}
            />
          </Item>
          {!hideMean &&
            <Item>
              <InfoWithTitle
                name="Mean Duration:"
                value={meanDuration}
              />
            </Item>
          }
          {(startedAt && finishedAt) &&
            <Item>
              <DurationDiff
                startedAt={startedAt}
                finishedAt={finishedAt}
                mean={mean}
              />
            </Item>
          }
        </Row>
      }
    />
  )
}

Duration.propTypes = {
  startedAt: PropTypes.string.isRequired,
  mean: PropTypes.number.isRequired,
  finishedAt: PropTypes.string,
  hideMean: PropTypes.bool
}

export default Duration
