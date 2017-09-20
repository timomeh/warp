import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'

const StatusList = props => {
  const { items, renderItem } = props

  return (
    <div>
      {items.map(item => (
        <Div marginTop={8} key={item.id}>
          {renderItem(item)}
        </Div>
      ))}
    </div>
  )
}

StatusList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired
}

export default StatusList
