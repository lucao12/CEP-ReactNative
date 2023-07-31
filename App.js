import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import api from './src/services/api';


export default function App() {

  const [cep, setCep] = useState('');
  const [cepUser, setCepUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputSair = useRef(null);

  useEffect(()=>{
    setLoading(false)
  }, []);

  function handlePressOutside() {
    inputSair.current?.blur();
  }

  async function buscar(){
    Keyboard.dismiss();
    setLoading(true);
    setCep('');
    setCepUser(null);
    console.log(cep)
    if(cep === ''){
      setLoading(false);
      Alert.alert('ERRO', 'Digite algum valor para procurar o endereço');
      setCep('');
      return;
    }
    else if(cep.length !== 9){
      setLoading(false);
      Alert.alert('ERRO', 'Digite um CEP válido');
      setCep('');
      return;
    }
    try {
      let cepFormatted = cep.replace('-', '');
      let cepDigitsOnly = cepFormatted.substring(0, 8);
      const response = await api.get(`${cepDigitsOnly}/json/`);
      if (response.data.erro === true) {
        setLoading(false);
        Alert.alert('ERRO', 'CEP inexistente');
        setCep('');
        setCepUser('');
        return;
      }
      console.log(response.data)
      setLoading(false);
      setCepUser(response.data);
    } catch (error) {
      setLoading(false);
      console.error('Erro na chamada à API:', error);
      Alert.alert('Erro', 'Ocorreu um erro na busca do CEP. Verifique sua conexão de internet e tente novamente mais tarde.');
    }
    
  }

  function limpar() {
    setCep('');
    setCepUser('');
    inputSair.current.focus();
  }

  function formatCep(texto) {
    texto = texto.replace(/\./g, '');
    let firstDashIndex = texto.indexOf('-');

    // Verificar se o hífen está em uma posição diferente da sexta
    if (firstDashIndex !== -1 && firstDashIndex !== 5) {
      // Remover o hífen do texto original
      texto = texto.replace(/-/g, '');
  
      // Inserir o hífen na sexta posição
      let newCep = texto.slice(0, 5) + '-' + texto.slice(5);
  
      texto = newCep;
    }
    if (texto.length >= 6 && !texto.includes('-')) {
      texto = texto.slice(0, 5) + '-' + texto.slice(5);
    }
    return texto;
  }

  function handleChangeText(texto) {
    setCep(formatCep(texto));
  }


  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <SafeAreaView style={styles.container}>

        

          <View 
          style={{alignItems: 'center'}}>

            <Text
            style={styles.text}>
              Digite o CEP desejado
            </Text>

            <TextInput
            style={styles.input}
            placeholder='Ex: 12345678'
            placeholderTextColor='#FFF'
            value={cep}
            onChangeText={ handleChangeText }
            keyboardType='numeric'
            ref={inputSair}
            />

          </View>

          <View
          style={styles.areaBtn}>

            <TouchableOpacity
            style={[styles.botao, {backgroundColor: '#1D75CD'}]}
            onPress={buscar}>

              <Text
              style={styles.botaoText}>

                Buscar

              </Text>

            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.botao, {backgroundColor: '#FF0000'}]}
            onPress={limpar}>

              <Text
              style={styles.botaoText}>

                Limpar

              </Text>

            </TouchableOpacity>

          </View>

            {loading && ( 
              <ActivityIndicator style={{marginTop: 150}} color="#1D75CD" size={50} />
              )}

         { cepUser && 
         <View
          style={styles.resultado}
          >

            <Text
            style={styles.itemText}>

              CEP: {cepUser.cep}

            </Text>
            <Text
            style={styles.itemText}>

              Logradouro: {cepUser.logradouro}

            </Text>
            <Text
            style={styles.itemText}>

              Complemento: {cepUser.complemento}

            </Text>
            <Text
            style={styles.itemText}>

              Bairro: {cepUser.bairro}

            </Text>
            <Text
            style={styles.itemText}>

              Cidade: {cepUser.localidade}

            </Text>
            <Text
            style={styles.itemText}>

              Estado: {cepUser.uf}

            </Text>

          </View>}

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222'
  },
  text:{
    marginTop: 25,
    marginBottom: 15,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFF'
  },
  input:{
    borderColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    color: '#FFF',
    borderRadius: 5,
    width: '90%',
    padding: 10,
    fontSize: 18,
  },
  areaBtn:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'space-around',
    width: '100%',
    
  },
  botao:{
    height: 'auto',
    width: '32%',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 5,
  },
  botaoText:{
    fontSize: 22,
    color: '#FFF',
  },
  resultado:{
    width: 'auto',
    justifyContent: 'center',
    paddingLeft: '7%',
    marginTop: '20%'
  },
  itemText:{
    fontSize: 22,
    color: '#FFF',
    paddingTop: 2
  },
});
