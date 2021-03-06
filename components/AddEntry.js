import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {getMetricMetaInfo, timeToString} from '../utils/helpers';
import SuperFitSlider from './SuperFitSlider';
import SuperFitSteppers from './SuperFitSteppers';
import DateHeader from './DateHeader';
import {Ionicons} from '@expo/vector-icons';
import TextButton from './TextButton';
import {submitEntry, removeEntry} from '../utils/api';

function SubmitBtn({onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>SUBMIT</Text>

    </TouchableOpacity>
  );
}

export default class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  };

  increment = metric => {
    const {max, Step} = getMetricMetaInfo (metric);
    this.setState (state => {
      const count = state[metric] + step;

      return {
        ...state,
        [metric]: count > max ? max : count,
      };
    });
  };

  decrement = metric => {
    this.setState (state => {
      const count = state[metric] - getMetricMetaInfo (metric).step;

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      };
    });
  };
  slide = (metric, value) => {
    this.setState (() => ({
      [metric]: value,
    }));
  };
  submit = () => {
    const key = timeToString ();
    const entry = this.state;

    // Update Redux

    this.setState (() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }));

    // Navigate to home

    submitEntry ({key, entry});

    // Clear local notifications
  };
  reset = () => {
    const key = timeToString ();

    // Update Redux

    // Route to home
    removeEntry (key);
  };

  render () {
    const metaInfo = getMetricMetaInfo ();

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name="ios-happy-outline" size={100} />
          <Text>You already logged your info for the day.</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      );
    }
    return (
      <View>
        <DateHeader date={new Date ().toLocaleDateString ()} />
        {Object.keys (metaInfo).map (key => {
          const {getIcon, type, ...rest} = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key}>
              {getIcon ()}
              {type === 'slider'
                ? <SuperFitSlider
                    value={value}
                    onChange={value => this.slide (key, value)}
                    {...rest}
                  />
                : <SuperFitSteppers
                    value={value}
                    onIncrement={() => this.increment (key)}
                    onDecrement={() => this.decrement (key)}
                    {...rest}
                  />}
            </View>
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}
