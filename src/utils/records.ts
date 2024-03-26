import { differenceInHours, differenceInMinutes } from 'date-fns'
import colors from 'src/theme/colors'

import type {
  MeasureData,
  RecordRow,
  RecordType,
  RecordTypeGroup,
  SleepAttrData
} from 'src/models/record'

export const recordTypeGroups: RecordTypeGroup[] = [
  [
    'feeding',
    [
      'bottleBreast',
      'bottleFormula',
      'breastFeedingLeft',
      'breastFeedingRight',
      'pumpingLeft',
      'pumpingRight'
    ]
  ],
  ['sleep', ['sleepDay', 'sleepNight']],
  ['diaper', ['diaper']],
  ['growth', ['weight', 'height', 'head']]
]

export const getGroupByType = (type: RecordType) =>
  recordTypeGroups.find((group) => group[1].includes(type))

export const formatAttributes = (
  type: RecordType,
  attributes?: RecordRow['attributes'],
  date?: string,
  time?: string
) => {
  const group = getGroupByType(type)

  if (group?.[0] === 'growth') {
    const attr = attributes as MeasureData

    return `${attr.value}${attr.unit}`
  } else if (group?.[0] === 'sleep') {
    const attr = attributes as SleepAttrData

    const startDate = new Date(`${date}T${time}`)

    const endDate = new Date(`${attr.endDate}T${attr.endTime}`)

    const durationInHours = differenceInHours(endDate, startDate)

    const durationInMinutes = differenceInMinutes(endDate, startDate)

    return `Duration: ${durationInHours ? `${durationInHours} hour${durationInHours > 1 ? 's' : ''}` : `${durationInMinutes} minute${durationInMinutes > 1 ? 's' : ''}`}`
  }

  return '-'
}

export const getRecordTypeInfo = (type: RecordType) => {
  switch (type) {
    case 'growth':
      return {
        attributes: {},
        color: colors.custom.yellow1,
        icon: require('assets/icon-growth.png'),
        title: 'Growth'
      }

    case 'birthday':
      return {
        attributes: {},
        color: colors.custom.yellow1,
        icon: require('assets/icon-growth.png'),
        title: 'Birthday'
      }

    case 'weight':
      return {
        attributes: DEFAULT_WEIGHT,
        color: colors.custom.yellow1,
        icon: require('assets/icon-weight.png'),
        title: 'Weight'
      }

    case 'height':
      return {
        attributes: DEFAULT_HEIGHT,
        color: colors.custom.yellow1,
        icon: require('assets/icon-height.png'),
        title: 'Height'
      }

    case 'head':
      return {
        attributes: DEFAULT_HEAD_CIRCUMFERENCE,
        color: colors.custom.yellow1,
        icon: require('assets/icon-head-circ.png'),
        title: 'Head Circumference'
      }

    case 'diaper':
      return {
        attributes: {},
        color: colors.custom.green4,
        icon: require('assets/icon-diaper.png'),
        title: 'Diaper'
      }

    case 'sleep':
      return {
        attributes: {},
        color: colors.custom.blue4,
        icon: require('assets/icon-night.png'),
        title: 'Sleep'
      }

    case 'sleepDay':
      return {
        attributes: {},
        color: colors.custom.blue4,
        icon: require('assets/icon-day.png'),
        title: 'Sleep - Day'
      }

    case 'sleepNight':
      return {
        attributes: {},
        color: colors.custom.blue4,
        icon: require('assets/icon-night.png'),
        title: 'Sleep - Night'
      }

    case 'feeding':
      return {
        attributes: {},
        color: colors.custom.pink1,
        icon: require('assets/icon-bottle.png'),
        title: 'Feeding'
      }

    case 'bottleBreast':
      return {
        attributes: {},
        color: colors.custom.pink1,
        icon: require('assets/icon-bottle.png'),
        title: 'Bottle - Breast'
      }

    case 'bottleFormula':
      return {
        attributes: {},
        color: colors.custom.pink1,
        icon: require('assets/icon-bottle.png'),
        title: 'Bottle - Formula'
      }

    case 'breastFeedingLeft':
      return {
        attributes: {},
        color: colors.custom.pink1,
        icon: require('assets/icon-bra-left.png'),
        title: 'Breast Feeding - Left'
      }

    case 'breastFeedingRight':
      return {
        attributes: {},
        color: colors.custom.pink1,
        icon: require('assets/icon-bra-right.png'),
        title: 'Breast Feeding - Right'
      }

    case 'pumpingLeft':
      return {
        attributes: {},
        color: colors.custom.pink1,
        icon: require('assets/icon-pumping-left.png'),
        title: 'Pumping - Left'
      }

    case 'pumpingRight':
      return {
        attributes: {},
        color: colors.custom.pink1,
        icon: require('assets/icon-pumping-right.png'),
        title: 'Pumping - Right'
      }
  }
}

export const DEFAULT_HEAD_CIRCUMFERENCE: MeasureData = {
  unit: 'cm',
  value: 30
}

export const DEFAULT_HEIGHT: MeasureData = {
  unit: 'cm',
  value: 50
}

export const DEFAULT_WEIGHT: MeasureData = {
  unit: 'kg',
  value: 3.5
}
