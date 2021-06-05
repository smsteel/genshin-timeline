import { useEffect, useState } from 'react'
import moment from 'moment'
import genshinDb from 'genshin-db'
import { Avatar, Badge, Typography } from '@material-ui/core'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@material-ui/lab'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import StarIcon from '@material-ui/icons/Star'
import classNames from 'classnames'
import Progress from './Progress'

moment.locale('ru')

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
  },
  characterAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    margin: theme.spacing(1),
    border: '1px solid',
    boxShadow: '0px 2px 4px 0px #00000069, 0px 1px 0px 0px #f1f1f1',
    '& > img': {
      background: 'radial-gradient(circle, rgba(255,255,255,1) 10%, rgba(255,255,255,0) 70%)',
      marginTop: '-20%',
      backgroundPosition: '0 12px',
      backgroundRepeat: 'no-repeat',
      width: '120%',
      height: '120%'
    }
  },
  characterAvatar4Stars: {
    background: 'linear-gradient(144deg, rgba(2,0,36,1) 0%, rgba(105,9,121,1) 35%, rgba(196,0,255,1) 100%)',
    borderColor: '#7e2c96'
  },
  characterAvatar5Stars: {
    background: 'linear-gradient(144deg, rgba(91,55,0,1) 0%, rgba(242,130,10,1) 42%, rgba(255,188,0,1) 100%)',
    borderColor: '#de790d'
  },
  constellationAvatar: {
    filter: 'brightness(200%) contrast(200%)'
  }
}))

const spreadsheetId = '1jQb1n1dpYMFmhd9Gf07CXeTBILHAofc3eh8qwkmkKQE'
const range = 'Timeline v2'
const CHARACTER_NAMES_STAR_4_ROW_ID = 0
const DATES_STAR_4_C0_ROW_ID = 1
const DATES_STAR_4_C6_ROW_ID = 7
const CHARACTER_NAMES_STAR_5_ROW_ID = 9
const DATES_STAR_5_C0_ROW_ID = 10
const DATES_STAR_5_C6_ROW_ID = 16

const elementRelations = {
  Анемо: 'Anemo',
  Крио: 'Cryo',
  Дендро: 'Dendro',
  Электро: 'Electro',
  Гео: 'Geo',
  Гидро: 'Hydro',
  Пиро: 'Pyro'
}

function serializeValues (values) {
  const dates = {}
  let names = []
  values.forEach((v, ROW_ID) => {
    if (
      ROW_ID === CHARACTER_NAMES_STAR_4_ROW_ID ||
      ROW_ID === CHARACTER_NAMES_STAR_5_ROW_ID
    ) {
      names = v
    }
    if (
      (ROW_ID >= DATES_STAR_4_C0_ROW_ID && ROW_ID <= DATES_STAR_4_C6_ROW_ID) ||
      (ROW_ID >= DATES_STAR_5_C0_ROW_ID && ROW_ID <= DATES_STAR_5_C6_ROW_ID)
    ) {
      v.forEach((date, COLUMN_ID) => {
        if (!date || COLUMN_ID === 0) {
          return
        }
        const queryOpts = { queryLanguages: ['Russian'], resultLanguage: 'Russian' }
        const data = genshinDb.characters(names[COLUMN_ID], queryOpts)
        if (!data) {
          console.error(names[COLUMN_ID])
          return
        }
        const constellationImages = genshinDb.constellations(names[COLUMN_ID], queryOpts).images
        const element = genshinDb.elements(elementRelations[data.element])
        dates[date] = {
          ...dates[date] || {},
          date: moment(date, 'DD/MM/YYYY'),
          characters: [
            ...dates[date]?.characters || [],
            {
              name: names[COLUMN_ID],
              data,
              element,
              constellationImages,
              constellation: `c${(ROW_ID - (ROW_ID >= DATES_STAR_5_C0_ROW_ID ? DATES_STAR_5_C0_ROW_ID : 1)).toString()}`
            }
          ]
        }
      })
    }
  })
  return Object.values(dates).sort((f, s) => f.date.unix() - s.date.unix())
}

const ElementBadge = withStyles(theme => ({
  badge: {
    background: '#00406d',
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    right: '18%',
    bottom: '18%',
    border: `2px solid ${theme.palette.background.paper}`
  }
}))(Badge)

const ConstellationImageBadge = withStyles(theme => ({
  badge: {
    background: '#00406d',
    color: '#fff',
    right: '-10%',
    bottom: '25%'
  }
}))(ElementBadge)

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 20,
    height: 20
  }
}))(Avatar)

function GenshinCharacter ({ character }) {
  const classes = useStyles()

  return (
    <ConstellationImageBadge
      overlap='circle'
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      badgeContent={character.constellation}
    >
      <ElementBadge
        overlap='circle'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={<SmallAvatar src={character.element.url} />}
      >
        <Avatar
          alt={character.name}
          src={character.data.images.sideicon}
          className={classNames(
            classes.characterAvatar,
            character.data.rarity === '4' && classes.characterAvatar4Stars,
            character.data.rarity === '5' && classes.characterAvatar5Stars
          )}
        />
      </ElementBadge>
    </ConstellationImageBadge>
  )
}

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

function GenshinTimeline (gapi) {
  const [timelineElements, setTimelineElements] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    async function loadSpreadSheetData () {
      const { result: { values } } = await gapi.gapi.client.sheets.spreadsheets.values.get({ spreadsheetId, range })
      setTimelineElements(serializeValues(values))
    }
    loadSpreadSheetData()
  }, [])

  if (!timelineElements) {
    return <Progress />
  }

  console.log({ timelineElements })

  return (
    <div className={classes.container}>
      <Timeline align='alternate'>
        {timelineElements.map((element, key) => <GenshinTimelineItem key={key} element={element} />)}
      </Timeline>
    </div>
  )
}

export default GenshinTimeline
