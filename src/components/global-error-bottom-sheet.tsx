import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from 'src/theme/colors'

import { Button } from './button'
import { Text } from './text'

import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'

export type GlobalErrorBottomSheetElement = {
  expand(_errorMessage: string): void
}

type GlobalErrorBottomSheetProps = {
  //
}

export const GlobalErrorBottomSheet = forwardRef<
  GlobalErrorBottomSheetElement,
  GlobalErrorBottomSheetProps
>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const [error, setError] = useState<string>()

  const safeAreaInsets = useSafeAreaInsets()

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  )

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], [])

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints)

  useImperativeHandle(ref, () => ({
    expand: (errorMessage) => {
      setError(errorMessage)

      bottomSheetRef.current?.expand()
    }
  }))

  return (
    <BottomSheet
      backgroundStyle={{ backgroundColor: 'white' }}
      backdropComponent={renderBackdrop}
      contentHeight={animatedContentHeight}
      enablePanDownToClose
      handleHeight={animatedHandleHeight}
      handleIndicatorStyle={{
        backgroundColor: colors.custom.iconOff,
        borderRadius: 6,
        height: 6,
        width: 80
      }}
      index={-1}
      snapPoints={animatedSnapPoints}
      ref={bottomSheetRef}>
      <BottomSheetView
        onLayout={handleContentLayout}
        style={{ padding: 16, paddingBottom: 16 + safeAreaInsets.bottom }}>
        <View className="space-y-4">
          <View>
            <Text bold className="text-2xl text-center">
              Ops!
            </Text>
            <Text medium className="text-center">
              {error}
            </Text>
          </View>
          <Button onPress={() => bottomSheetRef.current?.close()} title="Ok" />
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
})
