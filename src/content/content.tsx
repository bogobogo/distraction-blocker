import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { DISTRACTING_SITES_KEY } from "../consts";


function App() {
    const [isDistractingTab, setIsDistractingTab] = useState(false)
    useEffect(() => {
        chrome.storage.sync.get([DISTRACTING_SITES_KEY], (storageObj) => {
            console.log(storageObj)
                const isDistracting = storageObj[DISTRACTING_SITES_KEY].some(distractingUrl => location.href.includes(distractingUrl))
                if (isDistracting) {
                    document.body.innerHTML = 'BAD GIRL NOT HERE GO WORK'
                }
        })
    }, [])

    return (
        <>
        {isDistractingTab && <div
                style={{
                    position: "fixed",
                    width: '20%',
                    height: '20%',
                    top: '40%',
                    left: '40%',
                    zIndex: 999999999,
                }}
            >
                <h1>HELOOOOOO</h1>
            </div>}
            
        </>
    );
}

const root = document.createElement("div");
root.id = "distractions";

document.body.appendChild(root);

ReactDOM.render(<App/>, document.getElementById("distractions"));
