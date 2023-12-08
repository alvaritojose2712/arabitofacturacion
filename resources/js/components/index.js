import { render } from 'react-dom';
import { useState, StrictMode } from 'react';

import Facturar from "./facturar";
import Login from "./login";
import Notificacion from '../components/notificacion';
import Cargando from '../components/cargando';

function Index() {
    const [loginActive, setLoginActive] = useState(false)
    const [user, setUser] = useState([])
    
    const [msj, setMsj] = useState("")
    const [loading, setLoading] = useState(false)

    const loginRes = res => {
        notificar(res)
        if (res.data) {
            

            if (res.data.user) {
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
            <Cargando active={loading} />

            {msj != "" ? <Notificacion msj={msj} notificar={notificar} /> : null}

            {loginActive&&user?<Facturar 
                setLoading={setLoading}
                user={user}
                notificar={notificar}
            />:<Login 
                loginRes={loginRes} 
            />}
        </StrictMode>
    )    
}

render(<Index />, document.getElementById('app'));
