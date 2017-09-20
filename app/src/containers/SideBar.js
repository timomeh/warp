import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectProject } from 'lib/store'

import ProjectOverviewList from 'components/ProjectOverviewList'
import ProjectOverview from 'components/ProjectOverview'

class SideBar extends Component {
  render() {
    const { projects, builds } = this.props

    if (projects.isFetching) return <div>Loading</div>

    return (
      <ProjectOverviewList
        projects={projects.items.map(id => projects.entities[id])}
        selectedProject={projects.selected}
        onItemClick={this.handleProjectClick}
        renderItem={item =>
          <ProjectOverview
            name={item.name}
            builds={item.latest_builds.map(id => builds.entities[id])}
          />
        }
      />
    )
  }

  handleProjectClick = id => {
    console.log(id)
    this.props.onProjectClick(id)
  }
}

const mapStateToProps = state => ({
  projects: state.projects,
  builds: state.builds
})

const mapDispatchToProps = dispatch => ({
  onProjectClick(id) { dispatch(selectProject(id)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
