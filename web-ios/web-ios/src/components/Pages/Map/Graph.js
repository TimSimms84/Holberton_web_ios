import React, { Component } from 'react';
import { coordinatePath } from '../../TopBar/Informers';

export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      x: props.x,
      y: props.y,

    };
    this.width = 400;
    this.height = 250;
    this.tick_width = 6;
    this.tick_spacing = this.height / 20;
  }

  drawPreviousPath() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#F542A7';
    for(let i = 2; i < coordinatePath.length; i++) {
      console.log(i);
      ctx.beginPath();
      ctx.arc(this.width/2 + coordinatePath[i].x, this.height/2 - coordinatePath[i].y, 0.5, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.x === prevProps.x && this.props.y === prevProps.y) {
      return;
    }
    if (this.state.x === 0 && this.state.y === 0) {
      this.setState({x: this.props.x, y: this.props.y});
      return;
    }
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = '#F542A7';
    ctx.arc(this.width/2 + this.state.x, this.height/2 - this.state.y, 0.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.stroke();
    this.setState({x: this.props.x, y: this.props.y});
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'green';
    ctx.moveTo(this.width / 2, this.height);
    ctx.lineTo(this.width / 2, 0);
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.stroke();
    
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      if (i === 0 || i === 10) {
        continue;
      }
      ctx.moveTo(this.width / 2 - this.tick_width, this.height - this.tick_spacing*i);
      ctx.lineTo(this.width / 2 + this.tick_width, this.height - this.tick_spacing*i);
      ctx.stroke();
    }
    for (let i = 0; i < 32; i++) {
      ctx.beginPath()
      if (i === 0 || i === 16) {
        continue;
      }
      ctx.moveTo(0 + this.tick_spacing*i, this.height/2 - this.tick_width);
      ctx.lineTo(0 + this.tick_spacing*i, this.height/2 + this.tick_width);
      ctx.stroke();
    }
    this.drawPreviousPath();
   
  }
  render() {
    return <canvas className='Graph' ref={this.canvasRef} width={this.width} height={this.height} ></canvas>;
  }
}
