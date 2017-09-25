import React from 'react'
import PropTypes from 'prop-types'
import glamorous, { Div } from 'glamorous'

import { fontWeight } from 'bits/styles'
import Title from 'components/Title'
import Card from 'components/Card'
import StatusList from 'components/StatusList'
import StatusItem from 'components/StatusItem'
import Link from 'components/Link'
import TimeFromNow from 'components/TimeFromNow'

const Meta = glamorous.div({
  fontSize: 14,
  color: '#929292',
  marginBottom: 16,
  marginTop: 16,
  fontWeight: fontWeight.semibold
})

const ProjectOverview = props => {
  const { project, builds, pipelines } = props

  return (
    <Card>
      <Div padding={32}>
        <Link bare to={`/projects/${project.id}`}>
          <Title>{project.name}</Title>
        </Link>
        <Meta>Latest Builds</Meta>
        <StatusList
          items={project.latest_builds.map(id => builds[id])}
          renderItem={build => (
            <Link bare to={`/projects/${project.id}/builds/${build.id}`}>
              <StatusItem
                status={build.status}
                title={pipelines[build.pipeline_id].title}
                version={build.ref}
                right={<TimeFromNow datetime={build.started_at} />}
              />
            </Link>
          )}
        />
      </Div>
    </Card>
  )
}

ProjectOverview.propTypes = {
  project: PropTypes.object.isRequired,
  builds: PropTypes.object.isRequired,
  pipelines: PropTypes.object.isRequired
}

export default ProjectOverview
