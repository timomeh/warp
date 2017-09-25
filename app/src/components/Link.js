import React from 'react'
import { css } from 'glamor'
import { Link as RRLink } from 'react-router-dom'

const bareLink = css({
  textDecoration: 'none'
}).toString()

const Link = props => {
  const { bare = false, ...passedProps } = props

  return (
    <RRLink className={bare && bareLink} {...passedProps} />
  )
}

export default Link
