import React, { Component } from 'react'
import PropTypes from 'prop-types'
import glamorous, { Div } from 'glamorous'
import moment from 'moment'

import utils from 'lib/utils'
import { fontWeight } from 'bits/styles'
import icons from 'bits/icons'
import { getStepLeaves } from 'lib/store'
import Card from 'components/Card'
import StatusBar from 'components/StatusBar'
import ChipStatus from 'components/ChipStatus'
import ChipCommit from 'components/ChipCommit'
import ChipCode from 'components/ChipCode'
import InfoAsCommit from 'components/InfoAsCommit'
import InfoWithIcon from 'components/InfoWithIcon'
import InfoWithTitle from 'components/InfoWithTitle'
import Link from 'components/Link'
import Timer from 'components/Timer'
import MiniStepsList from 'components/MiniStepsList'

const Inner = glamorous.div({
  padding: 32
})

const Meta = glamorous.div({
  fontSize: 14,
  color: '#929292',
  marginBottom: 8,
  fontWeight: fontWeight.semibold
})

const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  marginBottom: 16
})

const InfoBlock = glamorous.div({
  marginBottom: 8
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
    const [refType, refName, refTitle] = utils.parseRef(build.ref)

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
          <Row>
            <Div flexShrink={0} marginRight={32}>
              <ChipStatus status={build.status} />
            </Div>
            <Div flex={1} minWidth={0} alignSelf="center">
              <InfoAsCommit
                avatarUrl={build.commit.sender_avatar}
                userName={build.commit.sender_name}
                message={build.commit.message}
              />
            </Div>
          </Row>

          <Row>
            <Div flexGrow={1}>
              <InfoBlock>
                <InfoWithIcon
                  isMultiline
                  icon={icons.time}
                  info={
                    <div>
                      <InfoWithTitle name="Started:" value={this.timeToString(build.started_at)} />
                      <InfoWithTitle name="Finished:" value={this.timeToString(build.finished_at)} />
                    </div>
                  }
                />
              </InfoBlock>
              <InfoBlock>
                <InfoWithIcon
                  isMultiline
                  icon={icons.duration}
                  info={
                    <div>
                      <InfoWithTitle name="Duration:" value={this.timesToDuration(build.started_at, build.finished_at)} />
                      <InfoWithTitle name="∅ Duration:" value={utils.durationFromSeconds(pipeline.mean_duration)} />
                    </div>
                  }
                />
              </InfoBlock>
            </Div>

            <Div flexGrow={1}>
              <InfoBlock>
                <InfoWithIcon
                  icon={icons.package}
                  info={<InfoWithTitle name="Build Number:" value={`#${build.id}`} />}
                />
              </InfoBlock>
              <InfoBlock>
                <InfoWithIcon
                  icon={icons.commit}
                  info={<InfoWithTitle name="Commit:" value={<ChipCommit sha={build.commit.commit_sha} />} />}
                />
              </InfoBlock>
              <InfoBlock>
                <InfoWithIcon
                  icon={icons[refType]}
                  info={<InfoWithTitle name={`${refTitle}:`} value={<ChipCode>{refName}</ChipCode>} />}
                />
              </InfoBlock>
            </Div>
          </Row>

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

  timesToDuration = (from, to) => {
    if (from == null && to == null) return "–"
    else if (to == null) return <Timer datetime={from} />
    else return moment(moment(to).diff(moment(from))).format("mm:ss")
  }

  timeToString = (time) => {
    return time
      ? moment(time).format("YYYY-MM-DD HH:mm:ss")
      : "–"
  }
}

export default BuildOverview
