import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfirmScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>確認画面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});

