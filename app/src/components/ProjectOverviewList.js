import React from 'react'
import glamorous from 'glamorous'

const Item = glamorous.div(({ active }) => ({
  borderBottom: '1px solid #EBE8DC',
  cursor: 'pointer',
  backgroundColor: active && '#F8F8F8'
}))

const ProjectOverviewList = props => {
  const { projects, renderItem, onItemClick, selectedProject } = props

  return (
    <div>
      {projects.map(project => (
        <Item
          onClick={() => onItemClick(project.id)}
          active={selectedProject === project.id}
          key={project.id}
        >
          {renderItem(project)}
        </Item>
      ))}
    </div>
  )
}

export default ProjectOverviewList
