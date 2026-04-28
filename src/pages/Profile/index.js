import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
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
import { TermosDeUsoModal } from "../../components/TermosDeUsoModal";
import { HistoricoModal } from "../../components/HistoricoModal";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [termosVisible, setTermosVisible] = useState(false);
  const [historicoVisible, setHistoricoVisible] = useState(false);
  const { user, token, signOut } = useContext(AuthContext);

  const handleEditPress = () => setEditModalVisible(true);
  const handleCloseModal = () => setEditModalVisible(false);

  function getIniciais(nome) {
    if (!nome) return "?";
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  const handleSair = () => {
    Alert.alert(
      "Sair",
      "Deseja mesmo sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser({ id: user?.id, token });
            } catch (error) {
              Alert.alert("Aviso", error?.message || "Falha ao comunicar logout com servidor.");
            } finally {
              await signOut();
            }
          },
        },
      ]
    );
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
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getIniciais(user?.nome)}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{user?.nome ?? "—"}</Text>
            <Text style={styles.userEmail}>{user?.email ?? "—"}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuContainer}>
          <ProfileMenuOption
            icon="time-outline"
            title="Histórico"
            onPress={() => setHistoricoVisible(true)}
          />
          <ProfileMenuOption
            icon="document-text-outline"
            title="Termos de Uso"
            onPress={() => setTermosVisible(true)}
          />
          <ProfileMenuOption
            icon="help-circle-outline"
            title="Ajuda"
            onPress={() =>
              Alert.alert(
                "Ajuda",
                "Para dúvidas, entre em contato com:\n\ngameon.if@gmail.com"
              )
            }
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

      <HistoricoModal
        visible={historicoVisible}
        onClose={() => setHistoricoVisible(false)}
      />

      <TermosDeUsoModal
        visible={termosVisible}
        onClose={() => setTermosVisible(false)}
      />
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
    backgroundColor: "rgba(46,125,50,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1,
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
