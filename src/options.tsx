import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DAILY_FOCUSED_DURATION_PREFERENCE_KEY, DEFAULT_DISTRACTING_SITES, DISTRACTING_SITES_KEY } from "./consts";

function App() {
  const [distractingSites, setDistractingSites] = useState(undefined);
  const [distractingSiteInput, setDistractingSiteInput] = useState("");
  const [focusedTime, setFocusedTime] = useState(0)
  const [focusedTimeInput, setFocusedTimeInput] = useState("")
  const [focusedTimeInputErrorVisible, setFocusedTimeInputErrorVisible] = useState(false)
  
  useEffect(() => {
    chrome.storage.sync.get([DISTRACTING_SITES_KEY, DAILY_FOCUSED_DURATION_PREFERENCE_KEY], (result) => {
      if (Object.keys(result).length === 0) {
        chrome.storage.sync.set({
          isDefault: false,
          [DISTRACTING_SITES_KEY]: DEFAULT_DISTRACTING_SITES,
          [DAILY_FOCUSED_DURATION_PREFERENCE_KEY]: 0
        }, () => console.log('done saving'));
        setDistractingSites(DEFAULT_DISTRACTING_SITES);
      } else {
        setDistractingSites(result[DISTRACTING_SITES_KEY]);
        setFocusedTime(result[DAILY_FOCUSED_DURATION_PREFERENCE_KEY])
      }
    });
  }, []);

  const removeSite = (siteToRemove) => {
    const newDistractingSites = distractingSites.filter(
      (site) => site !== siteToRemove
    );
    chrome.storage.sync.set({
      isDefault: false,
      [DISTRACTING_SITES_KEY]: newDistractingSites,
    }, () => console.log('done saving'));
    setDistractingSites(newDistractingSites);
  };

  const addSite = () => {
    const newDistractingSites = [...distractingSites, distractingSiteInput];
    chrome.storage.sync.set({
      isDefault: false,
      [DISTRACTING_SITES_KEY]: newDistractingSites,
    }, () => console.log('done saving'));
    setDistractingSites(newDistractingSites);
    setDistractingSiteInput('')
  };

  const updateFocusedTime = () => {
    const focusedTime = Number(focusedTimeInput)
    if (Number.isNaN(focusedTime)) {
      setFocusedTimeInputErrorVisible(true)
    } else {
      chrome.storage.sync.set({
        [DAILY_FOCUSED_DURATION_PREFERENCE_KEY]: focusedTime,
      }, () => console.log('done saving'));
      setFocusedTime(focusedTime);
      setFocusedTimeInput('')
      setFocusedTimeInputErrorVisible(false)
    }
  }
  
  const handleInputChange = (event) => {
    setDistractingSiteInput(event.target.value);
  };

  const handleFocusedTimeInputChange = (event) => {
    setFocusedTimeInput(event.target.value);
  }

  return (
    <>
      <h1>My Distracting Sites</h1>
      <input
        type="text"
        placeholder={"Add distracting site"}
        value={distractingSiteInput}
        onChange={handleInputChange}
      />
      <button onClick={addSite}>Add site</button>
      <ul>
        {distractingSites &&
          distractingSites.map((site) => {
            return (
              <>
                <li key={site}>{site}</li>
                <button onClick={() => removeSite(site)}>Remove</button>
              </>
            );
          })}
      </ul>
        <h1>Focused Time a Day: {focusedTime ? `${focusedTime} hours` : `All day`}</h1>
        <p>We start counting from your first daily interaction with the web.</p> 
      <input
        type="text"
        placeholder="9"
        value={focusedTimeInput}
        onChange={handleFocusedTimeInputChange}
      />
      <button onClick={updateFocusedTime}>Set Daily Focused Time</button>
      {focusedTimeInputErrorVisible && <p>Looks like the input is invalid. Make sure it is a number!</p>}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
