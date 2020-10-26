import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import axios from 'axios';


export default function Place() {

    const history = useHistory();
    const params = useParams();

    return (
        <div className="app">
            <Header isClickable={true} />
            <div>
                Place {params.id}
            </div>
        </div>
    );
}