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
  AsyncStorage,
  NetInfo,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { 
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import CommonStyles from './CommonStyles';

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
  async top100Pull() {
    try{//Fetch top 10 from api
      let retrieveStr = await AsyncStorage.getItem('TopX');//Retrieves from app local storage
      if(retrieveStr){//If something was retrieved
        retrieveStr = JSON.parse(retrieveStr);//Parse string
        let curDate = new Date();
        let prevDate = new Date(retrieveStr[0].last_updated*1000);//Get last updated date and current date.
        NetInfo.isConnected.fetch().then(isConnected => {//Check connection
          if(!isConnected)
          {//If no connection set stored stuff to frontend and toast no connection then stop running.
            this.top100 = retrieveStr;
            if(!(this.state.loaded))
              this.setState({loaded: true});
            else
              ToastAndroid.show('No Internet', ToastAndroid.SHORT);
            return;
          }
        })
        if(!(this.state.loaded))
        {//When you open view shouldn't get new cryptos
          this.top100 = retrieveStr;
          this.setState({loaded: true});
          return;
        }
        if((curDate.getTime() - prevDate.getTime())/1000 < 300) {
          //If difference between last updated time and current is less than 5 min then don't update.
          this.top100 = retrieveStr;
          if(!(this.state.loaded))
            this.setState({loaded: true});
          else
            ToastAndroid.show('Already Up to Date', ToastAndroid.SHORT);
          return;
        }
      }
      //If no local or last update time is greater than 5 min then update
      ToastAndroid.show('Updating...', ToastAndroid.SHORT);
      fetch('https://api.coinmarketcap.com/v1/ticker/',{
        method: 'GET'
      })
      .then( (response) => response.json()) //Convert response to JSON
      .then(async(responseJson) => { //Set JSON response to variable and set loaded to true
        await AsyncStorage.setItem('TopX', JSON.stringify(responseJson));
        this.setState({loaded: true});//Loaded so it can display
        this.top100 = responseJson;
      })
    }
    catch(error)
    {//If can't load the log error.
      console.log(error);
    }
  } 
  render() {
    return (
     <View style={CommonStyles.container}>
          <View style={CommonStyles.topBar}>{/*Top Bar*/}
            <TouchableWithoutFeedback onPress={() => {this.props.navigation.goBack()}}>
              <Image source={require('../assets/backIcon.png')} style={CommonStyles.backIcon}/>
            </TouchableWithoutFeedback>
            <Text style={CommonStyles.title}>Top 100 Cryptos</Text>{/*Top Bar*/}
            <View style={CommonStyles.topBarRight}>
              <TouchableWithoutFeedback onPress={() => {this.top100Pull()}}>
                <Image source={require('../assets/refreshIcon.png')} style={CommonStyles.menuIcon}/>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <ScrollView> 
            {!(this.state.loaded) &&
              <Text style={{color:'white'}}>Loading...</Text>
            }
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
});

export default Top100;