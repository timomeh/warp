import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Div } from 'glamorous'

import ProjectOverview from 'components/ProjectOverview'

class ProjectsList extends Component {
  render() {
    const { projects, builds } = this.props

    return (
      <Div marginTop={64}>
        {projects.items.map(projectId => {
          const { name, latest_builds } = projects.entities[projectId]

          return (
            <ProjectOverview
              key={projectId}
              projectId={projectId}
              title={name}
              builds={latest_builds.map(buildId => builds.entities[buildId])}
            />
          )
        })}
      </Div>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.projects,
  builds: state.builds
})

export default connect(mapStateToProps)(ProjectsList)
