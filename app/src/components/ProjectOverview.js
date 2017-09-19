import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import Title from 'components/Title'


const Card = glamorous.div({
  padding: 16,
  paddingLeft: 24
})

const Info = glamorous.div({
  marginTop: 8
})

const ProjectOverview = props => {
  const { name } = props

  return (
    <Card>
      <Title>{name}</Title>
      <Info>
        Lolo!
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
