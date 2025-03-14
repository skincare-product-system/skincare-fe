import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeScreen, ProductListScreen } from '../../screens';
import { CustomDrawer } from '../components';
import WishlistScreen from '../../screens/wishlist/WishlistScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="ProductList" component={ProductListScreen} />
      <Drawer.Screen name="Wishlist" component={WishlistScreen} />
    </Drawer.Navigator>
  );
}