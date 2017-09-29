import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import glamorous from 'glamorous'

import { fetchBuildHistory } from 'lib/store'
import icons from 'bits/icons'
import Link from 'components/Link'
import PageTitle from 'components/PageTitle'
import DateSeparatedList from 'components/DateSeparatedList'
import Subtitle from 'components/Subtitle'
import BuildSummary from 'components/BuildSummary'

const ListItem = glamorous.div({
  marginTop: 14,
  marginBottom: 14
})

class BuildHistory extends Component {
  componentWillMount() {
    this.props.dispatch(fetchBuildHistory())
  }

  render() {
    const { isFetching, buildHistory, builds } = this.props

    return (
      <div>
        <PageTitle icon={icons.history} title="Build History" />
        {isFetching
          ? <div>Loading...</div>
          : <DateSeparatedList
              items={buildHistory}
              getCompareDate={id => builds[id].finished_at}
              renderDate={date => this.renderDay(date)}
              renderItem={id => this.renderBuild(id)}
            />
        }
      </div>
    )
  }

  renderDay = (date) => {
    const dayString = moment(date).format('dddd, Do MMMM YYYY')
    return <Subtitle>{dayString}</Subtitle>
  }

  renderBuild = (buildId) => {
    const { builds, pipelines, projectId } = this.props
    const build = builds[buildId]
    const pipeline = pipelines[build.pipeline_id]

    return (
      <ListItem>
        <Link bare to={`/${projectId}/build/${build.id}`}>
          <BuildSummary
            status={build.status}
            title={pipeline.title}
            buildNo={build.id}
            userName={build.commit.sender_name}
            userAvatar={build.commit.sender_avatar}
            commitMessage={build.commit.message}
            datetime={build.finished_at}
            duration={this.getDuration(build.started_at, build.finished_at)}
            meanDuration={this.getDuration(build.started_at, build.finished_at)}
            commitSha={build.commit.commit_sha}
            buildRef={build.ref}
          />
        </Link>
      </ListItem>
    )
  }

  getDuration = (from, to) => {
    return moment(moment(to).diff(moment(from))).format("mm:ss")
  }
}

const mapStateToProps = state => ({
  buildHistory: state.project.buildHistory,
  pipelines: state.pipelines.entities,
  builds: state.builds.entities,
  projectId: state.project.selectedId,
  isFetching: state.project.isFetchingBuilds
})

export default connect(mapStateToProps)(BuildHistory)
