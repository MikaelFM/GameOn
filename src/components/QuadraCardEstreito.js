import { StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';

export default function QuadraCardEstreito({}) {
  return (
    <View style={styles.mainContainer}>
        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7kHUUrCw3xDKhffx82475vLZpxms-8gMFNg&s' }} style={styles.image}>
        </Image>
        <View style={styles.descriptionContent}>
            <Text style={styles.local}>Clube Juvenil</Text>
            <Text style={styles.detalhes}>R. Ver. Cibelli, 179 - Planalto, Farroupilha - RS</Text>
            <TouchableOpacity style={styles.reservarButton}>
              <Text>Reservar</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    borderRadius: 12,
    alignItems: 'center',    
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 0,
    borderColor: '#E6E8EF',
    gap: 10,
    width: 160,
    paddingTop: 5,
    paddingBottom: 20
  },  
  image: {
    width: '95%',
    height: 120,
    borderRadius: 8,
  },
  descriptionContent: {
    paddingHorizontal: 10,
    height: '100%',
    width: '100%',
    flex: 1,
    gap: 10
  },
  local: {
    fontSize: 17,
    fontWeight: 500,
    padding: 0,
    margin: 0,
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
  detalhes: {
    fontSize: 13,
    color: '#323232'
  },
  reservarButton: {
    marginTop: 5,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    // backgroundColor: '#F8F9FA',
    // backgroundColor: '#E6E8EF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    color: 'black'
  }
});