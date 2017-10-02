import React, { Component } from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { fontWeight } from 'bits/styles'
import { getStepLeaves } from 'lib/store'
import Card from 'components/Card'
import BuildInfo from 'components/BuildInfo'
import StatusBar from 'components/StatusBar'
import Link from 'components/Link'
import MiniStepsList from 'components/MiniStepsList'


const Meta = glamorous.div({
  fontSize: 14,
  color: '#929292',
  marginBottom: 8,
  fontWeight: fontWeight.semibold
})

const Inner = glamorous.div({
  padding: 32
})

const CardSection = glamorous.div({
  margin: -32,
  marginTop: 0,
  padding: 32,
  borderTop: '1px solid #F0F0F0'
})

class BuildOverview extends Component {
  static defaultProps = {
    stages: [],
    steps: {}
  }
  static propTypes = {
    build: PropTypes.object.isRequired,
    pipeline: PropTypes.object.isRequired,
    stages: PropTypes.array,
    steps: PropTypes.object
  }

  state = {
    leafSteps: []
  }

  componentWillMount() {
    this.setLeafSteps(this.props.stages, this.props.steps)
  }

  componentWillReceiveProps(nextProps) {
    const { build: currentBuild } = this.props
    const { build: newBuild, stages, steps } = nextProps
    const { leafSteps } = this.state

    // If component updates with a new build, reset the state
    if (currentBuild.id !== newBuild.id) {
      this.setState({ leafSteps: [] })
    }

    // If new leafSteps are available, calculate and set them
    if (newBuild.status === 'active' && stages.length && leafSteps.length === 0) {
      this.setLeafSteps(stages, steps)
    }
  }

  render() {
    const { build, pipeline, steps, projectId } = this.props
    const { leafSteps } = this.state

    return (
      <Card>
        <Link bare to={`/${projectId}/build/${build.id}`}>
          <StatusBar
            hasArrow
            status={build.status}
            title={pipeline.title}
            version={build.id}
            startedAt={build.started_at}
            finishedAt={build.finished_at}
          />
        </Link>
        <Inner>
          <BuildInfo build={build} pipeline={pipeline} />
          {leafSteps.length > 0 &&
            <CardSection>
              <Meta>All Build Steps</Meta>
              <MiniStepsList
                steps={leafSteps.map(id => steps.entities[id])}
              />
            </CardSection>
          }
        </Inner>
      </Card>
    )
  }

  setLeafSteps = (stages, steps) => {
    const leafSteps =
      stages
        .map(stage => getStepLeaves(stage.steps, steps.entities))
        .reduce((acc, cur) => acc.concat(cur), [])

    this.setState({ leafSteps })
  }
}

export default BuildOverview
