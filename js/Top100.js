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

class Top100 extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    };
    this.top100 = [];
  }
  componentWillMount() {
    this.top100Pull();//Pulls 
  }
  top100Pull(){
    try{//Fetch top 10 from api
      fetch('https://api.coinmarketcap.com/v1/ticker',{
        method: 'GET'
      })
      .then( (response) => response.json()) //Convert response to JSON
      .then((responseJson) => { //Set JSON response to variable and set loaded to true
        this.top100 = responseJson;
        this.setState({loaded: true});//Loaded so it can display
      })
    }
    catch(error)
    {//If can't load the log error.
      console.log(error);
    }
  }
  render() {
    return (
     <View style={styles.container}>
          <View style={styles.topBar}>{/*Top Bar*/}
            <TouchableWithoutFeedback onPress={() => {this.props.navigation.goBack()}}>
              <Image source={require('../assets/backIcon.png')} style={styles.backIcon}/>
            </TouchableWithoutFeedback>
            <Text style={styles.title}>Top 100 Cryptos</Text>{/*Top Bar*/}
          </View>
          <ScrollView> 
            {this.state.loaded && 
              <View>{/*Top 100 loop through*/}
                {this.top100.map(currency => (
                  <Text style={{color: 'white'}} key={currency.id}>{currency.name}</Text>
                ))}
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
    flexDirection: 'row', 
  },
  backIcon: {
    height:25,
    width:25,
    marginLeft: 3,
    marginTop: 5,
  },
  title: {
    fontSize: 25, 
    marginLeft: 10,
    color: 'white', 
  },
});

export default Top100;