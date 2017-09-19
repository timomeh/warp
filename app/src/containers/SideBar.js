import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects } from '../lib/store'

import ProjectOverviewList from '../components/ProjectOverviewList'
import ProjectOverview from '../components/ProjectOverview'

class SideBar extends Component {
  componentDidMount() {
    this.props.dispatch(fetchProjects())
  }

  render() {
    const { projects } = this.props

    if (projects.isFetching) return <div>Loading</div>

    return (
      <ProjectOverviewList
        items={projects.items.map(id => projects.entities[id])}
        renderItem={item =>
          <ProjectOverview
            name={item.name}
          />
        }
      />
    )
  }
}

const mapStateToProps = state => ({
  projects: state.projects
})

export default connect(mapStateToProps)(SideBar)
