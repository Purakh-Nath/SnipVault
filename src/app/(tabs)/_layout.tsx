import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { Theme } from '../../constants/theme';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>
      {icon}
    </Text>
  );
}

export default function TabLayout() {
  const { c, Colors } = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: c.textSecondary,
        tabBarStyle:             [styles.tabBar, { backgroundColor: c.surface, borderTopColor: c.border }],
        tabBarLabelStyle:        styles.tabLabel,
        headerStyle:             { backgroundColor: c.background },
        headerTintColor:         c.textPrimary,
        headerTitleStyle:        { fontFamily: 'Inter_600SemiBold' },
        headerShadowVisible:     false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:   'Snippets',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⌨️" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title:   'Favorites',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="★" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title:   'Files',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📂" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title:   'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⚙️" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth:   1,
    paddingTop:       4,
    height:           60,
  },
  tabLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.xs,
  },
});
