import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const DateSeparatedList = props => {
  const { items, getCompareDate, renderDate, renderItem } = props

  // To calculate if a build is on a previous day,
  // we store lastDate. For first comparison, lastDate is set to tomorrow.
  let lastDate = moment(new Date()).startOf('day').add(1, 'days')

  return (
    <div>
      {items.map(item => {
        const compareDateAgainst = getCompareDate(item)
        const dayDiff =
          moment(compareDateAgainst)
          .startOf('day')
          .diff(lastDate, 'days')

        lastDate = compareDateAgainst

        return (
          <div key={item}>
            {dayDiff < 0 && renderDate(lastDate)}
            {renderItem(item)}
          </div>
        )
      })}
    </div>
  )
}

DateSeparatedList.propTypes = {
  items: PropTypes.array.isRequired,
  getCompareDate: PropTypes.func.isRequired,
  renderDate: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired
}

export default DateSeparatedList
