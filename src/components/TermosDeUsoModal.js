import React from "react";
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

export function TermosDeUsoModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Termos de Uso</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Feather name="x" size={22} color={COLORS.textMain} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.version}>Versão 1.0 · Vigência a partir da data de aceite</Text>

          <Section title="1. Aceitação dos Termos">
            <Body>Ao realizar o cadastro e utilizar o aplicativo GameOn, o usuário declara ter lido, compreendido e aceito integralmente os presentes Termos de Uso. Caso não concorde com qualquer disposição aqui prevista, o cadastro e o uso do aplicativo não devem ser realizados.</Body>
            <Body>Estes termos se aplicam a todos os perfis de usuário da plataforma: locatários (usuários que realizam reservas) e locadores (proprietários ou administradores de estabelecimentos esportivos).</Body>
          </Section>

          <Section title="2. Descrição do Serviço">
            <Body>O GameOn é uma plataforma digital de intermediação para agendamento e reserva de quadras esportivas, permitindo que locadores cadastrem seus estabelecimentos e disponibilizem horários, e que locatários realizem reservas de forma prática e organizada.</Body>
            <Body>O aplicativo não realiza transações financeiras, não processa pagamentos e não atua como intermediador financeiro entre as partes.</Body>
          </Section>

          <Section title="3. Cadastro e Responsabilidade dos Usuários">
            <SubTitle>3.1 Dados de Cadastro</SubTitle>
            <Body>Para utilizar o GameOn, é obrigatório o cadastro com informações pessoais verdadeiras, completas e atualizadas. O usuário é inteiramente responsável pela veracidade dos dados fornecidos e pela segurança de suas credenciais de acesso.</Body>
            <SubTitle>3.2 Responsabilidade pelo Uso da Conta</SubTitle>
            <Body>Cada usuário é responsável por todas as ações realizadas em sua conta. Em caso de uso não autorizado, o usuário deve notificar imediatamente os responsáveis pelo aplicativo.</Body>
          </Section>

          <Section title="4. Pagamentos e Responsabilidade Financeira">
            <Body bold>O GameOn não integra, não processa e não intermedia pagamentos entre locatários e locadores. A plataforma funciona exclusivamente como ferramenta de agendamento e organização de reservas.</Body>
            <SubTitle>4.1</SubTitle>
            <Body>Toda e qualquer cobrança, recebimento de valores, emissão de recibos e definição de formas de pagamento são de responsabilidade exclusiva do locador, que deverá realizar a cobrança diretamente ao locatário pelos meios que julgar adequados.</Body>
            <SubTitle>4.2 O GameOn e seus desenvolvedores não se responsabilizam por:</SubTitle>
            <BulletItem>Inadimplência do locatário;</BulletItem>
            <BulletItem>Falhas no recebimento de pagamentos pelo locador;</BulletItem>
            <BulletItem>Disputas financeiras entre as partes;</BulletItem>
            <BulletItem>Cobranças indevidas ou em duplicidade realizadas fora da plataforma.</BulletItem>
            <SubTitle>4.3</SubTitle>
            <Body>Ao aceitar estes termos, o locador reconhece ser o único responsável pela cobrança e recebimento dos valores referentes às reservas realizadas por meio da plataforma, isentando o GameOn de qualquer responsabilidade civil ou financeira decorrente de inadimplência ou falha no processamento de pagamentos externos.</Body>
          </Section>

          <Section title="5. Proteção de Dados Pessoais — LGPD (Lei nº 13.709/2018)">
            <SubTitle>5.1 Dados Coletados</SubTitle>
            <Body>Para o funcionamento do aplicativo, coletamos os seguintes dados pessoais:{"\n"}• Locatários: nome completo, e-mail e telefone.{"\n"}• Locadores: nome completo, e-mail, telefone e dados do estabelecimento.</Body>
            <SubTitle>5.2 Finalidade do Tratamento</SubTitle>
            <Body>Os dados coletados são utilizados exclusivamente para identificação e autenticação dos usuários, realização e gestão de reservas e comunicação entre a plataforma e os usuários. Os dados pessoais não serão comercializados, cedidos ou compartilhados com terceiros para fins publicitários.</Body>
            <SubTitle>5.3 Direitos dos Titulares</SubTitle>
            <Body>Em conformidade com a LGPD, todo usuário tem direito a confirmação, acesso, correção e eliminação de seus dados pessoais, além da revogação do consentimento a qualquer momento mediante solicitação aos canais oficiais do GameOn.</Body>
            <SubTitle>5.4 Segurança</SubTitle>
            <Body>O GameOn adota medidas técnicas para proteger os dados pessoais dos usuários. Em caso de incidente de segurança, os responsáveis tomarão as medidas previstas em lei, incluindo notificação à ANPD e aos titulares afetados.</Body>
          </Section>

          <Section title="6. Integridade das Reservas">
            <Body bold>Cláusula de uso obrigatório para locadores.</Body>
            <SubTitle>6.1</SubTitle>
            <Body>O GameOn não tem capacidade técnica de prever ou sincronizar reservas realizadas por meios externos à plataforma, como agendas físicas, aplicativos de mensagens ou ligações telefônicas.</Body>
            <SubTitle>6.2</SubTitle>
            <Body>Para garantir a integridade da disponibilidade de horários e evitar conflitos ou duplicação de reservas, é obrigatório que o locador utilize o GameOn como principal e único meio de controle e gestão de reservas de seu estabelecimento.</Body>
            <SubTitle>6.3</SubTitle>
            <Body>O GameOn não se responsabiliza por conflitos de agendamento decorrentes do uso paralelo de sistemas externos de controle de reservas pelo locador.</Body>
            <SubTitle>6.4</SubTitle>
            <Body>O locador que descumprir esta cláusula e causar prejuízo ao locatário em razão de conflito de agendamento assume inteira responsabilidade pelos danos causados.</Body>
          </Section>

          <Section title="7. Funcionalidades Fora do Escopo">
            <Body>O GameOn, em sua versão atual, não oferece as seguintes funcionalidades:</Body>
            <BulletItem>Integração com sistemas de pagamento online;</BulletItem>
            <BulletItem>Sistema de gerenciamento de campeonatos ou torneios;</BulletItem>
            <BulletItem>Criação e gerenciamento de equipes ou times;</BulletItem>
            <BulletItem>Chat ou recursos de comunicação direta entre usuários;</BulletItem>
            <BulletItem>Integração com dispositivos físicos de controle de acesso;</BulletItem>
            <BulletItem>Gestão de estoque e venda de produtos.</BulletItem>
            <Body>Essas funcionalidades poderão ser avaliadas para inclusão em versões futuras da plataforma.</Body>
          </Section>

          <Section title="8. Limitação de Responsabilidade">
            <Body>Os desenvolvedores do GameOn não se responsabilizam por danos diretos, indiretos, incidentais ou consequentes decorrentes do uso ou da impossibilidade de uso da plataforma, incluindo falhas de conectividade, indisponibilidade temporária do serviço ou perda de dados.</Body>
          </Section>

          <Section title="9. Alterações nos Termos de Uso">
            <Body>O GameOn se reserva o direito de alterar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor após notificação ao usuário pelo aplicativo. O uso continuado da plataforma após a notificação implica aceitação dos novos termos.</Body>
          </Section>

          <Text style={styles.footer}>
            Ao utilizar o GameOn, você confirma que leu, entendeu e concorda com todos os termos acima.
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SubTitle({ children }) {
  return <Text style={styles.subTitle}>{children}</Text>;
}

function Body({ children, bold }) {
  return (
    <Text style={[styles.body, bold && styles.bodyBold]}>{children}</Text>
  );
}

function BulletItem({ children }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textMain,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  version: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: 20,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textMain,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMain,
    marginTop: 10,
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    color: COLORS.textSub,
    lineHeight: 20,
    marginBottom: 4,
  },
  bodyBold: {
    fontWeight: "600",
    color: COLORS.textMain,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 13,
    color: COLORS.textSub,
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 13,
    color: COLORS.textSub,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    fontSize: 13,
    fontStyle: "italic",
    color: COLORS.textSub,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
    marginTop: 8,
  },
});
