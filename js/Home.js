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

const win = Dimensions.get('window');//Viewport
const menuItems = {//Static menu items
  Home: {
    display: 'Home',
    route: 'Home',
  },
  Top100: {
    display: 'Top 100',
    route: 'Top100',
  },
  Settings: {
    display: 'Settings',
    route: 'Settings',
  },
};

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state  = {
      loaded: false,//For top X on sidebar
    };
    this.menuRetrieve = [];//Retrieve top X
  }
  componentWillMount() {
    this.getTopTen();//On component load try to get items
  }
  closeControlPanel = () => {
    this.menuDrawer.close();//Closes drawer
  };
  openControlPanel = () => {
    this.menuDrawer.open();//Opens drawer
  };
  async getTopTen() {
    try{//Fetch top 10 from api
      let retrieveStr = await AsyncStorage.getItem('TopX');//Retrieves from app local storage
      if(retrieveStr){//If something was retrieved
        retrieveStr = JSON.parse(retrieveStr);//Parse string
        let curDate = new Date();
        let prevDate = new Date(retrieveStr[0].last_updated*1000);//Get last updated date and current date.
        NetInfo.isConnected.fetch().then(isConnected => {//Check connection
          if(!isConnected)
          {//If no connection set stored stuff to frontend and toast no connection then stop running.
            this.menuRetrieve = retrieveStr;
            if(!(this.state.loaded))
              this.setState({loaded: true});
            else
              ToastAndroid.show('No Internet', ToastAndroid.SHORT);
            return;
          }
        })
        if((curDate.getTime() - prevDate.getTime())/1000 < 300) {
          //If difference between last updated time and current is less than 5 min then don't update.
          this.menuRetrieve = retrieveStr;
          if(!(this.state.loaded))
            this.setState({loaded: true});
          else
            ToastAndroid.show('Already Up to Date', ToastAndroid.SHORT);
          return;
        }
      }
      //If no local or last update time is greater than 5 min then update
      ToastAndroid.show('Updating...', ToastAndroid.SHORT);
      fetch('https://api.coinmarketcap.com/v1/ticker/?limit=10',{
        method: 'GET'
      })
      .then( (response) => response.json()) //Convert response to JSON
      .then(async(responseJson) => { //Set JSON response to variable and set loaded to true
        await AsyncStorage.setItem('TopX', JSON.stringify(responseJson));
        this.menuRetrieve = responseJson;
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
      <Drawer 
        type="static"
        tapToClose={true}
        openDrawerOffset={0.4} 
        panCloseMask={0.4}
        styles={drawerStyles}
        negotiatePan={true}
        ref={(ref) => this.menuDrawer = ref}
        content={
          <ScrollView style={styles.menu}>{/*Side bar menu*/}
            {Object.keys(menuItems).map((name: string) => (
              <View key={name}>{/*Menu Items*/}
                <TouchableOpacity 
                  onPress={() => {
                    if(!(name==='Home'))
                      this.props.navigation.navigate(menuItems[name].route);
                    this.closeControlPanel(); 
                  }} 
                >
                  <Text style={styles.menuItem}>{menuItems[name].display}</Text>
                </TouchableOpacity>
                <View style={styles.menuLine}></View>
              </View>
            ))}
            {!(this.state.loaded) &&
              <Text>Loading...</Text>
            }{/*Until items get from api then load. THIS SHOULD ONLY EVER HAPPEN ONCE*/}
            {this.state.loaded &&
              <View>
                {this.menuRetrieve.map(currency => (
                  <View key={currency.rank}>{/*After top X gets from api then display*/}
                      <TouchableOpacity 
                        onPress={() => {//Sends current currency object to OneCrypto component
                          this.props.navigation.navigate('OneCrpyto',currency);
                          this.closeControlPanel();
                        }} 
                      >
                        <Text style={styles.menuItem} >{currency.name}</Text>
                      </TouchableOpacity>
                      <View style={styles.menuLine}></View>
                  </View>
                ))}
              </View>
            }
          </ScrollView>
        }
        >
          <View style={styles.container}>{/*Regular home view*/}
            <View style={styles.topBar}>
              <TouchableWithoutFeedback onPress={() => {this.openControlPanel()}}>
                <Image source={require('../assets/menuIcon.png')} style={styles.menuIcon}/>
              </TouchableWithoutFeedback>{/*Top Bar*/}
              <Text style={styles.title}>PipeDream</Text>
              <View style={styles.topBarRight}>
                <TouchableWithoutFeedback onPress={() => {this.getTopTen()}}>
                  <Image source={require('../assets/refreshIcon.png')} style={styles.menuIcon}/>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <ScrollView>{/*Main Home View*/}
            </ScrollView>
          </View>
      </Drawer>
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
  menuIcon: {
    height:25,
    width:25,
    marginLeft: 3,
    marginTop: 5,
    marginRight: 5,
  },
  menuItem: {
    fontSize: 30,
    margin: 5,
  },
  menuLine: {
    borderBottomColor: 'chartreuse', 
    borderBottomWidth: 1,
  },
  menu: {
    backgroundColor: 'darkcyan', 
    flex: 1,
  },
  topBarRight: {
    flex: 1, 
    alignItems: 'flex-end',
    marginRight: 10,
  },
  title: {
    fontSize: 25, 
    marginLeft: 5,
    color: 'white', 
  },
});
const drawerStyles = {
  drawer: { 
    shadowColor: '#000000', 
    shadowOpacity: 0.8, 
    shadowRadius: 3
  },
};

export default HomeScreen;