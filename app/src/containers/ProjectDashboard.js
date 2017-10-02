import React, { Component } from 'react'
import { connect } from 'react-redux'

import icons from 'bits/icons'
import PageContainer from 'components/PageContainer'
import BuildDetailCard from 'components/BuildDetailCard'
import BuildDetailList from 'components/BuildDetailList'
import PageTitle from 'components/PageTitle'

class ProjectDashboard extends Component {
  render() {
    const { project, steps, pipelines, builds, stages } = this.props

    return (
      <PageContainer>
        <PageTitle icon={icons.package} title="Latest Builds" />

        <BuildDetailList
          uniqueKey="ref"
          items={project.latest_builds.map(buildId => builds.entities[buildId])}
          renderItem={build =>
            <BuildDetailCard
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
      </PageContainer>
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
