import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import { FootCondition, StandingCondition } from '../types/models';

type Props = NativeStackScreenProps<HomeStackParamList, 'ConditionInput'>;

export default function ConditionInputScreen({ navigation, route }: Props) {
  const [footCondition, setFootCondition] = useState<FootCondition>('平地上立位');
  const [standingCondition, setStandingCondition] = useState<StandingCondition>('開眼・開脚');
  const [legWidth, setLegWidth] = useState('30');

  const handleNext = () => {
    const parsedLegWidth = parseFloat(legWidth);
    if (isNaN(parsedLegWidth)) {
      Alert.alert('入力エラー', '開脚幅は数値で入力してください');
      return;
    }

    const condition = {
      footCondition,
      standingCondition,
      legWidth: parsedLegWidth,
    };

    navigation.navigate('VideoCapture', {
      patientId: route.params.patientId,
      condition,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>足場の条件</Text>
      <Picker
        selectedValue={footCondition}
        onValueChange={(itemValue) => setFootCondition(itemValue as FootCondition)}
        style={styles.picker}
      >
        <Picker.Item label="マット上立位" value="マット上立位" />
        <Picker.Item label="平地上立位" value="平地上立位" />
      </Picker>

      <Text style={styles.label}>立ち方の条件</Text>
      <Picker
        selectedValue={standingCondition}
        onValueChange={(itemValue) => setStandingCondition(itemValue as StandingCondition)}
        style={styles.picker}
      >
        <Picker.Item label="開眼・開脚" value="開眼・開脚" />
        <Picker.Item label="開眼・閉脚" value="開眼・閉脚" />
        <Picker.Item label="閉眼・開脚" value="閉眼・開脚" />
        <Picker.Item label="閉眼・閉脚" value="閉眼・閉脚" />
      </Picker>

      <Text style={styles.label}>開脚幅（cm）</Text>
      <TextInput
        style={styles.input}
        value={legWidth}
        onChangeText={setLegWidth}
        keyboardType="numeric"
        placeholder="例：30"
      />

      <View style={styles.buttonContainer}>
        <Button title="次へ（動画撮影）" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  label: { fontSize: 16, marginTop: 16 },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 32,
  },
});