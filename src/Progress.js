import { CircularProgress, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

function Progress () {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}

export default Progress
