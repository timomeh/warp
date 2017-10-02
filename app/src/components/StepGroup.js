import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import StepCard from 'components/StepCard'

const Horizontal = glamorous.ul({
  listStyleType: 'none',
  padding: 0,
  margin: '-8px -4px',
  display: 'flex',
  flexFlow: 'row nowrap'
})

const Vertical = glamorous.ul({
  listStyleType: 'none',
  padding: 0,
  margin: '-8px -4px',
  display: 'flex',
  flexFlow: 'column nowrap'
})

const ParallelItem = glamorous.li({
  padding: 0,
  margin: '8px 4px',
  flex: 1,
  flexBasis: '50%',
  minWidth: 0
})

const SerialItem = glamorous.li({
  padding: 0,
  margin: '8px 4px'
})

const StepGroup = props => {
  const { group } = props

  const List = group.execution_type === 'parallel' ? Horizontal : Vertical
  const Item = group.execution_type === 'parallel' ? ParallelItem : SerialItem

  return (
    <List>
      {group.steps.map(step => (
        <Item key={step.id}>
          {!!step.steps
            ? <StepGroup group={step} />
            : <StepCard step={step} />
          }
        </Item>
      ))}
    </List>
  )
}

StepGroup.propTypes = {
  group: PropTypes.object.isRequired
}

export default StepGroup
