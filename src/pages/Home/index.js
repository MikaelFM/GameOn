import { Dimensions, Text, View, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalitySearchCard from '../../../src/components/ModalitySearchCard';
import AgendamentoCard from '../../../src/components/AgendamentoCard';
import ContentWithTitle from '../../../src/components/ContentWithTitle';
import QuadraCard from '../../components/QuadraCard';
import QuadraCardEstreito from '../../components/QuadraCardEstreito';

const MODALIDADES = [
  { id: '1', title: 'Futebol', icon: 'football' },
  { id: '2', title: 'Vôlei', icon: 'tennisball' },
  { id: '3', title: 'Basquete', icon: 'basketball' },
];

export default function Home() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}></View>
        <View style={styles.body}>
          <View style={styles.saudacaoContainer}>
            <Text style={styles.textoSaudacao}>Olá, Mundo!</Text>
            <Text style={styles.textDataAtual}>Sexta, 2 de Fevereiro</Text>
          </View>
          <View style={styles.searchArea}>
            <TextInput style={styles.searchInput} placeholder="Buscar"></TextInput>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={18} color={'white'}></Ionicons>
            </TouchableOpacity>
          </View>
          <View style={styles.modalitySearchContent}>
              {MODALIDADES.map((item) => (
                <ModalitySearchCard 
                  key={item.id} 
                  title={item.title} 
                  icon={item.icon} 
                />
              ))}
            </View>
          <ContentWithTitle title="Agendamentos">
            <AgendamentoCard></AgendamentoCard>
          </ContentWithTitle>
          <ContentWithTitle title="Recomendados">
            <QuadraCard></QuadraCard>
          </ContentWithTitle>
          <ContentWithTitle title="Recomendados">
            <QuadraCardEstreito></QuadraCardEstreito>
          </ContentWithTitle>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItens: 'center',
    backgroundColor: '#FFFFFF',
    paddingBottom: 250
  },
  header: {
    width: '100%',
    height: Dimensions.get('window').height/9,
  },
  body: {
    paddingVertical: '5%',
    paddingHorizontal: 25,
  },
  saudacaoContainer: {
    paddingVertical: 30,
  },
  textoSaudacao: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  textDataAtual: {
    fontSize: 17
  },
  searchArea: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    gap: 10
  },
  searchInput: {
    fontSize: 14,
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E6E8EF'
  },
  searchButton: {
    width: '14%',
    borderRadius: 8,
    backgroundColor: '#2B9D48',
    alignItens: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalitySearchContent: {
    flexDirection: 'row',
    gap: 5,
    paddingTop: 20
  },
})