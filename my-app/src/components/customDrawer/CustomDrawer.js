import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import http from '../../utils/http';

export default function CustomDrawer({ navigation }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [category, setCategory] = useState([]);

  useEffect(() => {
    async function getCategories() {
      try {
        const result = await http.get('categories');
        setCategory(result.data);
      } catch (error) {
        console.error('Lỗi khi fetch categories:', error);
      }
    }
    getCategories();
  }, []);

  const toggleSubMenu = (categoryId) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const renderCategory = (item) => (
    <View key={item.id} style={{ marginBottom: 10 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductList', { name: item.name, category: item.subCategories || [] })}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
      {item.subCategories && item.subCategories.length > 0 && (
        <View style={{ marginLeft: 20 }}>{item.subCategories.map((subItem) => renderCategory(subItem))}</View>
      )}
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Wishlist')}
        style={{ paddingVertical: 10, marginBottom: 20 }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Danh sách yêu thích</Text>
      </TouchableOpacity>
      {category.map((item, index) => {
        const isExpanded = expandedCategories[item.id] || false;
        return (
          <View key={item.id + index} style={{ marginBottom: 10 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProductList', { name: item.name, category: item.subCategories || [] })}
                style={{ paddingVertical: 10 }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
              {item.subCategories && item.subCategories.length > 0 && (
                <TouchableOpacity onPress={() => toggleSubMenu(item.id)} style={{ padding: 10, flexGrow: 1 }}>
                  <Icon style={{ textAlign: 'right' }} name={isExpanded ? 'expand-less' : 'expand-more'} size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            {isExpanded && (
              <Animated.View style={{ paddingLeft: 20 }}>
                {item.subCategories.map((subItem) => renderCategory(subItem))}
              </Animated.View>
            )}
          </View>
        );
      })}
    </View>
  );
}

CustomDrawer.propTypes = {
  navigation: PropTypes.object.isRequired,
};