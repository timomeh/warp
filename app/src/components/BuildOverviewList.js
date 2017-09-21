import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'
import FlipMove from 'react-flip-move'
import slug from 'slug'

const BuildOverviewList = props => {
  const { items, renderItem } = props

  return (
    <FlipMove duration={130} easing="ease-in-out">
      {items.map(item => (
        <Div marginBottom={8} key={slug(item.type)}>
          {renderItem(item)}
        </Div>
      ))}
    </FlipMove>
  )
}

BuildOverviewList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired
}

export default BuildOverviewList
