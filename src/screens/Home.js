import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../components/Header/Header';
import Spinner from '../components/LoaderSpinner/Spinner';


export default function Home() {
    const history = useHistory();
    const [messages, setMessages] = useState("");
    const [isLoading, setLoading] = useState(false);

    return (
        <div className="app">
            {isLoading && <Spinner />}
            <Header isClickable={false} />
            <div>
                {messages}
            </div>
        </div>
    );
}