import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import moment from 'moment'

import icons from 'bits/icons'
import InfoWithIcon from 'components/InfoWithIcon'
import InfoWithTitle from 'components/InfoWithTitle'

const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap'
})

const Item = glamorous.div({
  '&:not(:last-of-type)': { marginRight: 16 }
})

const Times = props => {
  const { startedAt, finishedAt } = props

  function timeToString(time) {
    return time
      ? moment(time).format('YYYY-MM-DD HH:mm:ss')
      : '–'
  }

  const startedString = timeToString(startedAt)
  const finishedString = timeToString(finishedAt)

  return (
    <InfoWithIcon
      isMultiline
      icon={icons.time}
      info={
        <Row>
          <Item>
            <InfoWithTitle
              name="Started:"
              value={startedString}
            />
          </Item>
          <Item>
            <InfoWithTitle
              name="Finished:"
              value={finishedString}
            />
          </Item>
        </Row>
      }
    />
  )
}

Times.propTypes = {
  startedAt: PropTypes.string.isRequired,
  finishedAt: PropTypes.string
}

export default Times
