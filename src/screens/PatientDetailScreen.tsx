import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getPatients, updatePatient } from '../utils/patientStorage';
import { PatientSchema } from '../types/models';
import { PatientListStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<PatientListStackParamList, 'PatientDetail'>;

export default function PatientDetailScreen() {
  const route = useRoute<Props['route']>();
  const navigation = useNavigation<NativeStackNavigationProp<PatientListStackParamList>>();
  const { patientId } = route.params;

  const [patient, setPatient] = useState<PatientSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '男性',
    height: '',
    weight: '',
  });

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      const all = await getPatients();
      const target = all.find((p) => p.uuid === patientId) || null;
      setPatient(target);
      if (target) {
        setForm({
          name: target.name,
          age: String(target.age),
          gender: target.gender,
          height: String(target.height),
          weight: String(target.weight),
        });
      }
      setLoading(false);
    };

    fetchPatient();
  }, [patientId]);

  const handleSave = async () => {
    if (!patient) return;

    const updated: PatientSchema = {
      ...patient,
      name: form.name,
      age: Number(form.age),
      gender: form.gender as '男性' | '女性' | 'その他',
      height: Number(form.height),
      weight: Number(form.weight),
    };

    try {
      await updatePatient(patientId, updated);
      Alert.alert('更新完了', '患者情報を更新しました');
      setPatient(updated);
      setEditMode(false);
    } catch (error) {
      Alert.alert('エラー', '更新に失敗しました');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>患者情報が見つかりません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>患者詳細</Text>

      {editMode ? (
        <View style={styles.infoBox}>
          <Text style={styles.label}>名前</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
          />
          <Text style={styles.label}>年齢</Text>
          <TextInput
            style={styles.input}
            value={form.age}
            onChangeText={(v) => setForm({ ...form, age: v })}
            keyboardType="numeric"
          />
          <Text style={styles.label}>性別</Text>
          <Picker
            selectedValue={form.gender}
            onValueChange={(v) => setForm({ ...form, gender: v })}
            style={styles.picker}
          >
            <Picker.Item label="男性" value="男性" />
            <Picker.Item label="女性" value="女性" />
            <Picker.Item label="その他" value="その他" />
          </Picker>
          <Text style={styles.label}>身長（cm）</Text>
          <TextInput
            style={styles.input}
            value={form.height}
            onChangeText={(v) => setForm({ ...form, height: v })}
            keyboardType="numeric"
          />
          <Text style={styles.label}>体重（kg）</Text>
          <TextInput
            style={styles.input}
            value={form.weight}
            onChangeText={(v) => setForm({ ...form, weight: v })}
            keyboardType="numeric"
          />
        </View>
      ) : (
        <View style={styles.infoBox}>
          <Text style={styles.label}>ID: {patient.patientId}</Text>
          <Text style={styles.label}>名前: {patient.name}</Text>
          <Text style={styles.label}>年齢: {patient.age}</Text>
          <Text style={styles.label}>性別: {patient.gender}</Text>
          <Text style={styles.label}>身長: {patient.height} cm</Text>
          <Text style={styles.label}>体重: {patient.weight} kg</Text>
          <Text style={styles.label}>登録日: {new Date(patient.createdAt).toLocaleDateString()}</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <Button title="戻る" onPress={() => navigation.goBack()} />
        {editMode ? (
          <Button title="保存" onPress={handleSave} />
        ) : (
          <Button title="編集" onPress={() => setEditMode(true)} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  infoBox: { marginBottom: 32 },
  label: { fontSize: 16, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  picker: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  error: { color: 'red', textAlign: 'center', fontSize: 16 },
});