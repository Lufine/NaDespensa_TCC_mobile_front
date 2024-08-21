import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';

const Help = ({ navigation, route }) => {
  const { userId } = route.params;
  const [currentStep, setCurrentStep] = useState(1);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleNext = () => {
    if (currentStep < 3) {
      Animated.timing(translateX, {
        toValue: -500, // Valor para onde a imagem será animada (esquerda)
        duration: 300, // Duração da animação
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
        translateX.setValue(500); // Colocar a próxima imagem fora da tela à direita
        Animated.timing(translateX, {
          toValue: 0, // Traz a imagem para o centro
          duration: 200, // Duração da animação
          useNativeDriver: true,
        }).start();
      });
    } else {
      navigation.navigate('Profile', { userId });
    }
  };

  const getImageSource = () => {
    if (currentStep === 1) {
      return require('../assets/help1.png');
    } else if (currentStep === 2) {
      return require('../assets/help2.png');
    } else if (currentStep === 3) {
      return require('../assets/help3.png');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.design} source={require('../assets/desingtopright.png')} />
      <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId })} style={styles.backContainer}>
        <Text style={styles.skip}>Pular</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.imageContainer, { transform: [{ translateX }] }]}>
        <Image source={getImageSource()} style={styles.image} />
      </Animated.View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{currentStep < 3 ? 'Próximo' : 'Concluir'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  design: {
    width: 220,
    height: 200,
    position: 'absolute',
    right: "-5%",
    top: "-2%",
  },
  backContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: '25%',
    color: '#3CB371',
  },
  skip: {
    color: '#3CB371',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    maxWidth: 375,
    maxHeight: 450,
    marginTop: '10%',
  },
  button: {
    backgroundColor: '#3CB371',
    padding: 20,
    borderRadius: 10,
    marginBottom: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default Help;
