//Imports
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Platform, 
  Image, 
  Dimensions, 
  Button, 
  TouchableHighlight, 
  ToastAndroid, 
  BackHandler,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { 
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

const win = Dimensions.get('window');//Viewport

class OneCrypto extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const { params } = this.props.navigation.state;//Get params from drawer button.
    return (
     <View style={styles.container}>
          <View style={styles.topBar}>{/*Top Bar*/}
            <TouchableWithoutFeedback onPress={() => {this.props.navigation.goBack()}}>
              <Image source={require('../assets/backIcon.png')} style={styles.backIcon}/>
            </TouchableWithoutFeedback>
            {params && 
              <Text style={styles.title}>{params.name} ({params.symbol})</Text>
            }{/*Crpyo Title*/}
          </View>
          <ScrollView> 
            {params && 
              <View>{/*Crypto Info*/}
                <Image  source={{uri: 'https://files.coinmarketcap.com/static/img/coins/128x128/'+params.id+'.png'}} style={{width: 100, height: 100}}/>{/*Image of crypto*/}
                <Text style={{color: 'white', fontSize: 20}}>{params.price_usd}</Text>
                <Text style={{color: 'white', fontSize: 20}}>Test</Text>
                <Text style={{color: 'white', fontSize: 20}}>Test</Text>
              </View>
            }
          </ScrollView>
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  container: {
    height: win.height,
    width: win.width,
    backgroundColor: '#000000',
  },
  topBar: {
    width: win.width,
    height: 35,
    backgroundColor: 'green',
  },
  backIcon: {
    height:25,
    width:25,
    marginLeft: 3,
    marginTop: 5,
  },
  title: {
    position: 'absolute',
    fontSize: 25, 
    marginLeft: 40,
    color: 'white', 
  },
});

export default OneCrypto;