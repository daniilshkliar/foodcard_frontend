import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header/Header';
import axios from 'axios';


export default function Home() {

    const history = useHistory();

    return (
        <div className="app">
            <Header isClickable={false} />
            <div>
                Main
            </div>
        </div>
    );
}