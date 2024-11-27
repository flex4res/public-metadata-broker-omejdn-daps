import React, {Component} from 'react';

class IconComponent extends Component {
  render() {
    
    const number = this.props.number || 0;
    const color = this.props.color || '#d2d3d4';
    
    return (
      <strong style={{ color: color }}>{number}</strong>
    );
  }
}

export default IconComponent;
