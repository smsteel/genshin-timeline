import genshinDb from 'genshin-db'
import moment from 'moment'

moment.locale('ru')

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

export default function serializeValues (values) {
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
