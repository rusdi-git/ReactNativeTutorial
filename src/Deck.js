import React, {Component} from 'react';
import {
    View,
    Animated,
    PanResponder,
    Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH*0.25;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
    constructor(props) {
        super(props);
        
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder:()=>true,
            onPanResponderMove: (event,gesture)=>{
                position.setValue({x:gesture.dx,y:gesture.dy});
            },
            onPanResponderRelease: (event,gesture)=> {
                if (Math.abs(gesture.dx)>=SWIPE_THRESHOLD){
                    this.forceSwipe(gesture.dx);
                }
                else {
                    this.resetPosition();
                }
            },
        });
        this.state = {panResponder,position};
    }

    forceSwipe(dx) {
        const direction = dx <0?-1:1;
        Animated.timing(this.state.position,
            {toValue:{x:SCREEN_WIDTH*direction,y:0},
            duration: SWIPE_OUT_DURATION,
        }).start(()=>this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction) {
        const {onSwipeLeft,onSwipeRight} = this.props;
    }

    resetPosition() {
        Animated.spring(this.state.position,{toValue:{x:0,y:0}}).start();
    }

    getCardStyle() {
        const {position} = this.state;
        const rotate = position.x.interpolate({
            inputRange:[-SCREEN_WIDTH*1.5,0,SCREEN_WIDTH*1.5],
            outputRange:['-120deg','0deg','120deg']
        });
        return {
            ...position.getLayout(),
            transform: [{rotate:rotate}]
        }
    }

    renderCards() {
        return this.props.data.map((item,index)=>{
            if (index===0){
             return (
                 <Animated.View
                 key={item.id}
                 style={this.getCardStyle()}
                {...this.state.panResponder.panHandlers}

                 >
                    {this.props.renderCard(item)}
                 </Animated.View>
             )   
            }
            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;