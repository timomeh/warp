import React from 'react'
import PropTypes from 'prop-types'
import glamorous, { Div } from 'glamorous'

import Title from 'components/Title'
import StatusIndicator from 'components/StatusIndicator'
import BuildInfoText from 'components/BuildInfoText'
import TimeFromNow from 'components/TimeFromNow'


const Card = glamorous.div({
  padding: 16,
  paddingLeft: 24
})

const Info = glamorous.div({
  marginTop: 8
})

const BuildItem = glamorous.div({
  marginTop: 8,
  display: 'flex',
  flexFlow: 'row nowrap'
})

const ProjectOverview = props => {
  const { name, builds } = props

  return (
    <Card>
      <Title>{name}</Title>
      <Info>
        {builds.map((build, i) => {
          return (
            <BuildItem key={i}>
              <Div marginRight={8}>
                <StatusIndicator type={build.state} />
              </Div>
              <Div>
                <BuildInfoText
                  description={build.type}
                  value={<TimeFromNow datetime={build.started_at} />}
                />
              </Div>
            </BuildItem>
          )
        })}
      </Info>
    </Card>
  )
}

ProjectOverview.propTypes = {
  name: PropTypes.string.isRequired
}

export default ProjectOverview

export function stories({ storiesOf }) {
  storiesOf('ProjectOverview', module)
    .addDecorator(story => (
      <div style={{ width: 302, border: '1px dashed #E6E6E6' }}>{story()}</div>
    ))
    .add('Card', () => <ProjectOverview name="timomeh/beam" />)
}
