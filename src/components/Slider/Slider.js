import React, { useRef, useEffect } from 'react';

import './slider.css';

import CloseIcon from '../../icons/close_icon.svg';
import ArrowUpIcon from '../../icons/arrow_up_icon.svg';


export default function Slider({
	elements,
	sliderIndex,
	setSliderIndex
	}) {

	const sliderRef = useRef(null);
	const length = elements.length;


	useEffect(() => {
        sliderRef.current.focus();
	}, []);
	

	return (
		<div
			tabIndex="0"
			ref={sliderRef}
			className="slider"
			onKeyDown={e => {
				switch(e.key) {
					case 'Escape': setSliderIndex(-1); break;
					case 'ArrowLeft': setSliderIndex(((sliderIndex === 0) ? (length - 1) : (sliderIndex - 1))); break;
					case 'ArrowRight': setSliderIndex((sliderIndex === length - 1) ? 0 : (sliderIndex + 1)); break;
				}
			}}
		>
			<div className="slide">
				<div className="images-counter">
					{sliderIndex + 1} / {length}
				</div>
				<div
					className="slider-close"
					onClick={() => setSliderIndex(-1)}
				>
					<img src={CloseIcon} alt="Close icon" draggable="false" />
				</div>
				<div className="go-back" onClick={() => setSliderIndex(((sliderIndex === 0) ? (length - 1) : (sliderIndex - 1)))}>
					<img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
				</div>
				<img src={elements[sliderIndex]} draggable="false" />
				<div className="go-next" onClick={() => setSliderIndex((sliderIndex === length - 1) ? 0 : (sliderIndex + 1))}>
					<img src={ArrowUpIcon} alt={"Arrow up icon"} draggable="false" />
				</div>
			</div>
		</div>
	)
}