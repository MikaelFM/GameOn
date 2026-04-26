import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";

import { useNavigation, CommonActions } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { ProfileMenuOption } from "../../components/ProfileMenuOption";
import { Button } from "../../components/Button";
import { AuthContext } from "../../contexts/AuthContext";
import Cadastro from "../SignUp/formUser";
import { logoutUser } from "../../services/loginService";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { user, token, signOut } = useContext(AuthContext);

  const handleEditPress = () => {
    setEditModalVisible(true);
  };
  const handleCloseModal = () => {
    setEditModalVisible(false);
  };

  const handleSair = async () => {
    try {
      await logoutUser({ id: user?.id, token });
    } catch (error) {
      Alert.alert("Aviso", error?.message || "Falha ao comunicar logout com servidor.");
    } finally {
      await signOut();
    }
  };

  useEffect(() => {
    if (user) {
      setUserData({ nome: user.nome, email: user.email });
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: "https://avatar.iran.liara.run/public/boy?username=Fulano",
            }}
            style={styles.avatar}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{user?.nome ?? "—"}</Text>
            <Text style={styles.userEmail}>{user?.email ?? "—"}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
            >
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
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <Cadastro isEditing userData={userData} onClose={handleCloseModal} />
      </Modal>
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
    fontWeight: "bold",
    color: COLORS.textMain,
    marginBottom: 25,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    width: 100,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
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
    overflow: "hidden",
  },
});
