import { render } from 'react-dom';
import { useState, StrictMode } from 'react';
import React from 'react';
import axios from 'axios';

// Configurar interceptor de axios para incluir token de sesión
axios.interceptors.request.use(
    config => {
        const sessionToken = localStorage.getItem('session_token');
        if (sessionToken) {
            config.headers['X-Session-Token'] = sessionToken;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de sesión
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.data && 
            error.response.data.msj && 
            error.response.data.msj.includes('Sin sesión activa')) {
            // Limpiar datos de sesión y redirigir al login
            localStorage.removeItem('user_data');
            localStorage.removeItem('session_token');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

import Facturar from "./facturar";
import Login from "./login";
import Notificacion from '../components/notificacion';
import { AppProvider } from '../contexts/AppContext';
import Cargando from '../components/cargando';

function Index() {
    const [loginActive, setLoginActive] = useState(false)
    const [user, setUser] = useState([])
    
    const [msj, setMsj] = useState("")
    const [loading, setLoading] = useState(false)

    // Verificar sesión al cargar la página
    React.useEffect(() => {
        const savedUser = localStorage.getItem('user_data');
        const sessionToken = localStorage.getItem('session_token');
        
        if (savedUser && sessionToken) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                setLoginActive(true);
                
                // Verificar si la sesión sigue siendo válida
                axios.post('/verificarLogin')
                    .then(response => {
                        if (!response.data.estado) {
                            // Sesión expirada, limpiar datos
                            localStorage.removeItem('user_data');
                            localStorage.removeItem('session_token');
                            setLoginActive(false);
                            setUser([]);
                        }
                    })
                    .catch(() => {
                        // Error en verificación, limpiar datos
                        localStorage.removeItem('user_data');
                        localStorage.removeItem('session_token');
                        setLoginActive(false);
                        setUser([]);
                    });
            } catch (error) {
                // Error al parsear datos, limpiar
                localStorage.removeItem('user_data');
                localStorage.removeItem('session_token');
                setLoginActive(false);
                setUser([]);
            }
        }
    }, []);

    const loginRes = res => {
        notificar(res)
        if (res.data) {
            if (res.data.user) {
                // Guardar datos de usuario y token en localStorage
                localStorage.setItem('user_data', JSON.stringify(res.data.user));
                if (res.data.session_token) {
                    localStorage.setItem('session_token', res.data.session_token);
                }
                
                setUser(res.data.user)
                setLoginActive(res.data.estado)
            }
        }
    } 
    const notificar = (msj, fixed = true, simple=false) => {
        if (fixed) {
            setTimeout(() => {
                setMsj("")
            }, 3000)
        }else{
            setTimeout(() => {
                setMsj("")
            }, 100000)
        }
        if (msj == "") {
            setMsj("")
        } else {
            if (msj.data) {
                if (msj.data.msj) {
                    setMsj(msj.data.msj)

                } else {

                    setMsj(JSON.stringify(msj.data))
                }
            }else if(typeof msj === 'string' || msj instanceof String){
                setMsj(msj)
            }

        }
    }


    return(
        <StrictMode>
            <AppProvider>
                <Cargando active={loading} />

                {msj != "" ? <Notificacion msj={msj} notificar={notificar} /> : null}

                {loginActive&&user?<Facturar 
                    setLoading={setLoading}
                    user={user}
                    notificar={notificar}
                />:<Login 
                    loginRes={loginRes} 
                />}
            </AppProvider>
        </StrictMode>
    )    
}

render(<Index />, document.getElementById('app'));
