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

class AddCard extends React.Component {
  constructor(props){
    super(props);
  }
  async save() {
    this.props.navigation.state.params.onGoBack('list');
    this.props.navigation.goBack();
  }
  render() {
    return (
      <View style={CommonStyles.container}>
        <View style={CommonStyles.topBar}>
          <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
            <Image source={require('../assets/cancelIcon.png')} style={CommonStyles.backIcon}/>
          </TouchableOpacity>
          <Text style={CommonStyles.title}>Add Card</Text>
        </View>
        <ScrollView>
          
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Text style={styles.footerText}>Cancel</Text>            
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={this.save.bind(this)}>
            <Text style={styles.footerText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  footer:{
    flexDirection: 'row', 
    height: 40, 
    backgroundColor: 'green',
  },
  footerText: {
    color: 'white',
    fontSize: 20,   
  },
  footerButton: {
    width: win.width/2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },

});

export default AddCard;