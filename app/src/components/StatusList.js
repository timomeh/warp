import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import FlipMove from 'react-flip-move'
import slug from 'slug'

const Box = glamorous.div({
  background: '#FFFFFF',
  boxShadow: '0 1px 3px 0 rgba(0,0,0,0.20)',
  borderRadius: 2,
  height: 48,
  marginTop: 8,
  overflow: 'hidden'
})

const StatusList = props => {
  const { items, renderItem } = props

  return (
    <FlipMove duration={130} easing="ease-in-out">
      {items.map(item => (
        <Box key={slug(item.ref)}>
          {renderItem(item)}
        </Box>
      ))}
    </FlipMove>
  )
}

StatusList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired
}

export default StatusList
