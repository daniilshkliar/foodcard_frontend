import React from 'react';
import Spinner from '../components/LoaderSpinner/Spinner';

import '../notFound.css';


export default function NotFound() {
    return (
        <div className="app">
            <Spinner />
            <div className="not-found-status-code">
               404
            </div>
            <div className="not-found-status">
                Page not found
            </div>
        </div>
    );
}