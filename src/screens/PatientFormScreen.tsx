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
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../types/navigation';
import { addPatient, getPatients } from '../utils/patientStorage';
import { PatientCreateSchema } from '../types/models';
import { Picker } from '@react-native-picker/picker';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'PatientForm'>;

export default function PatientFormScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState<PatientCreateSchema['name']>('');
  const [age, setAge] = useState<PatientCreateSchema['age']>(0);
  const [gender, setGender] = useState<PatientCreateSchema['gender']>('男性');
  const [height, setHeight] = useState<PatientCreateSchema['height']>(0);
  const [weight, setWeight] = useState<PatientCreateSchema['weight']>(0);

  const handleSubmit = async () => {
    if (!name || !age || !gender || !height || !weight) {
      Alert.alert('入力エラー', '全ての項目を入力してください');
      return;
    }

    try {
      const newPatient = await addPatient({
        name,
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
      });

      const allPatients = await getPatients();
      console.log('全患者データ:', allPatients);

      // Condition入力画面に遷移
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>患者名</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="例：山田太郎"
        />

        <Text style={styles.label}>年齢</Text>
        <Picker
          selectedValue={age}
          onValueChange={(itemValue) => setAge(itemValue)}
          style={styles.picker}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <Picker.Item key={i} label={`${i}歳`} value={i} />
          ))}
        </Picker>

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
        <Picker
          selectedValue={height}
          onValueChange={(itemValue) => setHeight(itemValue)}
          style={styles.picker}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <Picker.Item key={i} label={`${i}cm`} value={i} />
          ))}
        </Picker>

        <Text style={styles.label}>体重</Text>
        <Picker
          selectedValue={weight}
          onValueChange={(itemValue) => setWeight(itemValue)}
          style={styles.picker}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <Picker.Item key={i} label={`${i}kg`} value={i} />
          ))}
        </Picker>
        <View style={styles.buttonContainer}>
          <Button title="次へ（姿勢条件入力）" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 24 },
  label: { fontSize: 16, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
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


