import React, { Component } from 'react';

import './slider.css';


export default class Slider extends Component {

	constructor(props) {
		this.state = {
			index: 0
		};
	}

	goNext() {
		let { index } = this.state;
		let length = this.props.elements.length;

		this.setState({ index: ((index === length - 1) ? 0 : (index + 1)) });
	}

	goBack() {
		let { index } = this.state;
		let length = this.props.elements.length;

		this.setState({ index: ((index === 0) ? (length - 1) : (index - 1)) });
	}

	render() {
		let { index } = this.state;

		return (
	        <div className="slider">
                <div className="slide">
                	<div className="go-back" onClick={() => this.goBack()} />
                	<img src={`data:image/jpeg;base64,${this.props.elements[index]}`} draggable="false" />
                	<div className="go-next" onClick={() => this.goNext()} />
                </div>
	        </div>
	    );
	}
}