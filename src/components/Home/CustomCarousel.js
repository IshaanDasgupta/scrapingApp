import React, {useState, useCallback, useRef, useEffect} from 'react';
import {Text, View, SafeAreaView, Dimensions} from 'react-native';
import CarosuelCard from './CarosuelCard';
import {API} from 'aws-amplify';
import {listEvents} from '../../graphql/queries';

import Carousel, {Pagination} from 'react-native-snap-carousel';

const CustomCarousel = props => {
  const navigation = props.navigation;

  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const ref = useRef(null);

  const screenWidth = Dimensions.get('window').width;

  const renderItem = useCallback(
    ({item, index}) => (
      <CarosuelCard eventData={item} navigation={navigation} />
    ),
    [navigation],
  );

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        let variables = {
          filter: {
            featured: {
              eq: true,
            },
          },
        };
        let codeForcesData;

        const eventData = await API.graphql({
          query: listEvents,
          variables: variables,
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        setCarouselItems(
          eventData.data.listEvents.items
            .filter(data => new Date(data.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date)),
        );

        if (eventData.data.listEvents.items.length <= 3) {
          variables = {
            filter: {
              eventPlatform: {
                eq: 'codeForces',
              },
            },
          };
          codeForcesData = await API.graphql({
            query: listEvents,
            variables: variables,
            authMode: 'AMAZON_COGNITO_USER_POOLS',
          });
          setCarouselItems(prev => [
            ...prev,
            ...codeForcesData.data.listEvents.items
              .filter(data => new Date(data.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date)),
          ]);
        }

        if (
          codeForcesData.data.listEvents.items.length +
            eventData.data.listEvents.items.length <=
          3
        ) {
          variables = {
            filter: {
              eventPlatform: {
                eq: 'codeChef',
              },
            },
          };
          const codeChefData = await API.graphql({
            query: listEvents,
            variables: variables,
            authMode: 'AMAZON_COGNITO_USER_POOLS',
          });
          setCarouselItems(prev => [
            ...prev,
            ...codeChefData.data.listEvents.items
              .filter(data => new Date(data.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date)),
          ]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchFeaturedEvents();
  }, []);

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
