import { 
  StyleSheet, 
  Dimensions, 
} from 'react-native';

const win = Dimensions.get('window');//Viewport

export default StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 5,
    color: 'white', 
  },
  topBarRight: {
    flex: 1, 
    alignItems: 'flex-end',
    marginRight: 10,
  },
  menuIcon: {
    height:25,
    width:25,
    marginLeft: 3,
    marginTop: 5,
    marginRight: 5,
  },
});
