import './App.css'
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { loadGapiInsideDOM, loadClientAuth2 } from 'gapi-script'
import GenshinTimeline from './GenshinTimeline'
import { CLIENT_ID, SCOPES } from './keys'
import { loadSpreadSheetAPI } from './helpers'
import Progress from './Progress'
import serializeValues from './serializeValues'
import GenshinTimelineFilter from './GenshinTimelineFilter'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(17)
  }
}))

const spreadsheetId = '1jQb1n1dpYMFmhd9Gf07CXeTBILHAofc3eh8qwkmkKQE'
const range = 'Timeline v2'

function App () {
  const classes = useStyles()
  const [gapi, setGapi] = useState(false)
  const [isSignedIn, setSignedIn] = useState(false)
  const [timelineElements, setTimelineElements] = useState(false)
  const [filteredTimelineElements, setFilteredTimelineElements] = useState(false)

  const updateSignedInStatus = useCallback(() => {
    if (!gapi) {
      return
    }
    setSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get())
  }, [gapi])

  useEffect(() => {
    async function initGoogleApi () {
      const gapi = await loadGapiInsideDOM()
      await loadClientAuth2(gapi, CLIENT_ID, SCOPES)
      await loadSpreadSheetAPI(gapi)
      setGapi(gapi)
      updateSignedInStatus()
    }
    initGoogleApi()
  }, [gapi, updateSignedInStatus])

  const handleSignInClick = useCallback(() => {
    gapi.auth2.getAuthInstance().signIn().then(() => updateSignedInStatus())
  }, [gapi, updateSignedInStatus])

  const handleSignOutClick = useCallback(() => {
    gapi.auth2.getAuthInstance().signOut().then(() => updateSignedInStatus())
  }, [gapi, updateSignedInStatus])

  useEffect(() => {
    async function loadSpreadSheetData () {
      const { result: { values } } = await gapi.client.sheets.spreadsheets.values.get({ spreadsheetId, range })
      setTimelineElements(serializeValues(values))
    }
    if (gapi) {
      loadSpreadSheetData()
    }
  }, [gapi])

  return (
    <div className='App'>
      <AppBar position='fixed'>
        {gapi &&
          <Toolbar>
            <Typography variant='h6' style={{ flexGrow: 1, textAlign: 'left' }}>
              Genshin Timeline
            </Typography>
            {isSignedIn
              ? <Button color='inherit' onClick={handleSignOutClick}>Выйти</Button>
              : <Button color='inherit' onClick={handleSignInClick}>Войти</Button>}
          </Toolbar>}
      </AppBar>
      {(!gapi || isSignedIn === undefined || !timelineElements) && <Progress />}
      {gapi && isSignedIn && timelineElements && (
        <div className={classes.container}>
          <GenshinTimeline timelineElements={filteredTimelineElements} />
          <GenshinTimelineFilter
            timelineElements={timelineElements}
            filteredTimelineElements={filteredTimelineElements}
            setFilteredTimelineElements={setFilteredTimelineElements}
          />
        </div>
      )}
    </div>
  )
}

export default App
