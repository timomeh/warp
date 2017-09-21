import React from 'react'
import PropTypes from 'prop-types'
import glamorous, { Div } from 'glamorous'

import { fontWeight } from 'bits/styles'
import Card from 'components/Card'
import Title from 'components/Title'

const Meta = glamorous.div({
  fontSize: 14,
  color: '#929292',
  marginTop: 8,
  fontWeight: fontWeight.semibold
})

const ProjectHeader = props => {
  const { title, secondary } = props

  return (
    <Card>
      <Div padding={32}>
        <Title>{title}</Title>
        <Meta>{secondary}</Meta>
      </Div>
    </Card>
  )
}

ProjectHeader.propTypes = {
  title: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired
}

export default ProjectHeader
