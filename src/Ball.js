import React, {Component} from 'react';
import {View, Animated} from 'react-native';

class Ball extends Component {
    componentWillMount() {
        this.position = new Animated.ValueXY({x:20,y:50});
        Animated.spring(this.position,
            {toValue: {x:250,y:700}}).start();
    }
    render() {
        return (
            <Animated.View style={this.position.getLayout()}>
                <View style={styles.ball}/>
            </Animated.View>
        );
    }
}

const styles = {
    ball: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 30,
        borderColor: 'black',
    }
}

export default Ball;