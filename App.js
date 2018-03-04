//Imports
import React from 'react';
import { 
  StackNavigator,
} from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

//Import components
import HomeScreen from './js/Home';
import Settings from './js/Settings';
import OneCrypto from './js/OneCrypto';
import Top100 from './js/Top100';
import AddCard from './js/AddCard';
import Converter from './js/Converter.js';

//Navigator for pages
const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Top100: {
      screen: Top100,
    },
    Settings: {
      screen: Settings,
    },
    OneCrpyto: {
      screen: OneCrypto,
    },
    AddCard: {
      screen: AddCard,
    },
    Converter: {
      screen: Converter,
    }
  },
  {
    headerMode: 'none',
    transitionConfig: getSlideFromRightTransition,//Right to left transition
    initialRouteName: 'Home',//Initial page
  }
);

export default class App extends React.Component{
  render(){//For navigation
    return(
      <RootStack />
    );
  }
}

