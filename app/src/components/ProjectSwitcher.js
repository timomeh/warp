import React, { Component } from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { fontFamily, fontWeight } from 'bits/styles'
import icons from 'bits/icons'
import Icon from 'components/Icon'

const Wrap = glamorous.div({
  position: 'relative',
  fontFamily: fontFamily.normal,
  fontSize: 16,
  fontWeight: fontWeight.semibold,
  color: '#FFFFFF'
})

const SwitcherButton = glamorous.div({
  display: 'inline-flex',
  alignItems: 'center',
  height: 64,
  paddingLeft: 32,
  paddingRight: 32,
  cursor: 'pointer',
  userSelect: 'none'
})

const Expandable = glamorous.div(({ open }) => ({
  position: 'absolute',
  top: '100%',
  left: 16,
  backgroundColor: '#262626',
  transform: `translateY(${open ? 0 : '-101%'})`,
  transition: 'transform 130ms',
  zIndex: -1
}))

const ListItem = glamorous.div({
  padding: '16px 32px',
  fontSize: 14
})

const ActiveProjectName = glamorous.div({
  marginLeft: 16
})

class ProjectSwitcher extends Component {
  static propTypes = {
    projects: PropTypes.array.isRequired,
    selectedProject: PropTypes.object.isRequired
  }

  state = {
    switcherOpen: false
  }

  render() {
    return (
      <Wrap>
        {this.renderActiveProject()}
        {this.renderProjectList()}
      </Wrap>
    )
  }

  renderActiveProject = () => {
    const { selectedProject } = this.props
    const { switcherOpen } = this.state

    return (
      <SwitcherButton role="button" onClick={this.toggleSwitcherOpen}>
        <Icon
          icon={switcherOpen ? icons.triangleUp : icons.triangleDown}
          width={8}
          height={8}
          style={{ fill: 'white' }}
        />
        <ActiveProjectName>{selectedProject.name}</ActiveProjectName>
      </SwitcherButton>
    )
  }

  renderProjectList = () => {
    const { projects } = this.props
    const { switcherOpen } = this.state

    return (
      <Expandable open={switcherOpen}>
        {projects.map(project => (
          <ListItem key={project.id}>{project.name}</ListItem>
        ))}
        <ListItem>Add new project</ListItem>
      </Expandable>
    )
  }

  toggleSwitcherOpen = () => {
    this.setState(prevState => ({
      switcherOpen: !prevState.switcherOpen
    }))
  }
}

export default ProjectSwitcher
