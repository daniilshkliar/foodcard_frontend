import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import axios from 'axios';

import '../place.css'

import place from '../place.json';


export default function Place() {

    const history = useHistory();
    const params = useParams();

    return (
        <div className="app">
            <Header isClickable={true} />
            <div className="main">
                <div className="place-photos">
                    <div className="place-photo-container-1">
                        <div><img src={place.place.photos[0]} alt="Photo" draggable="false" className="place-photo" /></div>
                        <div><img src={place.place.photos[1]} alt="Photo" draggable="false" className="place-photo" /></div>
                    </div>
                    <div className="place-photo-container-2">
                        <div><img src={place.place.photos[2]} alt="Photo" draggable="false" className="place-photo" /></div>
                    </div>
                    <div className="place-photo-container-0">
                        <div><img src={place.place.photos[3]} alt="Photo" draggable="false" className="place-photo" /></div>
                    </div>
                    <div className="place-photo-container-3">
                        <div className="place-photo-container-4">
                            <div><img src={place.place.photos[4]} alt="Photo" draggable="false" className="place-photo" /></div>
                        </div>
                        <div className="place-photo-container-5">
                            <div><img src={place.place.photos[5]} alt="Photo" draggable="false" className="place-photo" /></div>
                            <div><img src={place.place.photos[6]} alt="Photo" draggable="false" className="place-photo" /></div>
                        </div>
                    </div>
                </div>
                <div className="place-window">
                    <div className="place-desription">
                            {place.place.description}
                    </div>
                </div>
            </div>
        </div>
    );
}