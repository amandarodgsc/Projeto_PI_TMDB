import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BookmarkSimple, House, MagnifyingGlass } from 'phosphor-react-native';
import { Home } from '../screens/Home';
import { Search } from '../screens/Search';
import MyList from '../screens/MyList'; // Corrigi a importação para o MyList
import { Details } from '../screens/Details';

const { Navigator, Screen } = createBottomTabNavigator();

export function TabRoutes() {
  return (
    <Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#242A32',
          height: 78,
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: '#0296E5',
        },
        headerShown: false,
        tabBarActiveTintColor: '#0296E5',
        tabBarInactiveTintColor: '#67686D',
        tabBarShowLabel: false,
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <House color={color} size={30} weight="light" />
          ),
        }}
      />
      <Screen
        name="Details"
        component={Details}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Screen
        name="MyList"
        component={MyList}
        options={{
          tabBarIcon: ({ color }) => (
            <BookmarkSimple color={color} size={30} weight="light" />
          ),
        }}
      />
      <Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color }) => (
            <MagnifyingGlass color={color} size={30} weight="light" />
          ),
        }}
      />
    </Navigator>
  );
}
