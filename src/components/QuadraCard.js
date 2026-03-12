import { StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';

export default function QuadraCard({}) {
  return (
    <TouchableOpacity style={styles.mainContainer}>
        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7kHUUrCw3xDKhffx82475vLZpxms-8gMFNg&s' }} style={styles.image}>
        </Image>
        <View style={styles.descriptionContent}>
            <Text style={styles.local}>Clube Juvenil</Text>
            <Text style={styles.detalhes}>R. Ver. Cibelli, 179 - Planalto, Farroupilha - RS</Text>
            <View style={styles.bottomContent}>
              <Text style={styles.valor}>R$ 75,00</Text>
            </View>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',    
    borderRadius: 12,
    alignItems: 'center',    
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 0,
    borderColor: '#E6E8EF',
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 10,
  },  
  image: {
    width: 100,
    height: 100,
    borderRadius: 8
  },
  descriptionContent: {
    paddingHorizontal: 10,
    height: '100%',
    flex: 1,
    gap: 5
  },
  local: {
    fontSize: 17,
    fontWeight: 500
  },
  bottomContent: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  valor: {
    fontSize: 15,
    fontWeight: 700,
    color: 'green'
  },
  reservarButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    // backgroundColor: '#F8F9FA',
    backgroundColor: '#E6E8EF',
    borderRadius: 8,
    borderWidth: 0,
    borderColor: '#000000',
    color: 'black'
  }
});