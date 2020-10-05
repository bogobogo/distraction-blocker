import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DEFAULT_DISTRACTING_SITES, DISTRACTING_SITES_KEY } from "./consts";

function App() {
  const [distractingSites, setDistractingSites] = useState(undefined);
  const [distractingSiteInput, setDistractingSiteInput] = useState("");
  useEffect(() => {
    chrome.storage.sync.get([DISTRACTING_SITES_KEY], (result) => {
        console.log(result)
      if (Object.keys(result).length === 0) {
        chrome.storage.sync.set({
          isDefault: false,
          [DISTRACTING_SITES_KEY]: DEFAULT_DISTRACTING_SITES,
        }, () => console.log('done saving'));
        setDistractingSites(DEFAULT_DISTRACTING_SITES);
      } else {
        setDistractingSites(result[DISTRACTING_SITES_KEY]);
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

  const handleInputChange = (event) => {
    setDistractingSiteInput(event.target.value);
  };

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
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
