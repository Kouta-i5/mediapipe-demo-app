import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { addPatient, getPatients } from '../utils/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PatientForm'>;

export default function PatientFormScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async () => {
    if (!name || !age) {
      Alert.alert('入力エラー', '名前と年齢は必須です');
      return;
    }

    try {
      const newPatient = await addPatient({
        name,
        age: Number(age),
      });

      const allPatients = await getPatients();
      console.log('全患者データ:', allPatients);

      navigation.navigate('VideoCapture', {
        patientId: newPatient.id,
        patientName: name,
        patientAge: Number(age),
      });
    } catch (e) {
      Alert.alert('保存エラー', '患者の保存に失敗しました');
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.label}>患者名</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="例：山田太郎"
      />

      <Text style={styles.label}>年齢</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="例：70"
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <Button title="次へ（動画撮影）" onPress={handleSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  label: { fontSize: 16, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
  },
  sexSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  sexButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#aaa',
  },
  selectedSexButton: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  sexButtonText: {
    color: '#000',
  },
  buttonContainer: {
    marginTop: 32,
  },
});


