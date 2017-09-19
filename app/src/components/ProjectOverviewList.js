import React from 'react'

const ProjectOverviewList = props => {
  const { items, renderItem } = props

  return (
    <div>
      {items.map((item, i) => (
        <div key={i}>{renderItem(item)}</div>
      ))}
    </div>
  )
}

export default ProjectOverviewList
