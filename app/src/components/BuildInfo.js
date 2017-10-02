import React from 'react'
import PropTypes from 'prop-types'
import glamorous, { Div } from 'glamorous'

import utils from 'lib/utils'
import icons from 'bits/icons'
import ChipStatus from 'components/ChipStatus'
import ChipCommit from 'components/ChipCommit'
import ChipCode from 'components/ChipCode'
import InfoAsCommit from 'components/InfoAsCommit'
import InfoWithIcon from 'components/InfoWithIcon'
import InfoWithTitle from 'components/InfoWithTitle'
import Times from 'components/Times'
import Duration from 'components/Duration'


const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  marginBottom: 16
})

const InfoBlock = glamorous.div({
  marginBottom: 8
})

const BuildInfo = props => {
  const { build, pipeline } = props

  const [refType, refName, refTitle] = utils.parseRef(build.ref)

  return (
    <div>
      <Row>
        <Div flexShrink={0} marginRight={32}>
          <ChipStatus status={build.status} />
        </Div>
        <Div flex={1} minWidth={0} alignSelf="center">
          <InfoAsCommit
            avatarUrl={build.commit.sender_avatar}
            userName={build.commit.sender_name}
            message={build.commit.message}
          />
        </Div>
      </Row>

      <Row>
        <Div flexGrow={1}>
          <InfoBlock>
            <InfoWithIcon
              icon={icons.commit}
              info={<InfoWithTitle name="Commit:" value={<ChipCommit sha={build.commit.commit_sha} />} />}
            />
          </InfoBlock>
          <InfoBlock>
            <InfoWithIcon
              icon={icons[refType]}
              info={<InfoWithTitle name={`${refTitle}:`} value={<ChipCode>{refName}</ChipCode>} />}
            />
          </InfoBlock>
          <InfoBlock>
            <InfoWithIcon
              icon={icons.package}
              info={<InfoWithTitle name="Build Number:" value={`#${build.id}`} />}
            />
          </InfoBlock>
        </Div>

        <Div flexGrow={1}>
          <InfoBlock>
            <Times
              startedAt={build.started_at}
              finishedAt={build.finished_at}
            />
          </InfoBlock>
          <InfoBlock>
            <Duration
              startedAt={build.started_at}
              finishedAt={build.finished_at}
              mean={pipeline.mean_duration}
            />
          </InfoBlock>
        </Div>
      </Row>
    </div>
  )
}

BuildInfo.propTypes = {
  build: PropTypes.object.isRequired,
  pipeline: PropTypes.object.isRequired
}

export default BuildInfo
