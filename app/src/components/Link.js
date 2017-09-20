import React from 'react'
import { css } from 'glamor'
import { Link as RRLink } from 'react-router-dom'

const blankLink = css({
  textDecoration: 'none'
}).toString()

const Link = props => {
  const { blank = false, ...passedProps } = props

  return (
    <RRLink className={blank && blankLink} {...passedProps} />
  )
}

export default Link
