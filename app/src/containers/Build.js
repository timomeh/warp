import React, { Component } from 'react'
import { connect } from 'react-redux'
import glamorous from 'glamorous'

import { fetchBuild, populateSteps } from 'lib/store'
import Stage from 'components/Stage'
import StatusBar from 'components/StatusBar'
import BuildInfo from 'components/BuildInfo'

const InfoContainer = glamorous.div({
  padding: '32px 52px',
  backgroundColor: 'white'
})

const DetailContainer = glamorous.div({
  padding: '32px 52px'
})

class Build extends Component {
  componentWillMount() {
    const { buildId } = this.props.match.params
    this.props.dispatch(fetchBuild(buildId))
  }

  render() {
    const { buildStore, builds, pipelines, stagesStore, steps } = this.props

    if (buildStore.isFetching) return <div>Loading...</div>

    const build = builds[buildStore.selectedId]
    const pipeline = pipelines[build.pipeline_id]

    const stages = build.stages.map(stageId =>
      populateSteps(stagesStore[stageId], steps)
    )

    return (
      <div>
        <StatusBar
          status={build.status}
          title={pipeline.title}
          version={build.id}
          startedAt={build.started_at}
          finishedAt={build.finished_at}
        />
        <InfoContainer>
          <BuildInfo build={build} pipeline={pipeline} />
        </InfoContainer>
        <DetailContainer>
          {stages.map((stage, i) =>
            <Stage key={stage.id} stage={stage} num={i} />
          )}
        </DetailContainer>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  buildStore: state.build,
  builds: state.builds.entities,
  stagesStore: state.stages.entities,
  steps: state.steps.entities,
  pipelines: state.pipelines.entities
})

export default connect(mapStateToProps)(Build)
