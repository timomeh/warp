import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProjectHeader from 'components/ProjectHeader'
import SectionTitle from 'components/SectionTitle'

class Project extends Component {
  render() {
    const { projects, builds, match } = this.props
    const projectId = match.params.projectId
    const project = projects.entities[projectId]

    if (projects.isFetching) return <div>Loading</div>

    return (
      <div>
        <ProjectHeader
          title={project.name}
          secondary={`Root Directory: ${project.root_directory}`}
        />
        <SectionTitle>Environment Overview</SectionTitle>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.projects,
  builds: state.builds
})

export default connect(mapStateToProps)(Project)
