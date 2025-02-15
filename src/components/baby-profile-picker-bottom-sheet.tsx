import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { TouchableOpacity, View } from 'react-native'
import colors from 'src/theme/colors'

import { BabyProfileCard } from './baby-profile-card'

import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import type { BabyProfileRow } from 'src/models/baby-profile'

export type BabyProfilePickerBottomSheetElement = {
  close(): void
  expand(_babyProfileList: BabyProfileRow[]): void
}

type BabyProfilePickerBottomSheetProps = {
  onSelectBabyProfile: (_babyProfile: BabyProfileRow) => void
}

export const BabyProfilePickerBottomSheet = forwardRef<
  BabyProfilePickerBottomSheetElement,
  BabyProfilePickerBottomSheetProps
>(({ onSelectBabyProfile }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const [babyProfiles, setBabyProfiles] = useState<BabyProfileRow[]>([])

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  )

  useImperativeHandle(ref, () => ({
    close: () => {
      bottomSheetRef.current?.close()
    },
    expand: (babyProfileList) => {
      setBabyProfiles(babyProfileList)

      bottomSheetRef.current?.expand()
    }
  }))

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.custom.background }}
      enableDynamicSizing
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: colors.custom.iconOff,
        borderRadius: 6,
        height: 6,
        width: 80
      }}
      index={-1}
      ref={bottomSheetRef}>
      <BottomSheetView style={{ flex: 0, minHeight: 100, padding: 16, paddingBottom: 16 }}>
        <View className="space-y-3">
          {babyProfiles.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => onSelectBabyProfile(item)}>
              <BabyProfileCard
                className="mx-4"
                birthday={item.birthday}
                gender={item.gender}
                name={item.name}
              />
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
})
