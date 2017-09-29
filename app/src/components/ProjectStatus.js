import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import { css } from 'glamor'

import { statusColors } from 'bits/styles'

const glow = css.keyframes({
  'from': { boxShadow: `0 0 4px 1px ${statusColors.active}` },
  'to': { boxShadow: `0 0 1px 0 ${statusColors.active}` }
})

const Container = glamorous.div({
  fontSize: 12,
  color: 'white',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center'
})

const ActiveBubble = glamorous.div({
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: statusColors.active,
  boxShadow: `0 0 4px 0 ${statusColors.active}`,
  animation: `${glow} 2s infinite alternate ease-in-out`
})

const Text = glamorous.div({
  marginLeft: 8,
  lineHeight: 1
})

const ProjectStatus = props => {
  const { latestBuilds } = props

  const runningBuilds =
    latestBuilds.filter(build => ["active", "init"].includes(build.status))

  if (runningBuilds.length < 1) return null

  const wordBuild = runningBuilds.length === 1 ? 'Build' : 'Builds'
  return (
    <Container>
      <ActiveBubble />
      <Text>{runningBuilds.length} running {wordBuild}</Text>
    </Container>
  )
}

ProjectStatus.propTypes = {
  latestBuilds: PropTypes.array
}

export default ProjectStatus
