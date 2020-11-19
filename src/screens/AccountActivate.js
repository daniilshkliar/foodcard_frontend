import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/LoaderSpinner/Spinner';
import axiosApiInstance from '../services/TokenWrap';


export default function AccountActivate() {

    const history = useHistory();
    const { uid, token } = useParams();
    const [messages, setMessages] = useState("");

    
    useEffect(() => {

        const handleActivation = async () => {
            setMessages("");

            try {
                const response = await axios.get("/authentication/activate/" + uid + "/" + token + "/", { withCredentials: true });
                axiosApiInstance.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access;
                localStorage.setItem('access', response.data.access);
                history.push("/");
            } catch(error) {
                switch(error.response.status) {
                    case 400: history.push("/notfound/"); break;
                    case 404: history.push("/notfound/"); break;
                    case 500: setMessages(error.response.statusText); break;
                    default: ;
                }
            }
        }
        
        handleActivation();
    }, []);


    return (
        <div className="auth">
            <Spinner />
            {messages &&
                <div className="auth-error">
                    {messages}
                </div>
            }
        </div>
    );
}