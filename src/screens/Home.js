import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header/Header';
import Spinner from '../components/LoaderSpinner/Spinner';
import axiosApiInstance from '../services/TokenWrap';


export default function Home() {

    const history = useHistory();
    const [messages, setMessages] = useState("");
    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            const data = await axiosApiInstance.get("http://127.0.0.1:8000/api/isit/", {});
            setMessages(data.data.response);
        };

        fetchData();
        setLoading(false);
    }, []);


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