import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchProject, fetchBuildHistory } from 'lib/store'
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
    const { projectId } = this.props.match.params
    this.socket.joinProject(projectId)
    this.props.dispatch(fetchProject(projectId))
    this.props.dispatch(fetchBuildHistory(projectId))
  }

  componentWillUnmount() {
    const { selectedId: projectId } = this.props.project
    this.socket.leaveProject(projectId)
  }

  render() {
    const {
      projects,
      project: projectStore
    } = this.props

    if (projectStore.isFetching) return <div>Loading</div>

    const project = projects.entities[projectStore.selectedId]

    return (
      <div>
        <ProjectHeader
          title={project.name}
          secondary={`Git: ${project.git}`}
        />
        {this.renderLatestBuilds()}
        {this.renderBuildHistory()}
      </div>
    )
  }

  renderLatestBuilds = () => {
    const {
      projects,
      builds,
      pipelines,
      stages,
      steps,
      project: projectStore
    } = this.props

    const projectId = projectStore.selectedId
    const project = projects.entities[projectId]

    return (
      <div>
        <SectionTitle>Latest Builds by Pipeline</SectionTitle>
        <BuildOverviewList
          uniqueKey="ref"
          items={project.latest_builds.map(buildId => builds.entities[buildId])}
          renderItem={build =>
            <BuildOverview
              projectId={projectId}
              build={build}
              stages={(build.stages && build.stages.length)
                ? build.stages.map(id => stages.entities[id])
                : []
              }
              steps={steps}
              pipeline={pipelines.entities[build.pipeline_id]}
            />
          }
        />
      </div>
    )
  }

  renderBuildHistory = () => {
    const {
      builds,
      pipelines,
      project: projectStore
    } = this.props

    if (projectStore.isFetchingBuilds) return <div>Loading</div>

    return (
      <div>
        <SectionTitle>Build History</SectionTitle>
        <BuildOverviewList
          projectId={projectStore.selectedId}
          uniqueKey="id"
          items={projectStore.buildHistory.map(buildId => builds.entities[buildId])}
          renderItem={build =>
            <BuildOverview
              build={build}
              pipeline={pipelines.entities[build.pipeline_id]}
            />
          }
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  project: state.project,
  projects: state.projects,
  pipelines: state.pipelines,
  builds: state.builds,
  stages: state.stages,
  steps: state.steps
})

export default connect(mapStateToProps)(Project)
