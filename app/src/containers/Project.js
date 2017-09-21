import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProjectHeader from 'components/ProjectHeader'
import SectionTitle from 'components/SectionTitle'
import BuildOverview from 'components/BuildOverview'
import BuildOverviewList from 'components/BuildOverviewList'

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
        <BuildOverviewList
          items={project.latest_builds.map(buildId => builds.entities[buildId])}
          renderItem={build => <BuildOverview build={build} />}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.projects,
  builds: state.builds
})

export default connect(mapStateToProps)(Project)
