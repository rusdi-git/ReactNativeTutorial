import React, {Component} from 'react';
import {
    View,
    Animated,
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import { Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH*0.25;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
    static defaultProps = {
        onSwipeRight: ()=>{},
        onSwipeLeft: ()=>{},
    }

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
        this.state = {panResponder,position,index:0};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps!==this.props.data){
            this.setState({index:0});
        }
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    forceSwipe(dx) {
        const direction = dx <0?-1:1;
        Animated.timing(this.state.position,
            {toValue:{x:SCREEN_WIDTH*direction,y:0},
            duration: SWIPE_OUT_DURATION,
        }).start(()=>this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction) {
        const {onSwipeLeft,onSwipeRight,data} = this.props;
        const item = data[this.state.index];
        direction === 1? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({x:0,y:0});
        this.setState({index:this.state.index+1});
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
        if (this.state.index>=this.props.data.length) {
            return this.props.renderNoMoreCards()
        }
        else {
            return this.props.data.map((item,i)=>{
                if (i==this.state.index){
                 return (
                     <Animated.View
                     key={item.id}
                     style={[this.getCardStyle(),styles.cardStyle]}
                    {...this.state.panResponder.panHandlers}
    
                     >
                         {this.props.renderCard(item)}
                     </Animated.View>
                 )   
                }
                else if (i>this.state.index){
                    return (
                        <Animated.View 
                            key={item.id}
                            style={[styles.cardStyle,{top:10*(i-this.state.index)}]}
                            >
                            {this.props.renderCard(item)}
                        </Animated.View>
                        );
                }
            }).reverse();
        }
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle: {
        marginTop:30,
        position: 'absolute',
        zIndex:0,
        width: SCREEN_WIDTH,
    },
}

export default Deck;