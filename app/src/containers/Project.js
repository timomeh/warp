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
    const projectId = this.currentProjectId()
    this.socket.joinProject(projectId)
    this.props.dispatch(fetchProject(projectId))
  }

  componentWillUnmount() {
    const projectId = this.currentProjectId()
    this.socket.leaveProject(projectId)
  }

  currentProjectId = () => {
    return this.props.match.params.projectId
  }

  render() {
    const { projects, builds, pipelines, stages, steps } = this.props
    const projectId = this.currentProjectId()
    const project = projects.entities[projectId]

    if (project == null) return <div>Loading</div>

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
  projects: state.projects,
  pipelines: state.pipelines,
  builds: state.builds,
  stages: state.stages,
  steps: state.steps
})

export default connect(mapStateToProps)(Project)
