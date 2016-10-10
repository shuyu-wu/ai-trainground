
import React, { Component } from 'react';

class Cell extends Component {

  _renderDirections(params){

    const {
      style,
      utility,
    } = params;

    if(!utility) { return null; }

    const {
      left, right, top, bottom
    } = utility;

    const baseStyle = {
      position: 'absolute',
      display: 'flex',
      fontSize: '12px',
      justifyContent: 'center',
      alignItems: 'center',
      lineHeight: '12px',
    };

    return (
      <div
        className={'crossed'}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          ...style
        }}
      >

        <div style={{
          ...baseStyle,
          top: '1px',
          left: '0px',
          width: '100%',
        }}>
          {top}
        </div>

        <div style={{
          ...baseStyle,
          bottom: '0px',
          left: '0px',
          width: '100%',
        }}>
          {bottom}
        </div>

        <div style={{
          ...baseStyle,
          bottom: '0px',
          left: '0px',
          height: '100%',
        }}>
          {left}
        </div>

        <div style={{
          ...baseStyle,
          bottom: '0px',
          right: '0px',
          height: '100%',
        }}>
          {right}
        </div>

      </div>
    );
  }

  render(){

    const {
      color,
      style,
      // text,
      children,
      crossed,
      utility,
    } = this.props;

    return this._renderDirections({
      style,
      utility,
    });

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          ...style
        }}
      >
        {this.props.children}
      </div>
    );

  }
}

export default Cell;