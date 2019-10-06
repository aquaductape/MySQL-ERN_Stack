import React, { useState, useEffect } from 'react';
import Tags from '@yaireo/tagify/dist/react.tagify';
import axios from 'axios';

const InputTags = React.forwardRef(({ placeholder, name, value = [] }, ref) => {
  const [whitelist, setWhitelist] = useState([]);
  const [inputValue, setInputValue] = useState([]);

  const tagifySettings = {
    maxTags: 100,
    enforceWhitelist: true,
    addTagOnBlur: true,
    dropdown: {
      enabled: 1,
      maxItems: 5
    }
  };

  /**** logging dev
  callback(e) {
    console.log(`%c ${e.type}: `, "background: #222; color: #bada55", e.detail);
  }

  // callbacks props (for this demo, the same callback reference is assigned to every event type)
  mapTagifyCallbacks = {
    add: this.callback,
    remove: this.callback,
    input: this.callback,
    edit: this.callback,
    invalid: this.callback,
    click: this.callback
  };
  ****/
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/api/tags');
      const computerLanguages = res.data.itemListElement;
      setWhitelist(computerLanguages);
    };

    fetchData();
  }, []);

  const settings = {
    ...tagifySettings,
    // callbacks: mapTagifyCallbacks,
    whitelist
  };

  if (whitelist.length) {
    setTimeout(() => setInputValue(value), 100);
  }

  // initial value
  const showDropDown = whitelist;
  return (
    <Tags
      mode="textarea"
      settings={settings}
      value={inputValue}
      placeholder={placeholder}
      showDropDown={showDropDown}
      ref={ref}
    ></Tags>
  );
});

export default InputTags;
