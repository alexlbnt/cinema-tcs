import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/utils/theme';
import { View, Text } from 'react-native';
import { useTicketsStore } from '../../src/store/ticketsStore';

function TabBarIcon({ name, focused, badge }: { name: any; focused: boolean; badge?: number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={24}
        color={focused ? Colors.primary : Colors.textMuted}
      />
      {badge ? (
        <View style={{
          position: 'absolute', top: -4, right: -8,
          backgroundColor: Colors.primary,
          borderRadius: 8, width: 16, height: 16,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function TabsLayout() {
  const { tickets } = useTicketsStore();
  const ativos = tickets.filter((t) => t.status === 'ativo').length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="filmes"
        options={{
          title: 'Filmes',
          tabBarIcon: ({ focused }) => <TabBarIcon name="film" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="sessoes"
        options={{
          title: 'Sessões',
          tabBarIcon: ({ focused }) => <TabBarIcon name="calendar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ingressos"
        options={{
          title: 'Ingressos',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="ticket" focused={focused} badge={ativos || undefined} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabBarIcon name="person" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
