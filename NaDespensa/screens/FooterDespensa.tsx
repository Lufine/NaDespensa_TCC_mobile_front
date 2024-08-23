import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const NavigationFooter = ({ handleNavigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <TouchableOpacity onPress={() => handleNavigate('Dashboard')}>
          <Image style={styles.icon1} source={require('../assets/despensagreen.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('Profile')}>
          <Image style={styles.icon2} source={require('../assets/perfil.png')}  />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('Config')}>
          <Image style={styles.icon3} source={require('../assets/config.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    bottom: 0,
    width: '100%',
    height: height * 0.12,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  container2: {
    height: height * 0.018,
    top: height *0.06,
    bottom: 0,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  icon1: {
    margin: 'auto',
    left: 15,
    marginBottom: 5,
    maxWidth: 55,
    maxHeight: 55,
  },
  icon2: {
    margin: 'auto',
    marginBottom: 5,
    left: 20,
    maxWidth: 65,
    maxHeight: 55,
  },
  icon3: {
    margin: 'auto',
    marginBottom: 5,
    left: 15,
    maxWidth: 95,
    maxHeight: 60,
  },
  });
  
  export default NavigationFooter;