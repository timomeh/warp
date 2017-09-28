import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { fetchProjects, fetchProject } from 'lib/store'

class ProjectRedirect extends Component {
  componentWillMount() {
    this.props.fetchProjectsAndSelectFirst()
  }

  render() {
    const { projects, project } = this.props

    return (
      (projects.isFetching || project.isFetching)
      ? <div>Warping...</div>
      : <Redirect to={`/${project.selectedId}`} />
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchProjectsAndSelectFirst() {
    dispatch(fetchProjects())
    .then(projectIds => dispatch(fetchProject(projectIds[0])))
  }
})

const mapStateToProps = state => ({
  projects: state.projects,
  project: state.project
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectRedirect)
