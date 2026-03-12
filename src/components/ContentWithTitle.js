import { StyleSheet, Text, View } from 'react-native';

export default function ContentWithTitle({ title, children }) {
  return (
    <View style={styles.mainContent}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.subContent}>
          {children}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    paddingTop: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 500
  },
  subContent: {
    paddingTop: 10,
    gap: 10
  }

});