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
  TouchableNativeFeedback,
  RefreshControl,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { 
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import CommonStyles from './CommonStyles';

const win = Dimensions.get('window');//Viewport
const menuItems = {//Static menu items
  Converter: {
    display: 'Convert',
    route: 'Converter',
    passThrough: null,
  },
  Top100: {
    display: 'Top 100',
    route: 'Top100',
    passThrough: null,
  },
  Search: {
    display: 'Search',
    route: 'AddCard',
    passThrough: {},
  },
  Settings: {
    display: 'Settings',
    route: 'Settings',
    passThrough: null,
  },
};

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state  = {
      loaded: false,//For top X on sidebar
      refreshNow: false,
      loadedMain: false,
      cardData: [],
      refreshing: false,
    };
    this.menuRetrieve = [];//Retrieve top X
  }
  componentWillMount() {
    this.refreshAll();//On component load try to get items
    this.checkMasterList();
  }
  closeControlPanel = () => {
    this.menuDrawer.close();//Closes drawer
  };
  openControlPanel = () => {
    this.refs._menuScroll.scrollTo({x:0, y:0, animated:true});//To Scroll back to top
    this.menuDrawer.open();//Opens drawer
  };
  async getTopTen() {
    try{//Fetch top 10 from api
      let retrieveStr = await AsyncStorage.getItem('TopX');//Retrieves from app local storage
      //Read in settings
      let menuEntries = await AsyncStorage.getItem('MenuEntries');
      menuEntries = JSON.parse(menuEntries);
      menuEntries = menuEntries ? menuEntries.setting : 10;
      let refreshOnOpen = await AsyncStorage.getItem('RefreshOnOpen'); 
      refreshOnOpen = JSON.parse(refreshOnOpen);
      refreshOnOpen = refreshOnOpen ? refreshOnOpen.setting : true;
      //^^Read in settings
      if(retrieveStr){//If something was retrieved
        retrieveStr = JSON.parse(retrieveStr);//Parse string
        retrieveStr = retrieveStr.slice(0, menuEntries);
        let curDate = new Date();
        let prevDate = new Date(retrieveStr[0].last_updated*1000);//Get last updated date and current date.
        if(this.state.refreshNow)
        {//For when refreshing on back.
          this.menuRetrieve = retrieveStr;
          return;
        }
        NetInfo.isConnected.fetch().then(isConnected => {//Check connection
          if(!isConnected)
          {//If no connection set stored stuff to frontend and toast no connection then stop running.
            this.menuRetrieve = retrieveStr;
            if(!(this.state.loaded))
              this.setState({loaded: true});
            //else
              //ToastAndroid.show('No Internet', ToastAndroid.SHORT);
            return;
          }
        })
        if((curDate.getTime() - prevDate.getTime())/1000 < 300) {
          //If difference between last updated time and current is less than 5 min then don't update.
          this.menuRetrieve = retrieveStr;
          if(!(this.state.loaded))
          {
            this.setState({loaded: true});
          //  if(refreshOnOpen)
          //    ToastAndroid.show('Already Up to Date', ToastAndroid.SHORT);
          }
        //else
         //   ToastAndroid.show('Already Up to Date', ToastAndroid.SHORT);
          return;
        }
        //If refreshOnOpen is turned off and not yet loaded then load in what we already have.
        if(!refreshOnOpen && this.state.loaded===false)
        {
          this.menuRetrieve = retrieveStr;
          this.setState({loaded: true});
          return;
        }
      }
      //If no local or last update time is greater than 5 min then update
      //ToastAndroid.show('Updating...', ToastAndroid.SHORT);
      fetch('https://api.coinmarketcap.com/v1/ticker/',{
        method: 'GET'
      })
      .then( (response) => response.json()) //Convert response to JSON
      .then(async(responseJson) => { //Set JSON response to variable and set loaded to true
        await AsyncStorage.setItem('TopX', JSON.stringify(responseJson));
        this.menuRetrieve = responseJson.slice(0, menuEntries);
        this.setState({loaded: true});//Loaded so it can display
      })
    }
    catch(error)
    {//If can't load the log error.
      console.log(error);
    }
  } 
  async onGoBack(refreshOption, optionalObj) {
    this.setState({refreshNow: true});
    //Refresh based on option
    if(refreshOption === 'list')
    {
      await this.getTopTen();
    }
    else if(refreshOption === 'mainView')
    {
      await this.updateCards();
    }
    this.setState({refreshNow: false});
  }
  async checkMasterList() {
    try {
      let retrieveMaster = await AsyncStorage.getItem('MasterList');
      if(!retrieveMaster)//Checks if master list exists. Theoritcally this only happens on first startup
      {
        fetch('https://api.coinmarketcap.com/v1/ticker/?limit=99999999',{
          method: 'GET'
        })
        .then( (response) => response.json()) //Convert response to JSON
        .then(async(responseJson) => { 
          let masterList = [];
          for(let i = 0; i<responseJson.length; i++)
          {
            masterList.push({
              id: responseJson[i].id,
              name: responseJson[i].name,
            });
          }//Gets list of just names and sets to cache
          await AsyncStorage.setItem('MasterList', JSON.stringify(masterList));
        })
      }
    }
    catch(error)
    {//If can't load the log error.
      console.log(error);
    }
  }
  async refreshAll () {
    await this.updateCards();
    await this.getTopTen();
  }
  async updateCards () {
    try {
      //Retrieves from storage
      let retrieveCardList = await AsyncStorage.getItem('CardList');
      retrieveCardList = JSON.parse(retrieveCardList);
      let retrieveCardData = await AsyncStorage.getItem('CardData');
      retrieveCardData = JSON.parse(retrieveCardData);
      let refreshOnOpen = await AsyncStorage.getItem('RefreshOnOpen'); 
      refreshOnOpen = JSON.parse(refreshOnOpen);
      refreshOnOpen = refreshOnOpen ? refreshOnOpen.setting : true;
      if(retrieveCardData && !(this.state.refreshNow) && !(this.state.refreshList))
      {        
        if(!(this.state.loadedMain) && !refreshOnOpen)
        {
          this.setState({cardData: retrieveCardData, loadedMain: true});
          return;
        }
        NetInfo.isConnected.fetch().then(isConnected => {//Check connection
          if(!isConnected)
          {//If no connection set stored stuff to frontend and toast no connection then stop running.
            this.setState({cardData: retrieveCardData});
            if(!(this.state.loadedMain))
              this.setState({loadedMain: true});
            else
              ToastAndroid.show('No Internet', ToastAndroid.SHORT);
            return;
          }
        })
        let curDate = new Date();
        let prevDate = new Date(retrieveCardData[0].last_updated*1000);//Get last updated date and current date.
        if((curDate.getTime() - prevDate.getTime())/1000 < 300)
        {
          this.setState({cardData: retrieveCardData});
          if(!(this.state.loadedMain))
          {
            this.setState({loadedMain: true});
            if(refreshOnOpen)
              ToastAndroid.show('Already Up to Date', ToastAndroid.SHORT);
          }
          else
            ToastAndroid.show('Already Up to Date', ToastAndroid.SHORT);
          return;
        }
      }
      //Loops through card list and gets all data
      retrieveCardData = [];
      if(retrieveCardList)
      {
        if(!(this.state.refreshNow))
          ToastAndroid.show('Updating...', ToastAndroid.SHORT);
        for(let i = 0; i < retrieveCardList.length; i++)
        {
          await fetch('https://api.coinmarketcap.com/v1/ticker/'+retrieveCardList[i].id,{
            method: 'GET'
          })
          .then( (response) => response.json()) //Convert response to JSON
          .then(async(responseJson) => { //Set JSON response to variable and set loaded to true
            retrieveCardData.push(responseJson[0]);
          })
        }
      }
      //Throws data to storage and state
      await AsyncStorage.setItem('CardData', JSON.stringify(retrieveCardData));
      this.setState({cardData: retrieveCardData});
      this.setState({loadedMain: true});
    }
    catch(error)
    {
      console.log(error);
    }
  }
  async deleteCard (position) {
    //Local copies arrays then delets index and throws that back to storage and state.
    let localList = await AsyncStorage.getItem('CardList');
    localList = JSON.parse(localList);
    let localData = this.state.cardData;
    ToastAndroid.show('Card Deleted - ' + localList[position].name, ToastAndroid.SHORT);
    localList.splice(position, 1);
    localData.splice(position, 1);
    await AsyncStorage.setItem('CardList', JSON.stringify(localList));
    await AsyncStorage.setItem('CardData', JSON.stringify(localData));
    this.setState({cardData: localData});
  }
  async pullRefresh() {
    this.setState({refreshing: true});
    await this.updateCards();
    this.setState({refreshing: false});
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
          <View style={styles.menuBackColourGreen}>
            <View style={styles.menuBackColourBlack}>
              <ScrollView style={styles.menu} overScrollMode="never" showsVerticalScrollIndicator={false} ref='_menuScroll'>{/*Side bar menu*/}
                <View style={styles.menuTitleBox}>
                  <Text style={[styles.menuItem, styles.menuTitle]} >Menu</Text>
                </View>
                {Object.keys(menuItems).map((name: string) => (
                  <View key={name}>{/*Menu Items*/}
                    <TouchableOpacity 
                      onPress={() => {
                        this.props.navigation.navigate(menuItems[name].route,{
                          passThrough: menuItems[name].passThrough,
                          onGoBack: (refreshOption, optionalObj) => this.onGoBack(refreshOption, optionalObj),
                        });//Callback function to refresh this view
                        this.closeControlPanel(); 
                      }} 
                    >
                      <Text style={styles.menuItem}>{menuItems[name].display}</Text>
                    </TouchableOpacity>
                    {name != "Settings" &&
                      <View style={styles.menuLine}></View>
                    }
                  </View>
                ))}
                {!(this.state.loaded) &&
                  <Text>Loading...</Text>
                }{/*Until items get from api then load. THIS SHOULD ONLY EVER HAPPEN ONCE*/}
                {this.state.loaded &&
                  <View>
                    <View style={styles.menuTitleBox}>
                      <Text style={[styles.menuItem, styles.menuTitle]} >Top {this.menuRetrieve.length}</Text>
                    </View>
                    {this.menuRetrieve.map(currency => (
                      <View key={currency.rank}>{/*After top X gets from api then display*/}
                          <TouchableOpacity 
                            onPress={() => {//Sends current currency object to OneCrypto component
                              this.props.navigation.navigate('OneCrpyto',currency);
                              this.closeControlPanel();
                            }} 
                          >
                            <Text style={styles.menuItem} >{currency.rank}. {currency.name}</Text>
                          </TouchableOpacity>
                          <View style={styles.menuLine}></View>
                      </View>
                    ))}
                  </View>
                }
              </ScrollView>
            </View>
          </View>
        }
        >
          <View style={CommonStyles.container}>{/*Regular home view*/}
            <View style={CommonStyles.topBar}>
              <TouchableWithoutFeedback onPress={() => {this.openControlPanel()}}>
                <Image source={require('../assets/menuIcon.png')} style={CommonStyles.menuIcon}/>
              </TouchableWithoutFeedback>{/*Top Bar*/}
              <Text style={CommonStyles.title}>PipeDream</Text>
              <View style={CommonStyles.topBarRight}>
                <View style={CommonStyles.topBarRigthInner}>
                  <TouchableOpacity onPress={() => {this.refreshAll()}}>
                    <Image source={require('../assets/refreshIcon.png')} style={CommonStyles.menuIcon}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('AddCard',{
                      onGoBack: (refreshOption, optionalObj) => this.onGoBack(refreshOption, optionalObj),
                    });//Callback function to refresh this view
                  }}>
                    <Image source={require('../assets/addIcon.png')} style={CommonStyles.menuIcon}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <ScrollView 
              style={styles.mainView}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.pullRefresh.bind(this)}
                  title="Loading..."
                />
               }
            >{/*Main Home View*/}
              {this.state.loadedMain &&
                <View>
                  {this.state.cardData.map((currency,index) => (
                    <View key={currency.id} style={styles.cardOuter}>
                      <View style={styles.cardTop}>{/*Top Card title with X*/}
                        <TouchableOpacity 
                        onPress={() => {
                          this.props.navigation.navigate('OneCrpyto',currency);
                          this.closeControlPanel();
                        }}>
                          <Text style={styles.cardTitle}>{currency.name} ({currency.symbol})</Text>
                        </TouchableOpacity>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                          <TouchableOpacity onPress={() => {
                              this.deleteCard(index);
                            }}
                          >
                            <Image source={require('../assets/cancelIcon.png')} style={styles.xIcon}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{flexDirection: 'row', margin: 10}}>{/*Prices and Rank*/}
                        <View style={{flexDirection: 'column'}}>
                          <Text style={styles.cardText}>Rank: # {currency.rank}</Text>
                          <Text style={styles.cardText}>Price(USD): $ {parseFloat(currency.price_usd).toFixed(2)}</Text>
                          <Text style={styles.cardText}>Price(BTC): ฿ {currency.price_btc}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', flex: 1}}>{/*Percentage Changes*/}
                          <View style={{flexDirection: 'column', alignItems: 'flex-end' , flex: 1}}>
                            <Text style={styles.cardText}>1 Hour:{"  "}</Text>
                            <Text style={styles.cardText}>24 Hours:{"  "}</Text>
                            <Text style={styles.cardText}>7 Days:{"  "}</Text>
                          </View>
                          <View style={{flexDirection: 'column', alignItems: 'flex-start' }}>
                             <Text style={styles.cardText}>
                            {currency.percent_change_1h < 0 &&
                              <Image source={require('../assets/negative.png')} style={styles.changeIndicator}/>
                            }
                            {currency.percent_change_1h > 0 &&
                              <Image source={require('../assets/positive.png')} style={styles.changeIndicator}/>
                            }
                            {"  "}</Text>
                            <Text style={styles.cardText}>
                              {currency.percent_change_24h < 0 &&
                                <Image source={require('../assets/negative.png')} style={styles.changeIndicator}/>
                              }
                              {currency.percent_change_24h > 0 &&
                                <Image source={require('../assets/positive.png')} style={styles.changeIndicator}/>
                              }
                            {"  "}</Text>
                            <Text style={styles.cardText}>
                              {currency.percent_change_7d < 0 &&
                                <Image source={require('../assets/negative.png')} style={styles.changeIndicator}/>
                              }
                              {currency.percent_change_7d > 0 &&
                                <Image source={require('../assets/positive.png')} style={styles.changeIndicator}/>
                              }
                            {"  "}</Text>
                            </View>
                            <View style={{flexDirection: 'column', alignItems: 'flex-end' }}>
                              <Text style={styles.cardText}>{currency.percent_change_1h} %</Text>
                              <Text style={styles.cardText}>{currency.percent_change_24h} %</Text>
                              <Text style={styles.cardText}>{currency.percent_change_7d} %</Text>
                            </View>
                        </View>
                      </View>
                    </View>
                  ))}
                  <View style={{height: 15}}></View>
                </View>
              }
            </ScrollView>
          </View>
      </Drawer>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  menuItem: {
    fontSize: 25,
    margin: 10,
    color: 'white',
  },
  menuLine: {
    borderBottomColor: 'lightslategrey', 
    borderBottomWidth: 1,
    marginRight: 30,
  },
  menu: {
    backgroundColor: 'green', 
    flex: 1,
    borderBottomRightRadius: 5,
  },
  menuBackColourGreen: {
    flex:1,
    backgroundColor: 'green',
  },
  menuBackColourBlack: {
    flex:1,
    backgroundColor: 'black',
  },
  mainView: {
    flex: 1,
    backgroundColor: 'black',
  },
  cardOuter: {
    margin: 15,
    marginBottom: 0,
    borderRadius: 5,
    backgroundColor: 'green'
  },
  cardTop: {
    flexDirection: 'row',
    backgroundColor: 'darkgreen',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
  },
  xIcon: {
    height: 17,
    width: 17,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  cardTitle: {
    textAlignVertical: 'center',
    color: 'white',
    marginLeft: 10,
    fontSize: 20,
  },
  cardText: {
    color: 'white',
    fontSize: 15,
  },
  changeIndicator: {
    width:45,
    height: 45,
  },
  menuTitleBox: {
    flex: 1, 
    backgroundColor: 'darkgreen',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginRight: 5,
  },
  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
const drawerStyles = {
  drawer: { 
    shadowColor: '#000000', 
    shadowOpacity: 0.8, 
    shadowRadius: 3,
  },
};

export default HomeScreen;