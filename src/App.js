import './App.css'
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { loadGapiInsideDOM, loadClientAuth2 } from 'gapi-script'
import GenshinTimeline from './GenshinTimeline'
import { CLIENT_ID, SCOPES } from './keys'
import { loadSpreadSheetAPI } from './helpers'
import Progress from './Progress'

function App () {
  const [gapi, setGapi] = useState(false)
  const [isSignedIn, setSignedIn] = useState(false)

  useEffect(() => {
    async function initGoogleApi () {
      const gapi = await loadGapiInsideDOM()
      await loadClientAuth2(gapi, CLIENT_ID, SCOPES)
      await loadSpreadSheetAPI(gapi)
      setGapi(gapi)
      updateSignedInStatus()
    }
    initGoogleApi()
  }, [gapi])

  function updateSignedInStatus () {
    if (!gapi) {
      return
    }
    setSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get())
  }

  const handleSignInClick = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => updateSignedInStatus())
  }

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => updateSignedInStatus())
  }

  return (
    <div className='App'>
      <AppBar position='sticky'>
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
      {(!gapi || isSignedIn === undefined) && <Progress />}
      {gapi && isSignedIn && <GenshinTimeline gapi={gapi} />}
    </div>
  )
}

export default App
