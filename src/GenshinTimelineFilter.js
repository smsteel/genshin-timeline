import { useCallback, useEffect, useMemo, useState } from 'react'
import { uniqBy } from 'lodash'
import GenshinCharacter from './GenshinCharacter'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    top: theme.spacing(8),
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    background: 'white',
    boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    zIndex: 1
  }
}))

function GenshinTimelineFilter ({ timelineElements, filteredTimelineElements, setFilteredTimelineElements }) {
  const classes = useStyles()
  const [filteredNames, setFilteredNames] = useState([])

  useEffect(() => {
    setFilteredTimelineElements(timelineElements)
  }, [timelineElements, setFilteredTimelineElements])

  const characters = useMemo(() => timelineElements.reduce((a, v) => [...a, ...v.characters], []), [timelineElements])
  const uniqueCharacters = useMemo(() => uniqBy(characters, c => c.name), [characters])

  // const filteredCharacters = filteredTimelineElements ? filteredTimelineElements.reduce((a, v) => [...a, ...v.characters], []) : []
  // const filteredUniqueCharacters = uniqBy(filteredCharacters, c => c.name)
  // const filteredUniqueCharacterNames = useMemo(() => filteredUniqueCharacters.map(c => c.name), [filteredUniqueCharacters])

  const handleChange = useCallback((_, newCharacterNames) => {
    setFilteredNames(newCharacterNames)
    if (newCharacterNames.length === 0) {
      setFilteredTimelineElements(timelineElements)
      return
    }
    const newTimelineElements = timelineElements.map(e => {
      const newCharacters = e.characters.filter(c => newCharacterNames.includes(c.name))
      return { ...e, characters: newCharacters }
    })
    setFilteredTimelineElements(newTimelineElements.filter(e => e.characters.length !== 0))
  }, [timelineElements, setFilteredTimelineElements])

  return (
    <div className={classes.container}>
      <ToggleButtonGroup size='small' value={filteredNames} onChange={handleChange}>
        {uniqueCharacters.map((character, key) => (
          <ToggleButton key={key} value={character.name}>
            <GenshinCharacter character={character} small constellation={false} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  )
}

export default GenshinTimelineFilter
