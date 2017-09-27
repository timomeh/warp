import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchProject, fetchBuild } from 'lib/store'
import Socket from 'lib/socket'
import ProjectHeader from 'components/ProjectHeader'
import BuildOverview from 'components/BuildOverview'

class Project extends Component {
  constructor(props) {
    super(props)

    this.socket = Socket.instance()
  }

  componentWillMount() {
    const { buildId, projectId } = this.props.match.params
    this.socket.joinProject(projectId)
    this.props.dispatch(fetchProject(projectId))
    this.props.dispatch(fetchBuild(buildId))
  }

  componentWillUnmount() {
    const { selectedId: projectId } = this.props.project
    this.socket.leaveProject(projectId)
  }

  render() {
    const {
      project: { selectedId: projectId, isFetching: projectIsFetching },
      build: { selectedId: buildId, isFetching: buildIsFetching },
      projects,
      builds,
      pipelines
    } = this.props

    if (projectIsFetching || buildIsFetching) return <div>Loading</div>

    const project = projects.entities[projectId]
    const build = builds.entities[buildId]
    const pipeline = pipelines.entities[build.pipeline_id]

    return (
      <div>
        <ProjectHeader
          title={project.name}
          secondary={`Git: ${project.git}`}
        />
        <BuildOverview
          build={build}
          pipeline={pipeline}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  project: state.project,
  build: state.build,
  projects: state.projects,
  builds: state.builds,
  pipelines: state.pipelines,
  stages: state.stages,
  steps: state.steps
})

export default connect(mapStateToProps)(Project)
