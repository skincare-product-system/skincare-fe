import { Dimensions, Image, StyleSheet, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

const { width } = Dimensions.get('window')

const ImageSlider = ({ images, height }) => {
  return (
    <Carousel
      loop
      autoPlay
      data={images}
      width={width}
      height={height}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <View style={styles.slide}>
          <Image source={{ uri: item }} style={styles.image} />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  slide: {
    width: width,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10
  }
})

export default ImageSlider
