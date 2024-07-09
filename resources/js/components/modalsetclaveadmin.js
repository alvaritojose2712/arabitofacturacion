import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function Modalsetclaveadmin({
    inputsetclaveadminref,
    valinputsetclaveadmin,
    setvalinputsetclaveadmin,
    closemodalsetclave,
    sendClavemodal,
    typingTimeout,
    setTypingTimeout,
}){
    useEffect(()=>{
        if (inputsetclaveadminref.current) {
            inputsetclaveadminref.current.focus()
        }
    },[])
    

    const removeInput = () => {

        if (typingTimeout != 0) {
            clearTimeout(typingTimeout);
        }

        let time = window.setTimeout(() => {
            setvalinputsetclaveadmin("")
            console.log("clean input")
        }, 500);
        setTypingTimeout(time);
    }


    useHotkeys(
        "esc",
        (event) => {
            closemodalsetclave()
        },
        {
            filterPreventDefault: false,
            enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
        },
        []
    );

    return (
        <>
            <section className="modal-custom">
                <div className="modal-content-supersm shadow">
                    <form onSubmit={e=>{e.preventDefault();sendClavemodal()}}>
                        <input onPaste={(e) => {
                        e.preventDefault();
                        return false;
                        }}
                        onCopy={(e) => {
                        e.preventDefault();
                        return false;
                        }} type="password" className="form-control fs-3" ref={inputsetclaveadminref} value={valinputsetclaveadmin} onChange={e=>{setvalinputsetclaveadmin(e.target.value);removeInput()}}  autoComplete="nope"/>

                    </form>
                </div>
            </section>
            <div className="overlay"></div>
        </>
    )
}