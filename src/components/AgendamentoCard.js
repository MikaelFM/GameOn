import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export default function AgendamentoCard({}) {
  return (
    <TouchableOpacity style={styles.cardContent}>
        <View style={styles.leftContent}>
            <Text style={styles.statusAgendamento}>Confirmado</Text>
            <Text style={styles.nomeEsporte}>Basquete</Text>
            <Text>Clube Juvenil</Text>
        </View>
        <View style={styles.rightContent}>
            <Text style={styles.mesAgendamento}>Março</Text>
            <Text style={styles.diaAgendamento}>09</Text>
            <Text style={styles.horaAgendamento}>13:00</Text>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: 'row',    
    borderRadius: 12,
    alignItems: 'center',
    fontSize: 14,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E8EF',
    color: 'black',
    height: 120
  },
  leftContent: {
    paddingHorizontal: 10,
    width: '70%',
    height: '100%',
    gap: 5,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E6E8EF'
  },
  rightContent: {
    width: '30%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusAgendamento: {
    alignSelf: 'flex-start',
    backgroundColor: '#94fe90',
    fontWeight: 'bold',
    color: 'green',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 11,
  },
  nomeEsporte: {
    fontSize: 23,
    fontWeight: 'bold'
  },
  mesAgendamento: {
    fontSize: 13
  },
  diaAgendamento: {
    fontSize: 25
  },
  horaAgendamento: {
    fontSize: 13
  },
});