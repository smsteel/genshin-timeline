import { Typography } from '@material-ui/core'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import StarIcon from '@material-ui/icons/Star'
import GenshinCharacter from './GenshinCharacter'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignSelf: 'center'
  },
  genshinTimelineItem: {
    '&:nth-child(even) > .MuiTimelineItem-content': {
      display: 'block'
    }
  },
  charactersContainer: {
    display: 'flex',
    marginTop: '-16px'
  }
}))

function GenshinTimelineItem ({ element }) {
  const classes = useStyles()

  const has5Star = element.characters.some(character => character.data.rarity === '5')
  const hasC6 = element.characters.some(character => character.constellation === 'c6')

  return (
    <TimelineItem className={classes.genshinTimelineItem}>
      <TimelineOppositeContent>
        <Typography variant='body2' color='textSecondary'>{element.date.format('DD/MM/YYYY')}</Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot style={hasC6 ? { background: '#005ab1' } : { background: '#373737' }}>
          <StarIcon style={has5Star ? { color: '#ffaf00' } : {}} />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent className={classes.charactersContainer}>
        {element.characters.map((character, key) => <GenshinCharacter key={key} character={character} />)}
      </TimelineContent>
    </TimelineItem>
  )
}

function GenshinTimeline ({ timelineElements }) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Timeline align='alternate'>
        {timelineElements && timelineElements.map((element, key) => <GenshinTimelineItem key={key} element={element} />)}
      </Timeline>
    </div>
  )
}

export default GenshinTimeline
