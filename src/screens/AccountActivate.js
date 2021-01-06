import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

import Spinner from '../components/LoaderSpinner/Spinner';


export default function AccountActivate() {
    const history = useHistory();
    const { uid, token } = useParams();
    const [messages, setMessages] = useState("");

    useEffect(() => {        
        handleActivation();
    }, []);

    const handleActivation = async () => {
        setMessages("");

        await axios.get("/authentication/activate/" + uid + "/" + token + "/", {
            withCredentials: true
        }).then(() => {
            history.push("/");
        }).catch((error) => {
            switch(error.response.status) {
                case 400: history.push("/notfound/"); break;
                case 404: history.push("/notfound/"); break;
                case 500: setMessages(error.response.statusText); break;
                default: ;
            }
        });
    }

    return (
        <div className="auth">
            <Spinner />
            {messages &&
                <div className="auth-error">
                    {messages}
                </div>
            }
        </div>
    )
}