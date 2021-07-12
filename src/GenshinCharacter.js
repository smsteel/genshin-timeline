import { Avatar, Badge } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { useMemo } from 'react'

const useStyles = makeStyles((theme) => ({
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
  characterAvatarSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    boxShadow: 'none',
    margin: 0
  },
  characterAvatar4Stars: {
    background: 'linear-gradient(144deg, rgba(2,0,36,1) 0%, rgba(105,9,121,1) 35%, rgba(196,0,255,1) 100%)',
    borderColor: '#7e2c96'
  },
  characterAvatar5Stars: {
    background: 'linear-gradient(144deg, rgba(91,55,0,1) 0%, rgba(242,130,10,1) 42%, rgba(255,188,0,1) 100%)',
    borderColor: '#de790d'
  }
}))

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

const SmallElementBadge = withStyles(theme => ({
  badge: {
    // background: 'transparent',
    width: 14,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    border: 0,
    right: 0,
    bottom: 0
  }
}))(ElementBadge)

const ConstellationImageBadge = withStyles(theme => ({
  badge: {
    background: '#00406d',
    color: '#fff',
    right: '-10%',
    bottom: '25%'
  }
}))(ElementBadge)

const ElementAvatar = withStyles((theme) => ({
  root: {
    width: 20,
    height: 20
  }
}))(Avatar)

const SmallElementAvatar = withStyles((theme) => ({
  root: {
    width: 12,
    height: 12
  }
}))(ElementAvatar)

function GenshinCharacter ({ character, small = false, constellation = true }) {
  const classes = useStyles()

  const BadgeElement = small ? SmallElementBadge : ElementBadge

  const badge = useMemo(() => (
    <BadgeElement
      overlap='circle'
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={small ? <SmallElementAvatar src={character.element.url} /> : <ElementAvatar src={character.element.url} />}
    >
      <Avatar
        alt={character.name}
        src={character.data.images.sideicon}
        className={classNames(
          classes.characterAvatar,
          character.data.rarity === '4' && classes.characterAvatar4Stars,
          character.data.rarity === '5' && classes.characterAvatar5Stars,
          small && classes.characterAvatarSmall
        )}
      />
    </BadgeElement>
  ), [character, classes, small])

  if (!constellation) {
    return badge
  }

  return (
    <ConstellationImageBadge
      overlap='circle'
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      badgeContent={character.constellation}
    >
      {badge}
    </ConstellationImageBadge>
  )
}

export default GenshinCharacter
