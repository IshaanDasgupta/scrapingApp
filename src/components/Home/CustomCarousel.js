import React, {useState, useCallback, useRef} from 'react';
import {Text, View, SafeAreaView, Dimensions} from 'react-native';
import CarosuelCard from './CarosuelCard';

import Carousel, {Pagination} from 'react-native-snap-carousel';

const exampleItems = [
  {
    name: 'Item 1',
    time: 'Text 1',
  },
  {
    name: 'Item 2',
    time: 'Text 2',
  },
  {
    name: 'Item 3',
    time: 'Text 3',
  },
  {
    name: 'Item 4',
    time: 'Text 4',
  },
  {
    name: 'Item 5',
    time: 'Text 5',
  },
];

const CustomCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState(exampleItems);
  const ref = useRef(null);

  const screenWidth = Dimensions.get('window').width;

  const renderItem = useCallback(
    ({item, index}) => <CarosuelCard data={item} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.carousel}>
        <Carousel
          layout="default"
          ref={ref}
          data={carouselItems}
          sliderWidth={screenWidth - 40}
          itemWidth={screenWidth - 100}
          renderItem={renderItem}
          onSnapToItem={index => setActiveIndex(index)}
        />
        <View style={styles.paginationContainer}>
          <Pagination
            dotsLength={carouselItems.length}
            activeDotIndex={activeIndex}
            containerStyle={styles.paginationBg}
            dotStyle={styles.activeDot}
            inactiveDotStyle={styles.inactiveDot}
            // inactiveDotOpacity={0.4}
            // inactiveDotScale={0.6}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    marginBottom: 20,
  },
  carousel: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  paginationContainer: {
    width: '100%',
    justifyContent: 'center',
    alginItems: 'center',
  },
  paginationBg: {
    width: '100%',
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#0082FB',
  },
  inactiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#C4C4C4',
  },
};

export default CustomCarousel;
