import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import glamorous from 'glamorous'

const List = glamorous.ul({
  margin: 0,
  padding: 0,
  listStyleType: 'none'
})

const Item = glamorous.li({
  margin: 0,
  padding: 0
})

const DateSeparatedList = props => {
  const { items, getCompareDate, renderDate, renderItem } = props

  // To calculate if a build is on a previous day,
  // we store lastDate. For first comparison, lastDate is set to tomorrow.
  let lastDate = moment(new Date()).startOf('day').add(1, 'days')

  return (
    <List>
      {items.map(item => {
        const compareDateAgainst = getCompareDate(item)
        const dayDiff =
          moment(compareDateAgainst)
          .startOf('day')
          .diff(lastDate, 'days')

        lastDate = compareDateAgainst

        return (
          <Item key={item}>
            {dayDiff < 0 && renderDate(lastDate)}
            {renderItem(item)}
          </Item>
        )
      })}
    </List>
  )
}

DateSeparatedList.propTypes = {
  items: PropTypes.array.isRequired,
  getCompareDate: PropTypes.func.isRequired,
  renderDate: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired
}

export default DateSeparatedList
