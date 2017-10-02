import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'
import FlipMove from 'react-flip-move'
import slug from 'slug'

const BuildOverviewList = props => {
  const { items, renderItem, uniqueKey } = props

  return (
    <FlipMove duration={130} easing="ease-in-out">
      {items.map(item => (
        <Div marginBottom={32} key={slug(item[uniqueKey])}>
          {renderItem(item)}
        </Div>
      ))}
    </FlipMove>
  )
}

BuildOverviewList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  uniqueKey: PropTypes.string.isRequired
}

export default BuildOverviewList
