import type { FunctionComponent } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BabyProfileCreationScreen, WelcomeScreen } from 'src/screens'
import colors from 'src/theme/colors'

import { TabNavigator } from './tab-navigator'

import type { RootStackParamList } from './types'

const NativeStack = createNativeStackNavigator<RootStackParamList>()

export const RootNavigator: FunctionComponent = () => (
  <NativeStack.Navigator
    initialRouteName="Welcome"
    screenOptions={{ contentStyle: { backgroundColor: colors.custom.background } }}>
    <NativeStack.Screen component={TabNavigator} name="Tabs" options={{ headerShown: false }} />
    <NativeStack.Screen
      component={BabyProfileCreationScreen}
      name="BabyProfileCreation"
      options={{
        headerTintColor: colors.custom.primary,
        headerTitle: '',
        headerTransparent: true
      }}
    />
    <NativeStack.Screen
      component={WelcomeScreen}
      name="Welcome"
      options={{ contentStyle: { backgroundColor: colors.custom.blue4 }, headerShown: false }}
    />
  </NativeStack.Navigator>
)
