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

import CommonStyles from './CommonStyles';

const win = Dimensions.get('window');//Viewport

class OneCrypto extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const { params } = this.props.navigation.state;//Get params from drawer button.
    return (
     <View style={CommonStyles.container}>
          <View style={CommonStyles.topBar}>{/*Top Bar*/}
            <TouchableWithoutFeedback onPress={() => {this.props.navigation.goBack()}}>
              <Image source={require('../assets/backIcon.png')} style={CommonStyles.backIcon}/>
            </TouchableWithoutFeedback>
            {params && 
              <Text style={CommonStyles.title}>{params.name} ({params.symbol})</Text>
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
});

export default OneCrypto;