//PatientListScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getPatients, deletePatient } from '../utils/patientStorage';
import { PatientSchema } from '../types/models';
import { useNavigation } from '@react-navigation/native';
import { PatientListStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function PatientListScreen() {
  const [patients, setPatients] = useState<PatientSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<PatientListStackParamList>>();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('取得エラー', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = (uuid: string) => {
    Alert.alert('確認', 'この患者を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await deletePatient(uuid);
          fetchPatients();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: PatientSchema }) => (
    <View style={styles.rowFront}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>ID: {item.patientId} / 年齢: {item.age}歳</Text>
    </View>
  );

  const renderHiddenItem = ({ item }: { item: PatientSchema }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        key={`detail-${item.patientId}`}
        style={[styles.backButton, styles.detailButton]}
        onPress={() =>
          navigation.navigate('PatientDetail', {
            patientId: item.patientId,
          })
        }
      >
        <Text style={styles.backText}>詳細</Text>
      </TouchableOpacity>
      <TouchableOpacity
        key={`delete-${item.patientId}`}
        style={[styles.backButton, styles.deleteButton]}
        onPress={() => handleDelete(item.uuid)}
      >
        <Text style={styles.backText}>削除</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <SwipeListView
          data={patients}
          keyExtractor={(item) => item.uuid}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-175}      // 左にスワイプして160px分開く
          disableRightSwipe={true}   // 左スワイプのみに限定
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  rowFront: {
    backgroundColor: '#f9f9f9',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 16,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 15,
    backgroundColor: '#eee',
  },
  backButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  detailButton: {
    backgroundColor: 'dodgerblue',
  },
  deleteButton: {
    backgroundColor: 'crimson',
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  name: { fontSize: 18, fontWeight: 'bold' },
});