import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';

import { useNavigation, CommonActions } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { ProfileMenuOption } from '../../components/ProfileMenuOption';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleSair = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "login" }] })
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Fulano' }} 
            style={styles.avatar} 
          />
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>Fulano de Tal</Text>
            <Text style={styles.userEmail}>fulano.tal@gmail.com</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuContainer}>
          <ProfileMenuOption 
            icon="time-outline" 
            title="Histórico" 
            onPress={() => {}} 
          />
          <ProfileMenuOption 
            icon="document-text-outline" 
            title="Termos de Uso" 
            onPress={() => {}} 
          />
          <ProfileMenuOption 
            icon="help-circle-outline" 
            title="Ajuda" 
            onPress={() => {}} 
          />
          <ProfileMenuOption 
            icon="log-out-outline" 
            title="Sair" 
            onPress={handleSair} 
            isLast
          />
        </View>

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
    paddingTop: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 25,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoContainer: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 2,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    width: 100
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  menuContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 25,
    borderColor: COLORS.border,
    overflow: 'hidden',
  }
});