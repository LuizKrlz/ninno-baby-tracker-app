import { Image, View } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text } from 'src/components'

import type { RootStackScreen } from 'src/navigation/types'

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)

export const WelcomeScreen: RootStackScreen<'Welcome'> = ({ navigation }) => (
  <AnimatedSafeAreaView className="flex-1 justify-between p-10" entering={FadeInUp}>
    <View className="space-y-5">
      <Text bold className="text-3xl text-center">
        Welcome to
      </Text>
      <Image
        className="self-center w-1/2"
        resizeMode="contain"
        source={require('assets/logo-ninno.png')}
      />
    </View>
    <View className="space-y-10">
      <Image
        className="self-center w-full"
        resizeMode="contain"
        source={require('assets/logo-ninno-face.png')}
      />
      <Text className="text-center" medium>
        {`Keep track of baby's feeding, sleeps, diapers & growth in one place.`}
      </Text>
    </View>
    <Button onPress={() => navigation.navigate('BabyProfileCreation')} title="Get started" />
  </AnimatedSafeAreaView>
)
