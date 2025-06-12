// AnimatedSelect.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Select.css';


export default function Select({ optionsData, selected, setSelected, fieldName }) {
  const [isOpen, setIsOpen] = useState(false); // Dropdown open state
  const [searchTerm, setSearchTerm] = useState(''); // User's search input
  // const [selected, setSelected] = useState([]); // Selected options
  const popupRef = useRef(null); // Reference to dropdown popup
  const containerRef = useRef(null); // Reference to outer container
  const [popupHeight, setPopupHeight] = useState('0px'); // Animated max-height
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state
  const [filteredOpt, setFilteredOpt] = useState([]);

  // Animate dropdown open/close
  const toggleDropdown = () => {
    if (!isOpen) {
      setIsOpen(true);
      requestAnimationFrame(() => {
        setPopupHeight(`${popupRef.current.scrollHeight}px`);
      });
    }
    // else {
    //   setIsAnimating(true); //  updated line
    //   setPopupHeight(`${popupRef.current.scrollHeight}px`); //  updated line
    //   requestAnimationFrame(() => {
    //     setPopupHeight('0px'); //  updated line
    //   });
    // }
  };

  // On transition end, finalize the close
  const handleTransitionEnd = () => {
    if (isAnimating) {
      setIsOpen(false); //  updated line
      setIsAnimating(false); //  updated line
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((isOpen || isAnimating) && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsAnimating(true); //  updated line
        setPopupHeight(`${popupRef.current.scrollHeight}px`); //  updated line
        requestAnimationFrame(() => {
          setPopupHeight('0px'); //  updated line
        });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isAnimating]); //  updated line

  // Handle selecting an option
  const handleSelect = (option) => {
    setSelected([...selected, option]);
    // setFilteredOpt(filteredOpt.filter((opt) => opt._id !== option._id));
    setSearchTerm('');
  };

  // Handle removing a selected option
  const handleRemove = (option) => {
    setSelected(selected.filter((item) => item._id !== option._id));
  };

  useEffect(() => {
    if (optionsData) {
      // Filter available options based on search term and already selected
      const filteredOptions = optionsData.filter(
        (opt) => (selected.findIndex(selOpt => selOpt._id === opt._id) === -1) && opt.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOpt(filteredOptions);
    }
  }, [optionsData, selected, searchTerm]);

  // Recalculate height when options list changes
  useEffect(() => {
    if (isOpen) setPopupHeight(`${popupRef.current.scrollHeight}px`);
  }, [filteredOpt, isOpen]);

  return (
    <div className="animated-select-container" ref={containerRef}>
      {/* // <div className="" ref={containerRef}> */}
      <div className="selected-chips">
        {selected?.map((opt) => (
          <span key={opt._id} className="chip">
            {opt.name}
            <span onClick={() => handleRemove(opt)} className="remove-btn"><i class="bi bi-x"></i></span>
          </span>
        ))}
      </div>

      {/* Make this input clickable and searchable */}
      <input
        style={{ boxSizing: 'border-box' }}
        className="form-control"
        // className="select-box"
        type="text"
        placeholder={`Search ${fieldName}...`}
        onFocus={toggleDropdown}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />

      {/* Dropdown container with animation */}
      <div
        className="dropdown-wrapper"
        style={{ maxHeight: popupHeight, zIndex: 999 }} //  updated line
        ref={popupRef}
        onTransitionEnd={handleTransitionEnd} //  updated line
      >
        {(isOpen || isAnimating) && ( //  updated line
          <div className="dropdown-content">
            <ul>
              {filteredOpt.map((opt) => (
                <li key={opt._id} onClick={() => handleSelect(opt)}>
                  {opt.name}
                </li>
              ))}
              {filteredOpt.length === 0 && <li className="no-options">No Option Found</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
