import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Provider from './Provider/index.jsx';
import GlobalStyle from './components/GlobalStyle';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider>
            <GlobalStyle>
                <App />
            </GlobalStyle>
        </Provider>
    </React.StrictMode>,
);
