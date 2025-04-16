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
import { HomeStackParamList } from '../types/navigation';
import { addPatient, getPatients } from '../utils/patientStorage';
import { PatientCreateSchema } from '../types/models';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'PatientForm'>;

export default function PatientFormScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<PatientCreateSchema['gender']>('男性');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = async () => {
    if (!name || !age) {
      Alert.alert('入力エラー', '名前と年齢は必須です');
      return;
    }

    try {
      const newPatient = await addPatient({
        name,
        age: Number(age),
        gender,
        height: 0,
        weight: 0,
      });

      const allPatients = await getPatients();
      console.log('全患者データ:', allPatients);

      // 動画画面ではなく、Condition入力画面に遷移
      navigation.navigate('ConditionInput', {
        patientId: newPatient.uuid,
        patientName: newPatient.name,
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

      <Text style={styles.label}>性別</Text>
      <View style={styles.genderSelector}>
        {(['男性', '女性', 'その他'] as const).map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.genderButton,
              gender === option && styles.selectedGenderButton,
            ]}
            onPress={() => setGender(option)}
          >
            <Text
              style={[
                styles.genderButtonText,
                gender === option && styles.selectedGenderButtonText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>身長</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        placeholder="例：170"
        keyboardType="numeric"
      />
      <Text style={styles.label}>体重</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        placeholder="例：70"
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <Button title="次へ（姿勢条件入力）" onPress={handleSubmit} />
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
  genderSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  genderButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#aaa',
  },
  selectedGenderButton: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  genderButtonText: {
    color: '#000',
  },
  selectedGenderButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 32,
  },
});


