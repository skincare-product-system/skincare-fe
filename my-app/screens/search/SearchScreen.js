import Entypo from '@expo/vector-icons/Entypo'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, TextInput, Text, ActivityIndicator } from 'react-native'

import brandApi from '../../src/apis/brands.api'
import categoryApi from '../../src/apis/categories.api'

export default function SearchScreen() {
  const nav = useNavigation()
  const inputRef = useRef(null)
  const [brands, setBrands] = useState([])
  const [cates, setCates] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  const getLeafCategories = (categories) => {
    let leafCategories = []
    const findLeaves = (subCategories) => {
      subCategories.forEach((category) => {
        if (category.subCate && Array.isArray(category.subCate) && category.subCate.length > 0) {
          findLeaves(category.subCate)
        } else {
          leafCategories.push(category)
        }
      })
    }
    findLeaves(categories)
    return leafCategories
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandResponse, categoryResponse] = await Promise.all([
          brandApi.getAllBrands(),
          categoryApi.getCategories()
        ])

        const brands = brandResponse.data.result.slice(0, 10)
        const leafCategories = getLeafCategories(categoryResponse.data.result).slice(0, 10)

        setBrands(brands)
        setCates(leafCategories)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // useEffect(() => {
  //   const getBrands = async () => {
  //     const response = await brandApi.getAllBrands()
  //     const brands = response.data.result.slice(0, 10)
  //     setBrands(brands)
  //   }
  //   getBrands()
  // }, [])

  // const getLeafCategories = (categories) => {
  //   let leafCategories = []
  //   const findLeaves = (subCategories) => {
  //     subCategories.forEach((category) => {
  //       if (category.subCate && Array.isArray(category.subCate) && category.subCate.length > 0) {
  //         findLeaves(category.subCate)
  //       } else {
  //         leafCategories.push(category)
  //       }
  //     })
  //   }
  //   findLeaves(categories)
  //   return leafCategories
  // }

  // useEffect(() => {
  //   const getSubCates = async () => {
  //     const response = await categoryApi.getCategories()
  //     const leafCategories = getLeafCategories(response.data.result)
  //     setCates(leafCategories.slice(0, 10))
  //   }
  //   getSubCates()
  // }, [])

  const handleChooseCategory = (category) => {
    nav.navigate('ProductList', { subItem: category })
  }

  const handleChooseBrand = (brand) => {
    nav.navigate('ProductList', { brand })
  }
  return (
    // <View style={{ flex: 1, backgroundColor: '#fff' }}>
    //   <View
    //     style={{
    //       flexDirection: 'row',
    //       alignItems: 'center',
    //       paddingHorizontal: 10,
    //       marginTop: 10
    //     }}
    //   >
    //     <TouchableOpacity onPress={() => nav.goBack()} style={{ padding: 5 }}>
    //       <Entypo name='chevron-left' size={30} color='black' />
    //     </TouchableOpacity>

    //     <View style={{ flex: 1, position: 'relative' }}>
    //       <TextInput
    //         value={search}
    //         onChangeText={setSearch}
    //         ref={inputRef}
    //         style={{
    //           borderWidth: 0.5,
    //           borderColor: '#ddd',
    //           paddingVertical: 8,
    //           paddingHorizontal: 12,
    //           paddingRight: 40,
    //           borderRadius: 20,
    //           backgroundColor: '#fafafa',
    //           fontSize: 16
    //         }}
    //         onSubmitEditing={() => nav.navigate('SearchResultScreen', { content: search })}
    //         placeholder='Tìm sản phẩm...'
    //         editable={true}
    //         returnKeyType='search'
    //       />
    //       {/* Icon search */}
    //       <Ionicons
    //         name='search'
    //         size={20}
    //         color='#888'
    //         style={{
    //           position: 'absolute',
    //           right: 12,
    //           top: '50%',
    //           transform: [{ translateY: -10 }]
    //         }}
    //       />
    //     </View>
    //   </View>
    //   <View style={{ padding: 20 }}>
    //     <Text style={{ fontWeight: '600' }}>Xu hướng tìm kiếm</Text>
    //     {/* Danh mục hot */}
    //     <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
    //       {cates.map((item) => (
    //         <TouchableOpacity
    //           key={item._id}
    //           style={{ marginRight: 10, marginBottom: 10 }}
    //           onPress={() => handleChooseCategory(item)}
    //         >
    //           <Text
    //             style={{
    //               fontSize: 12,
    //               paddingVertical: 5,
    //               paddingHorizontal: 10,
    //               backgroundColor: '#EFEFEF',
    //               borderRadius: 30
    //             }}
    //           >
    //             {item.name}
    //           </Text>
    //         </TouchableOpacity>
    //       ))}
    //     </View>
    //   </View>
    //   <View style={{ padding: 20 }}>
    //     <Text style={{ fontWeight: '600' }}>Thương hiệu nổi bật</Text>
    //     <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
    //       {brands.map((brand) => (
    //         <TouchableOpacity
    //           key={brand._id}
    //           style={{ marginRight: 10, marginBottom: 10 }}
    //           onPress={() => handleChooseBrand(brand)}
    //         >
    //           <Text
    //             style={{
    //               fontSize: 12,
    //               paddingVertical: 5,
    //               paddingHorizontal: 10,
    //               backgroundColor: '#EFEFEF',
    //               borderRadius: 30
    //             }}
    //           >
    //             {brand.name}
    //           </Text>
    //         </TouchableOpacity>
    //       ))}
    //     </View>
    //   </View>
    // </View>
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {isLoading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginTop: 10
            }}
          >
            <TouchableOpacity onPress={() => nav.goBack()} style={{ padding: 5 }}>
              <Entypo name='chevron-left' size={30} color='black' />
            </TouchableOpacity>

            <View style={{ flex: 1, position: 'relative' }}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                ref={inputRef}
                style={{
                  borderWidth: 0.5,
                  borderColor: '#ddd',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  paddingRight: 40,
                  borderRadius: 20,
                  backgroundColor: '#fafafa',
                  fontSize: 16
                }}
                onSubmitEditing={() => nav.navigate('SearchResultScreen', { content: search })}
                placeholder='Tìm sản phẩm...'
                editable={true}
                returnKeyType='search'
              />
              {/* Icon search */}
              <Ionicons
                name='search'
                size={20}
                color='#888'
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: [{ translateY: -10 }]
                }}
              />
            </View>
          </View>
          <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: '600' }}>Xu hướng tìm kiếm</Text>
            {/* Danh mục hot */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
              {cates.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onPress={() => handleChooseCategory(item)}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      backgroundColor: '#EFEFEF',
                      borderRadius: 30
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: '600' }}>Thương hiệu nổi bật</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
              {brands.map((brand) => (
                <TouchableOpacity
                  key={brand._id}
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onPress={() => handleChooseBrand(brand)}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      backgroundColor: '#EFEFEF',
                      borderRadius: 30
                    }}
                  >
                    {brand.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
