import React, { Component } from 'react'
import { connect } from 'react-redux'

import icons from 'bits/icons'
import BuildOverview from 'components/BuildOverview'
import BuildOverviewList from 'components/BuildOverviewList'
import PageTitle from 'components/PageTitle'

class ProjectDashboard extends Component {
  render() {
    const { project, steps, pipelines, builds, stages } = this.props

    return (
      <div>
        <PageTitle icon={icons.package} title="Latest Builds" />

        <BuildOverviewList
          uniqueKey="ref"
          items={project.latest_builds.map(buildId => builds.entities[buildId])}
          renderItem={build =>
            <BuildOverview
              projectId={project.id}
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
}

const mapStateToProps = state => ({
  project: state.projects.entities[state.project.selectedId],
  steps: state.steps,
  stages: state.stages,
  pipelines: state.pipelines,
  builds: state.builds
})

export default connect(mapStateToProps)(ProjectDashboard)
