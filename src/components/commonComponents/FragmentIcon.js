/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {StyleSheet, Image, View} from 'react-native';
import HomeIcon from '../../../static/HomeIcon.png';
import FocusedHomeIcon from '../../../static/FocusedHomeIcon.png';
import FavIcon from '../../../static/FavIcon.png';
import FocusedFavIcon from '../../../static/FocusedFavIcon.png';
import TodoIcon from '../../../static/TodoIcon.png';
import FocusedTodoIcon from '../../../static/FocusedTodoIcon.png';
import ProfileIcon from '../../../static/ProfileIcon.png';
import FocusedProfileIcon from '../../../static/FocusedProfileIcon.png';

function FragmentIcon(props) {
  let Icon = HomeIcon;
  if (props.routeName === 'HomeFragment') {
    Icon = props.focused ? FocusedHomeIcon : HomeIcon;
  }
  if (props.routeName === 'BookmarkFragment') {
    Icon = props.focused ? FocusedFavIcon : FavIcon;
  }
  if (props.routeName === 'TodosFragment') {
    Icon = props.focused ? FocusedTodoIcon : TodoIcon;
  }
  if (props.routeName === 'ProfileFragment') {
    Icon = props.focused ? FocusedProfileIcon : ProfileIcon;
  }
  return (
    <View>
      <Image
        source={Icon}
        size={props.size}
        style={{width: props.size, height: props.size}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

export default FragmentIcon;
