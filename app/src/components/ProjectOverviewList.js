import React from 'react'
import glamorous from 'glamorous'

const Item = glamorous.div({
  borderBottom: '1px solid #EBE8DC'
})

const ProjectOverviewList = props => {
  const { items, renderItem } = props

  return (
    <div>
      {items.map((item, i) => (
        <Item key={i}>{renderItem(item)}</Item>
      ))}
    </div>
  )
}

export default ProjectOverviewList
