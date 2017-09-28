import React from 'react'
import { connect } from 'react-redux'
import glamorous from 'glamorous'

import ProjectSwitcher from 'components/ProjectSwitcher'

const Bar = glamorous.div({
  background: '#303030',
  width: '100%',
  height: 64,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.37)'
})

const AppBar = props => {
  const { projects, project } = props

  return (
    <Bar>
      {(projects.isFetching || project.isFetching)
        ? null
        : <ProjectSwitcher
            projects={projects.items.map(id => projects.entities[id])}
            selectedProject={projects.entities[project.selectedId]}
          />
      }
    </Bar>
  )
}

const mapStateToProps = state => ({
  projects: state.projects,
  project: state.project
})

export default connect(mapStateToProps)(AppBar)
