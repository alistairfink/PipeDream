//Imports
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,  
  Image, 
  Dimensions,
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
    this.crypto = null;
  }
  render() {
    const { params } = this.props.navigation.state;//Get params.
    if(params)
    {//Setting up for mapping
      this.crypto = [
        ['Rank','# '+params.rank],
        ['Price (USD)','$ '+params.price_usd],
        ['Price (BTC)','฿ '+params.price_btc],
        ['24h Volume (USD)','$ '+params['24h_volume_usd']],
        ['Market Cap (USD)','$ '+params.market_cap_usd],
        ['Available Supply',params.available_supply + ' ' +params.symbol],
        ['Total Supply',params.total_supply + ' ' +params.symbol],
        ['Max Supply', params.max_supply ? params.max_supply  + ' ' +params.symbol: '-'],
        ['1h Change',params.percent_change_1h + ' %'],
        ['24h Change',params.percent_change_24h + ' %'],
        ['7d Change',params.percent_change_7d + ' %'],
      ];
    }
    return (
     <View style={CommonStyles.container}>
          <View style={CommonStyles.topBar}>{/*Top Bar*/}
            <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
              <Image source={require('../assets/backIcon.png')} style={CommonStyles.backIcon}/>
            </TouchableOpacity>
            {params && 
              <Text style={CommonStyles.title}>{params.name} ({params.symbol})</Text>
            }{/*Crpyo Title*/}
          </View>
          <ScrollView> 
            {this.crypto && 
              <View>{/*Crypto Info*/}
                <Image  source={{uri: 'https://chasing-coins.com/api/v1/std/logo/'+params.symbol}} style={styles.logoImage}/>{/*Image of crypto*/}
                <View style={styles.textView}>
                  {this.crypto.map((item, index) => (
                    <View key={index} style={styles.menuLine}>
                      <Text style={styles.font}>{item[0]}</Text>
                      <View style={styles.rightEdge}>
                        {(item[0]==='1h Change') ? (
                            <View style={styles.changeIndication}>{/*For the 3 with the change indicators*/}
                              {parseFloat(item[1]) < 0 &&
                                <Image source={require('../assets/negative.png')} style={styles.changeIndicator}/>
                              }
                              {parseFloat(item[1]) > 0 &&
                                <Image source={require('../assets/positive.png')} style={styles.changeIndicator}/>
                              }
                              <Text style={styles.font}>{"  "+item[1]}</Text>
                            </View>
                          ) :
                          (item[0]==='24h Change') ? (
                              <View style={styles.changeIndication}>
                                {parseFloat(item[1]) < 0 &&
                                  <Image source={require('../assets/negative.png')} style={styles.changeIndicator}/>
                                }
                                {parseFloat(item[1]) > 0 &&
                                  <Image source={require('../assets/positive.png')} style={styles.changeIndicator}/>
                                }
                                <Text style={styles.font}>{"  "+item[1]}</Text>
                              </View>
                          ) : 
                          (item[0]==='7d Change') ? (
                              <View style={styles.changeIndication}>
                                {parseFloat(item[1]) < 0 &&
                                  <Image source={require('../assets/negative.png')} style={styles.changeIndicator}/>
                                }
                                {parseFloat(item[1]) > 0 &&
                                  <Image source={require('../assets/positive.png')} style={styles.changeIndicator}/>
                                }
                                <Text style={styles.font}>{"  "+item[1]}</Text>
                              </View>
                          ) : (
                            <Text style={styles.font}>{item[1]}{/*For all others*/}</Text>
                          )
                        }
                      </View>
                    </View>
                  ))}                  
                </View>
              </View>
            }
          </ScrollView>
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  logoImage: {
    width: 250, 
    height: 250, 
    alignSelf: 'center', 
    borderRadius: 40,
    margin: 20,
  },
  textView: {
    margin: 20,
  },
  menuLine: {
    borderBottomColor: 'lightslategrey', 
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  font: {
    color: 'white',
    fontSize: 20,
    margin: 5,
  },
  changeIndicator: {
    width:15,
    height: 15,
  },
  changeIndication: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  rightEdge: {
    flex:1, 
    alignItems: 'flex-end',
  },
});

export default OneCrypto;