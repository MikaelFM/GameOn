import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { COLORS } from '../../constants/colors';
import ScheduleCard from '../../components/ScheduleCard';

const UPCOMING = [
  { id: '1', courtName: 'Arena Central - Quadra A', date: '22 Mar', time: '19:00', location: 'Bairro Centro' },
  { id: '2', courtName: 'Beach Tennis Pro', date: '25 Mar', time: '08:00', location: 'Orla Marítima' },
];

const COMPLETED = [
  { id: '3', courtName: 'Clube do Tênis', date: '10 Mar', time: '17:00', location: 'Jardim América' },
];

export default function Schedules() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Meus Jogos</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              Próximos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Concluídos
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={activeTab === 'upcoming' ? UPCOMING : COMPLETED}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ScheduleCard 
              item={item} 
              isCompleted={activeTab === 'completed'} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSub,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: COLORS.textSub,
  },
});