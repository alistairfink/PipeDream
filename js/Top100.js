//Imports
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  ToastAndroid, 
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
  styleBackgroundColour(index) {
    let colour = null;
    if(index%2===0)
    {
      colour = '#404040';
    }
    else
    {
      colour = 'black';
    }
    return {
      backgroundColor: colour,
      borderRightColor: 'lightslategrey',
      borderRightWidth: 2,
    }
  }
  render() {
    return (
      <View style={CommonStyles.container}>
        <View style={CommonStyles.topBar}>{/*Top Bar*/}
          <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
            <Image source={require('../assets/backIcon.png')} style={CommonStyles.backIcon}/>
          </TouchableOpacity>
          <Text style={CommonStyles.title}>Top 100 Cryptos</Text>{/*Top Bar*/}
          <View style={CommonStyles.topBarRight}>
            <TouchableOpacity onPress={() => {this.top100Pull()}}>
              <Image source={require('../assets/refreshIcon.png')} style={CommonStyles.menuIcon}/>
            </TouchableOpacity>
          </View>
        </View>
        {!(this.state.loaded) &&
          <View style={styles.loading}>
            <Text style={styles.font}>Loading...</Text>
          </View>
        }
        {this.state.loaded && 
          <ScrollView> 
            <View style={{flexDirection: 'row'}}>{/*Loops through multiple times to make columns. Refractor to be more efficient?*/}
              <View style={styles.column}>
                <View style={styles.titleBar}>
                  <Text style={styles.font}>Symbol</Text>
                </View>
                {this.top100.map((currency,index) => (
                  <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('OneCrpyto',currency)}>
                    <View style={this.styleBackgroundColour(index)}>
                      <Text style={styles.font}>{currency.symbol}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <ScrollView horizontal={true}>
                <View style={styles.column}>
                  <View style={styles.titleBar}>
                    <Text style={styles.font}>Rank</Text>
                  </View>
                  {this.top100.map((currency,index) => (
                    <View key={index}>
                      <View style={[this.styleBackgroundColour(index)]}>
                        <Text style={styles.font}># {currency.rank}</Text>
                      </View>
                    </View>
                  ))}
                </View> 
                <View style={styles.column}>
                  <View style={styles.titleBar}>
                    <Text style={styles.font}>Name</Text>
                  </View>
                  {this.top100.map((currency,index) => (
                    <View key={index}>
                      <View style={[this.styleBackgroundColour(index)]}>
                        <Text style={styles.font}>{currency.name}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.column}>
                  <View style={styles.titleBar}>
                    <Text style={styles.font}>Price (USD)</Text>
                  </View>
                  {this.top100.map((currency,index) => (
                    <View key={index}>
                      <View style={[this.styleBackgroundColour(index)]}>
                        <Text style={styles.font}>$ {parseFloat(currency.price_usd).toFixed(2)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.column}>
                  <View style={styles.titleBar}>
                    <Text style={styles.font}>Price (BTC)</Text>
                  </View>
                  {this.top100.map((currency,index) => (
                    <View key={index}>
                      <View style={[this.styleBackgroundColour(index)]}>
                        <Text style={styles.font}>฿ {currency.price_btc}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        }
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  font: {
    fontSize: 20,
    color: 'white',
    margin: 5,
  },
  titleBar: {
    alignItems: 'center',
    borderRightColor: 'black',
    borderRightWidth: 2,
    backgroundColor: 'grey'
  },
  column: {
    flexDirection: 'column',
  },
  loading: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
});

export default Top100;