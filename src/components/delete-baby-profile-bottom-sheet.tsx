import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from 'src/theme/colors'

import { Button } from './button'
import { Text } from './text'

import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'

export type DeleteBabyProfileBottomSheetElement = {
  close(): void
  expand(): void
  setIsDeleting(_deleting: boolean): void
}

type DeleteBabyProfileBottomSheetProps = {
  onDelete(): void
}

export const DeleteBabyProfileBottomSheet = forwardRef<
  DeleteBabyProfileBottomSheetElement,
  DeleteBabyProfileBottomSheetProps
>(({ onDelete }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const [isDeleting, setIsDeleting] = useState(false)

  const safeAreaInsets = useSafeAreaInsets()

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
    expand: () => {
      bottomSheetRef.current?.expand()
    },
    setIsDeleting: (deleting) => setIsDeleting(deleting)
  }))

  return (
    <Portal>
      <BottomSheet
        backgroundStyle={{ backgroundColor: 'white' }}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={!isDeleting}
        handleIndicatorStyle={{
          backgroundColor: colors.custom.iconOff,
          borderRadius: 6,
          height: 6,
          width: 80
        }}
        index={-1}
        enableDynamicSizing
        ref={bottomSheetRef}>
        <BottomSheetView
          style={{
            flex: 0,
            minHeight: 100,
            padding: 16,
            paddingBottom: 16 + safeAreaInsets.bottom
          }}>
          <View className="space-y-4">
            <View>
              <Text bold className="text-2xl text-center">
                Delete ninno
              </Text>
              <Text medium className="text-center">
                Do you really want to delete this ninno?
              </Text>
            </View>
            <View className="flex-row justify-between space-x-5">
              {!isDeleting && (
                <Button
                  className="flex-1"
                  onPress={() => bottomSheetRef.current?.close()}
                  title="Cancel"
                  variant="outline"
                />
              )}
              <Button className="flex-1" isLoading={isDeleting} onPress={onDelete} title="Delete" />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
})
