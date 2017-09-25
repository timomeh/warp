import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Div } from 'glamorous'

import { fetchProjects } from 'lib/store'
import ProjectOverview from 'components/ProjectOverview'

class ProjectsList extends Component {
  componentWillMount() {
    this.props.dispatch(fetchProjects())
  }

  render() {
    const { projects, builds, pipelines } = this.props

    return (
      <Div marginTop={64}>
        {projects.items.map(projectId => {
          const project = projects.entities[projectId]

          return (
            <ProjectOverview
              key={projectId}
              project={project}
              pipelines={pipelines.entities}
              builds={builds.entities}
            />
          )
        })}
      </Div>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.projects,
  builds: state.builds,
  pipelines: state.pipelines
})

export default connect(mapStateToProps)(ProjectsList)
