import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchProject } from 'lib/store'
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
  }

  componentWillUnmount() {
    const { selectedId: projectId } = this.props.project
    this.socket.leaveProject(projectId)
  }

  render() {
    const {
      projects,
      builds,
      pipelines,
      stages,
      steps,
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
        <SectionTitle>Latest Builds by Pipeline</SectionTitle>
        <BuildOverviewList
          items={project.latest_builds.map(buildId => builds.entities[buildId])}
          renderItem={build =>
            <BuildOverview
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
        <SectionTitle>Build History</SectionTitle>
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
