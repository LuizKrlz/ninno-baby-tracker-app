import { useCallback, useState } from 'react'

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFocusEffect } from '@react-navigation/native'
import { FirstBabyProfile, PageLoader } from 'src/components'
import { BabyProfilesScreen, HomeScreen, SettingsScreen } from 'src/screens'
import colors from 'src/theme/colors'
import { STORAGE_KEY_SELECTED_BABY_PROFILE_ID } from 'src/utils/baby-profiles'

import type { RootStackScreen, TabParamList } from './types'

const BottomTab = createBottomTabNavigator<TabParamList>()

export const TabNavigator: RootStackScreen<'Tabs'> = ({ navigation }) => {
  const [hasBabyProfile, setHasBabyProfile] = useState<boolean>()

  const verifyHasBabyProfiles = async () => {
    const selectedBabyProfileId = await AsyncStorage.getItem(STORAGE_KEY_SELECTED_BABY_PROFILE_ID)

    setHasBabyProfile(!!selectedBabyProfileId)
  }

  useFocusEffect(
    useCallback(() => {
      verifyHasBabyProfiles()
    }, [])
  )

  if (hasBabyProfile === undefined) {
    return <PageLoader className="bg-white" />
  }

  if (hasBabyProfile === false) {
    return <FirstBabyProfile goToAddRecord={() => navigation.navigate('BabyProfileCreation')} />
  }

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerTintColor: colors.custom.primary,
        headerTitleStyle: { fontFamily: 'Nunito_700Bold' }
      }}
      sceneContainerStyle={{ backgroundColor: colors.custom.background }}>
      <BottomTab.Screen
        component={HomeScreen}
        name="Home"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: () => <Feather name="home" size={24} color={colors.custom.primary} />
        }}
      />
      <BottomTab.Screen
        component={BabyProfilesScreen}
        name="BabyProfiles"
        options={{
          headerTitle: 'My ninnos',
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="baby-face-outline"
              size={24}
              color={colors.custom.primary}
            />
          )
        }}
      />
      <BottomTab.Screen
        component={SettingsScreen}
        name="Settings"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: () => <Feather name="settings" size={24} color={colors.custom.primary} />
        }}
      />
    </BottomTab.Navigator>
  )
}
