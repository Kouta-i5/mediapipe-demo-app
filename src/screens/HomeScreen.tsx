//HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>姿勢撮影アプリ</Text>
      <Text style={styles.description}>
        本アプリでは、患者の姿勢撮影および管理が行えます。
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 患者一覧</Text>
        <Text style={styles.sectionText}>
          これまでに登録された患者情報を確認できます。詳細をタップすることで、患者情報の編集や、過去に撮影した動画の確認ができます。
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎥 動画一覧</Text>
        <Text style={styles.sectionText}>
          撮影されたすべての動画の一覧を確認できます。各動画には、撮影条件や患者情報が紐づいており、動画の詳細確認も可能です。
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🆕 新規撮影</Text>
        <Text style={styles.sectionText}>
          画面下の「新規撮影」フローでは、患者情報の入力から、姿勢条件の設定、30秒の動画撮影までを順に進めることができます。
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PatientForm')}
      >
        <Text style={styles.buttonText}>新規撮影を行う
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, marginBottom: 24, textAlign: 'center', color: '#444' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  sectionText: { fontSize: 15, color: '#333', lineHeight: 22 },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
