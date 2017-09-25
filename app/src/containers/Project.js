import React, { Component } from 'react'
import { connect } from 'react-redux'

import Socket from 'lib/socket'
import ProjectHeader from 'components/ProjectHeader'
import SectionTitle from 'components/SectionTitle'
import BuildOverview from 'components/BuildOverview'
import BuildOverviewList from 'components/BuildOverviewList'

class Project extends Component {
  constructor(props) {
    super(props)

    this.socket = Socket.instance()
  }

  componentWillMount() {
    const projectId = this.currentProjectId()
    this.socket.joinProject(projectId)
  }

  componentWillUnmount() {
    const projectId = this.currentProjectId()
    this.socket.leaveProject(projectId)
  }

  currentProjectId = () => {
    return this.props.match.params.projectId
  }

  render() {
    const { projects, builds, pipelines } = this.props
    const projectId = this.currentProjectId()
    const project = projects.entities[projectId]

    if (projects.isFetching) return <div>Loading</div>

    return (
      <div>
        <ProjectHeader
          title={project.name}
          secondary={`Git: ${project.git}`}
        />
        <SectionTitle>Latest Builds</SectionTitle>
        <BuildOverviewList
          items={project.latest_builds.map(buildId => builds.entities[buildId])}
          renderItem={build =>
            <BuildOverview build={build} pipeline={pipelines.entities[build.pipeline_id]} />
          }
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.projects,
  pipelines: state.pipelines,
  builds: state.builds
})

export default connect(mapStateToProps)(Project)
