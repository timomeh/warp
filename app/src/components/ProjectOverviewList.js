import React from 'react'
import { NavLink } from 'react-router-dom'
import { css } from 'glamor'

const ProjectOverviewList = props => {
  const { projects, renderItem } = props

  const item = css({
    display: 'block',
    borderBottom: '1px solid #EBE8DC',
    textDecoration: 'none'
  })

  const activeItem = css({
    backgroundColor: '#F8F8F8'
  })

  return (
    <div>
      {projects.map(project => (
        <NavLink
          to={`/projects/${project.id}`}
          key={project.id}
          className={item.toString()}
          activeClassName={activeItem.toString()}
        >
          {renderItem(project)}
        </NavLink>
      ))}
    </div>
  )
}

export default ProjectOverviewList
