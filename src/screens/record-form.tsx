import type { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'

import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  BaseCard,
  Button,
  DeleteRecordBottomSheet,
  MeasuresPickerBottomSheet,
  RecordIcon,
  Text
} from 'src/components'
import { useRecordStore } from 'src/store/record-store'
import colors from 'src/theme/colors'
import { capitalizeFirstLetter } from 'src/utils/general'
import { getGroupByType, getRecordTypeInfo } from 'src/utils/records'
import defaultColors from 'tailwindcss/colors'

import type { TextInputProps, TouchableOpacityProps, ViewProps } from 'react-native'
import type {
  DeleteRecordBottomSheetElement,
  MeasuresPickerBottomSheetElement
} from 'src/components'
import type {
  DiaperAttrData,
  FeedingAttrData,
  MeasureData,
  RecordDraft,
  SleepAttrData
} from 'src/models/record'
import type { RootStackScreen } from 'src/navigation/types'

type FormItemProps = PropsWithChildren<
  ViewProps & {
    label: string
  }
>

type FormItemPillProps = TouchableOpacityProps & {
  textClassName?: string
  title?: string
}

type FormItemTextInputProps = TextInputProps

type FormGroupsProps = ViewProps & {
  recordDraft: RecordDraft
  setRecordDraft: Dispatch<SetStateAction<RecordDraft>>
}

const FormItem: FunctionComponent<FormItemProps> = ({ children, className, label, ...props }) => (
  <View
    className={`border-t-[1px] border-custom-line flex-row items-center justify-between p-4 ${className}`}
    {...props}>
    <Text bold>{label}</Text>
    {children}
  </View>
)

const FormItemPill: FunctionComponent<FormItemPillProps> = ({
  children,
  className,
  title,
  textClassName,
  ...props
}) => (
  <TouchableOpacity
    className={`bg-white h-10 justify-center px-4 rounded-lg ${className}`}
    {...props}>
    {!!title && (
      <Text bold className={textClassName}>
        {title}
      </Text>
    )}
    {children}
  </TouchableOpacity>
)

const FormItemTextInput: FunctionComponent<FormItemTextInputProps> = ({
  className,
  style,
  ...props
}) => (
  <TextInput
    className={`bg-white h-10 px-4 rounded-lg text-base w-full ${className}`}
    placeholderTextColor={colors.custom.iconOff}
    style={[style, { fontFamily: 'Nunito_700Bold' }]}
    {...props}
  />
)

const GrowthForm: FunctionComponent<FormGroupsProps> = ({
  recordDraft,
  setRecordDraft,
  ...props
}) => {
  const attributes = recordDraft.attributes as MeasureData

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)

  const [startDate, setStartDate] = useState(new Date(`${recordDraft.date}T${recordDraft.time}`))

  const measuresPickerBottomSheetRef = useRef<MeasuresPickerBottomSheetElement>(null)

  const showDatePicker = () => {
    setIsDatePickerVisible(true)
  }

  const hideDatePicker = () => {
    setIsDatePickerVisible(false)
  }

  const showTimePicker = () => {
    setIsTimePickerVisible(true)
  }

  const hideTimePicker = () => {
    setIsTimePickerVisible(false)
  }

  const onConfirmDateTimePicker = (date: Date) => {
    setStartDate(date)

    setRecordDraft((prev) => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd'),
      time: format(date, 'HH:mm:ss')
    }))

    hideDatePicker()

    hideTimePicker()
  }

  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleChangeNotes = (notes: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setRecordDraft((prev) => ({ ...prev, notes }))
    }, 500)
  }

  return (
    <View {...props}>
      <FormItem label={attributes.unit.toUpperCase()}>
        <FormItemPill
          onPress={() => measuresPickerBottomSheetRef.current?.expand()}
          title={`${attributes.value}${attributes.unit}`}
        />
      </FormItem>
      <FormItem label="Date">
        <View className="flex-row space-x-2">
          <FormItemPill onPress={showDatePicker} title={format(startDate, 'MMM d, yyyy')} />
          <FormItemPill onPress={showTimePicker} title={format(startDate, 'HH:mm')} />
        </View>
      </FormItem>
      <FormItem className="flex-col items-start" label="Notes">
        <FormItemTextInput
          className="h-24 mt-4"
          multiline
          onChangeText={handleChangeNotes}
          placeholder="Add a note"
          defaultValue={recordDraft.notes ?? ''}
        />
      </FormItem>
      <DateTimePickerModal
        date={startDate}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={onConfirmDateTimePicker}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        date={startDate}
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={onConfirmDateTimePicker}
        onCancel={hideTimePicker}
      />
      <MeasuresPickerBottomSheet
        initialMeasuresPickerValue={attributes}
        onChange={(data) => setRecordDraft((prev) => ({ ...prev, attributes: data }))}
        recordType={recordDraft.type}
        ref={measuresPickerBottomSheetRef}
      />
    </View>
  )
}

const SleepForm: FunctionComponent<FormGroupsProps> = ({
  recordDraft,
  setRecordDraft,
  ...props
}) => {
  const attributes = recordDraft.attributes as SleepAttrData

  const [isDatePickerVisibleFor, setIsDatePickerVisibleFor] = useState<
    'start' | 'end' | undefined
  >()

  const [isTimePickerVisibleFor, setIsTimePickerVisibleFor] = useState<
    'start' | 'end' | undefined
  >()

  const [startDate, setStartDate] = useState(new Date(`${recordDraft.date}T${recordDraft.time}`))

  const [endDate, setEndDate] = useState(new Date(`${attributes.endDate}T${attributes.endTime}`))

  const showDatePicker = (forField: 'start' | 'end') => {
    setIsDatePickerVisibleFor(forField)
  }

  const hideDatePicker = () => {
    setIsDatePickerVisibleFor(undefined)
  }

  const showTimePicker = (forField: 'start' | 'end') => {
    setIsTimePickerVisibleFor(forField)
  }

  const hideTimePicker = () => {
    setIsTimePickerVisibleFor(undefined)
  }

  const onConfirmDateTimePicker = (date: Date) => {
    if (isDatePickerVisibleFor === 'start' || isTimePickerVisibleFor === 'start') {
      setStartDate(date)

      setRecordDraft((prev) => ({
        ...prev,
        date: format(date, 'yyyy-MM-dd'),
        time: format(date, 'HH:mm:ss')
      }))
    } else {
      setEndDate(date)

      setRecordDraft((prev) => ({
        ...prev,
        attributes: {
          endDate: format(date, 'yyyy-MM-dd'),
          endTime: format(date, 'HH:mm:ss')
        }
      }))
    }

    hideDatePicker()

    hideTimePicker()
  }

  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleChangeNotes = (notes: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setRecordDraft((prev) => ({ ...prev, notes }))
    }, 500)
  }

  return (
    <View {...props}>
      <FormItem label="Start">
        <View className="flex-row space-x-2">
          <FormItemPill
            onPress={() => showDatePicker('start')}
            title={format(startDate, 'MMM d, yyyy')}
          />
          <FormItemPill
            onPress={() => showTimePicker('start')}
            title={format(startDate, 'HH:mm')}
          />
        </View>
      </FormItem>
      <FormItem label="End">
        <View className="flex-row space-x-2">
          <FormItemPill
            onPress={() => showDatePicker('end')}
            title={format(endDate, 'MMM d, yyyy')}
          />
          <FormItemPill onPress={() => showTimePicker('end')} title={format(endDate, 'HH:mm')} />
        </View>
      </FormItem>
      <FormItem className="flex-col items-start" label="Notes">
        <FormItemTextInput
          className="h-24 mt-4"
          multiline
          onChangeText={handleChangeNotes}
          placeholder="Add a note"
          defaultValue={recordDraft.notes ?? ''}
        />
      </FormItem>
      <DateTimePickerModal
        date={isDatePickerVisibleFor === 'start' ? startDate : endDate}
        isVisible={!!isDatePickerVisibleFor}
        mode="date"
        onConfirm={onConfirmDateTimePicker}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        date={isTimePickerVisibleFor === 'start' ? startDate : endDate}
        isVisible={!!isTimePickerVisibleFor}
        mode="time"
        onConfirm={onConfirmDateTimePicker}
        onCancel={hideTimePicker}
      />
    </View>
  )
}

const FeedingForm: FunctionComponent<FormGroupsProps> = ({
  recordDraft,
  setRecordDraft,
  ...props
}) => {
  const attributes = recordDraft.attributes as FeedingAttrData

  const [isDatePickerVisibleFor, setIsDatePickerVisibleFor] = useState<
    'start' | 'end' | undefined
  >()

  const [isTimePickerVisibleFor, setIsTimePickerVisibleFor] = useState<
    'start' | 'end' | undefined
  >()

  const [startDate, setStartDate] = useState(new Date(`${recordDraft.date}T${recordDraft.time}`))

  const [endDate, setEndDate] = useState(
    attributes.endDate && attributes.endTime
      ? new Date(`${attributes.endDate}T${attributes.endTime}`)
      : new Date()
  )

  const showDatePicker = (forField: 'start' | 'end') => {
    setIsDatePickerVisibleFor(forField)
  }

  const hideDatePicker = () => {
    setIsDatePickerVisibleFor(undefined)
  }

  const showTimePicker = (forField: 'start' | 'end') => {
    setIsTimePickerVisibleFor(forField)
  }

  const hideTimePicker = () => {
    setIsTimePickerVisibleFor(undefined)
  }

  const onConfirmDateTimePicker = (date: Date) => {
    if (isDatePickerVisibleFor === 'start' || isTimePickerVisibleFor === 'start') {
      setStartDate(date)

      setRecordDraft((prev) => ({
        ...prev,
        date: format(date, 'yyyy-MM-dd'),
        time: format(date, 'HH:mm:ss')
      }))
    } else {
      setEndDate(date)

      setRecordDraft((prev) => ({
        ...prev,
        attributes: {
          ...(prev.attributes as FeedingAttrData),
          endDate: format(date, 'yyyy-MM-dd'),
          endTime: format(date, 'HH:mm:ss')
        }
      }))
    }

    hideDatePicker()

    hideTimePicker()
  }

  const timeoutRef = useRef<NodeJS.Timeout>()

  const measuresPickerBottomSheetRef = useRef<MeasuresPickerBottomSheetElement>(null)

  const handleChangeNotes = (notes: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setRecordDraft((prev) => ({ ...prev, notes }))
    }, 500)
  }

  return (
    <View {...props}>
      {attributes.amount && (
        <FormItem label="Amount">
          <FormItemPill
            onPress={() => measuresPickerBottomSheetRef.current?.expand()}
            title={`${attributes.amount.value}${attributes.amount.unit}`}
          />
        </FormItem>
      )}
      <FormItem label="Start">
        <View className="flex-row space-x-2">
          <FormItemPill
            onPress={() => showDatePicker('start')}
            title={format(startDate, 'MMM d, yyyy')}
          />
          <FormItemPill
            onPress={() => showTimePicker('start')}
            title={format(startDate, 'HH:mm')}
          />
        </View>
      </FormItem>
      <FormItem label="End">
        <View className="flex-row space-x-2">
          <FormItemPill
            onPress={() => showDatePicker('end')}
            title={format(endDate, 'MMM d, yyyy')}
          />
          <FormItemPill onPress={() => showTimePicker('end')} title={format(endDate, 'HH:mm')} />
        </View>
      </FormItem>
      <FormItem className="flex-col items-start" label="Notes">
        <FormItemTextInput
          className="h-24 mt-4"
          multiline
          onChangeText={handleChangeNotes}
          placeholder="Add a note"
          defaultValue={recordDraft.notes ?? ''}
        />
      </FormItem>
      <DateTimePickerModal
        date={isDatePickerVisibleFor === 'start' ? startDate : endDate}
        isVisible={!!isDatePickerVisibleFor}
        mode="date"
        onConfirm={onConfirmDateTimePicker}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        date={isTimePickerVisibleFor === 'start' ? startDate : endDate}
        isVisible={!!isTimePickerVisibleFor}
        mode="time"
        onConfirm={onConfirmDateTimePicker}
        onCancel={hideTimePicker}
      />
      {attributes.amount && (
        <MeasuresPickerBottomSheet
          initialMeasuresPickerValue={attributes.amount}
          onChange={(data) =>
            setRecordDraft((prev) => ({
              ...prev,
              attributes: { ...(prev.attributes as FeedingAttrData), amount: data }
            }))
          }
          recordType="feeding"
          ref={measuresPickerBottomSheetRef}
        />
      )}
    </View>
  )
}

const DiaperForm: FunctionComponent<FormGroupsProps> = ({
  recordDraft,
  setRecordDraft,
  ...props
}) => {
  const attributes = recordDraft.attributes as DiaperAttrData

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)

  const [startDate, setStartDate] = useState(new Date(`${recordDraft.date}T${recordDraft.time}`))

  const showDatePicker = () => {
    setIsDatePickerVisible(true)
  }

  const hideDatePicker = () => {
    setIsDatePickerVisible(false)
  }

  const showTimePicker = () => {
    setIsTimePickerVisible(true)
  }

  const hideTimePicker = () => {
    setIsTimePickerVisible(false)
  }

  const onConfirmDateTimePicker = (date: Date) => {
    setStartDate(date)

    setRecordDraft((prev) => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd'),
      time: format(date, 'HH:mm:ss')
    }))

    hideDatePicker()

    hideTimePicker()
  }

  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleChangeNotes = (notes: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setRecordDraft((prev) => ({ ...prev, notes }))
    }, 500)
  }

  return (
    <View {...props}>
      <FormItem label="Consistency">
        <View className="flex-row space-x-2">
          {['loose', 'soft', 'hard'].map((value) => (
            <FormItemPill
              className={attributes.consistency === value ? 'bg-custom-primary' : ''}
              key={value}
              onPress={() =>
                setRecordDraft((prev) => ({
                  ...prev,
                  attributes: {
                    ...(prev.attributes as DiaperAttrData),
                    consistency: value
                  }
                }))
              }
              textClassName={attributes.consistency === value ? 'text-white' : ''}
              title={capitalizeFirstLetter(value)}
            />
          ))}
        </View>
      </FormItem>
      <FormItem label="Skin rash">
        <View className="flex-row space-x-2">
          {['none', 'mild', 'severe '].map((value) => (
            <FormItemPill
              className={attributes.skinRash === value ? 'bg-custom-primary' : ''}
              key={value}
              onPress={() =>
                setRecordDraft((prev) => ({
                  ...prev,
                  attributes: {
                    ...(prev.attributes as DiaperAttrData),
                    skinRash: value
                  }
                }))
              }
              textClassName={attributes.skinRash === value ? 'text-white' : ''}
              title={capitalizeFirstLetter(value)}
            />
          ))}
        </View>
      </FormItem>
      <FormItem label="Date">
        <View className="flex-row space-x-2">
          <FormItemPill onPress={showDatePicker} title={format(startDate, 'MMM d, yyyy')} />
          <FormItemPill onPress={showTimePicker} title={format(startDate, 'HH:mm')} />
        </View>
      </FormItem>
      <FormItem className="flex-col items-start" label="Notes">
        <FormItemTextInput
          className="h-24 mt-4"
          multiline
          onChangeText={handleChangeNotes}
          placeholder="Add a note"
          defaultValue={recordDraft.notes ?? ''}
        />
      </FormItem>
      <DateTimePickerModal
        date={startDate}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={onConfirmDateTimePicker}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        date={startDate}
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={onConfirmDateTimePicker}
        onCancel={hideTimePicker}
      />
    </View>
  )
}

export const RecordFormScreen: RootStackScreen<'RecordForm'> = ({
  navigation,
  route: {
    params: { record, type, babyProfileId }
  }
}) => {
  const recordTypeInfo = getRecordTypeInfo(type)

  const [isSaving] = useState(false)

  const [recordDraft, setRecordDraft] = useState<RecordDraft>(
    record
      ? { ...record }
      : {
          attributes: recordTypeInfo.attributes,
          date: format(new Date(), 'yyyy-MM-dd'),
          baby_profile_id: babyProfileId,
          notes: null,
          time: format(new Date(), 'HH:mm:ss'),
          type
        }
  )

  const deleteRecordBottomSheetRef = useRef<DeleteRecordBottomSheetElement>(null)

  const { addRecord, deleteRecord, updateRecord } = useRecordStore()

  const onDelete = async () => {
    if (!record) {
      return
    }

    deleteRecord(record.id)

    navigation.goBack()
  }

  const onSave = async () => {
    if (record) {
      updateRecord({ ...record, ...recordDraft })
    } else {
      addRecord(recordDraft)
    }

    navigation.goBack()
  }

  const renderFormByRecordType = () => {
    const group = getGroupByType(type)

    switch (group?.[0]) {
      case 'growth':
        return <GrowthForm recordDraft={recordDraft} setRecordDraft={setRecordDraft} />

      case 'sleep':
        return <SleepForm recordDraft={recordDraft} setRecordDraft={setRecordDraft} />

      case 'feeding':
        return <FeedingForm recordDraft={recordDraft} setRecordDraft={setRecordDraft} />

      case 'diaper':
        return <DiaperForm recordDraft={recordDraft} setRecordDraft={setRecordDraft} />
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        record ? (
          <TouchableOpacity onPress={() => deleteRecordBottomSheetRef.current?.expand()}>
            <Feather name="trash-2" size={24} color={defaultColors.red[500]} />
          </TouchableOpacity>
        ) : null,
      headerTitle: `${record ? 'Edit record' : 'New record'}`
    })
  }, [navigation, record])

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView className="pt-6 space-y-8" edges={['bottom']}>
          <BaseCard className="flex-col mx-4">
            <View className="space-y-4">
              <RecordIcon className="self-center" size={80} type={type} />
              <Text bold className="text-center text-xl">
                {recordTypeInfo.title}
              </Text>
            </View>
          </BaseCard>
          {renderFormByRecordType()}
          <Button className="mx-4" isLoading={isSaving} onPress={onSave} title="Save" />
        </SafeAreaView>
      </ScrollView>
      {record && <DeleteRecordBottomSheet onDelete={onDelete} ref={deleteRecordBottomSheetRef} />}
    </>
  )
}
