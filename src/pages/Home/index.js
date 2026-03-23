import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuadraCardWithPhoto } from '../../components/QuadraCardWithPhoto';
import CategorySearchCard from '../../components/CategorySearchCard';
import { COLORS } from '../../constants/colors'

const CATEGORIAS = [
  { id: '1', name: 'Futebol', icon: 'football' },
  { id: '2', name: 'Tênis', icon: 'tennisball' },
  { id: '3', name: 'Vôlei', icon: 'basketball' },
  { id: '4', name: 'Beach', icon: 'sunny' },
];

const QUADRAS = [
  {
    id: '1',
    name: 'Arena Central - Quadra A',
    type: 'Grama Sintética',
    price: 'R$ 120/h',
    rating: 4.8,
    image: 'https://sesisc.org.br/sites/default/files/styles/800x533/public/galeria/2021-02/quadra-poliesportiva.jpg?itok=vRxUWESB',
  },
  {
    id: '2',
    name: 'Beach Tennis Pro',
    type: 'Areia',
    price: 'R$ 80/h',
    rating: 4.9,
    image: 'https://jornalinformativo.com/wp-content/uploads/2023/04/Quadra-do-Ginasio-Poliesportivo-recebe-melhorias-1-1024x461.jpg',
  },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Jogador!</Text>
          <Text style={styles.subGreeting}>Onde vamos jogar hoje?</Text>
        </View>
        <TouchableOpacity style={styles.profileBadge}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput 
            placeholder="Buscar quadras ou clubes..." 
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.sectionTitle}>Esportes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {CATEGORIAS.map((category) => (
            <CategorySearchCard
              key={category.id} 
              category={category}
            />
          ))}
        </ScrollView>

        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Você tem jogo hoje!</Text>
            <Text style={styles.promoSubtitle}>Arena Central às 19:00</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Ver Detalhes</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="calendar" size={60} color="rgba(255,255,255,0.3)" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quadras Disponíveis</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Ver todas</Text></TouchableOpacity>
        </View>

        {QUADRAS.map((quadra) => (
          <QuadraCardWithPhoto
            key={quadra.id}  
            quadra={quadra} 
            onPress={() => console.log('Navegar para detalhes')}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textSub,
  },
  profileBadge: {
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.textMain,
  },
  categoriesList: {
    marginBottom: 25,
  },
  promoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  promoTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  promoSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginVertical: 5,
  },
  promoButton: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});