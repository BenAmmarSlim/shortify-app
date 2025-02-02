import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {ChakraProvider, ColorModeProvider, CSSReset, theme, ThemeProvider} from '@chakra-ui/react';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';

const serverBaseUrl = import.meta.env.VITE_APP_URI;
axios.defaults.baseURL = serverBaseUrl;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <ColorModeProvider>
                        <CSSReset/>
                        <App/>
                    </ColorModeProvider>
                </ThemeProvider>
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>
);