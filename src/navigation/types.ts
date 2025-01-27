import type { FunctionComponent } from 'react'

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { BabyProfileRow } from 'src/models/baby-profile'
import type { RecordRow, RecordType } from 'src/models/record'

export type RootStackParamList = {
  BabyProfileCreation: undefined
  BabyProfileEdition: { babyProfile: BabyProfileRow }
  RecordForm: { record?: RecordRow; type: RecordType; babyProfileId: number }
  Tabs: undefined | NavigatorScreenParams<TabParamList>
  Welcome: undefined
}

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>

export type RootStackScreen<RouteName extends keyof RootStackParamList> = FunctionComponent<
  RootStackScreenProps<RouteName>
>

export type TabParamList = {
  BabyProfiles: undefined
  Home: undefined
  Records: undefined
  Settings: undefined
}

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>

export type TabScreen<RouteName extends keyof TabParamList> = FunctionComponent<
  TabScreenProps<RouteName>
>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
