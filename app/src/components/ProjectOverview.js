import React from 'react'
import PropTypes from 'prop-types'
import glamorous, { Div } from 'glamorous'

import { fontWeight } from 'bits/styles'
import Card from 'components/Card'
import StatusList from 'components/StatusList'
import StatusItem from 'components/StatusItem'
import Link from 'components/Link'
import TimeFromNow from 'components/TimeFromNow'

const Title = glamorous.h3({
  fontSize: 20,
  color: '#491A56',
  fontWeight: fontWeight.semibold,
  marginTop: 0,
  marginBottom: 16
})

const Meta = glamorous.div({
  fontSize: 14,
  color: '#929292',
  marginBottom: 16
})

const ProjectOverview = props => {
  const { title, builds, projectId } = props

  return (
    <Card>
      <Div padding={32}>
        <Link blank to={`/project/${projectId}`}>
          <Title>{title}</Title>
        </Link>
        <Meta>Environment Overview</Meta>
        <StatusList
          items={builds}
          renderItem={build => (
            <Link blank to={`/project/${projectId}/build/${build.id}`}>
              <StatusItem
                status={build.state}
                title={build.type}
                version={`Version: #${build.id}`}
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
  title: PropTypes.string.isRequired,
  builds: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired
}

export default ProjectOverview
