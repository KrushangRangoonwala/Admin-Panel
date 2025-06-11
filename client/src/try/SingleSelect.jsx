import React, { useState, useRef, useEffect } from 'react';
import './SingleSelect.css';

export default function SingleSelect({ optionsData, selected, setSelected, fieldName, onChange }) {
    const [isOpen, setIsOpen] = useState(false); // Dropdown open state
    const [searchTerm, setSearchTerm] = useState(''); // User's search input
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
    };

    // On transition end, finalize the close
    const handleTransitionEnd = () => {
        if (isAnimating) {
            setIsOpen(false);
            setIsAnimating(false);
        }
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((isOpen || isAnimating) && containerRef.current && !containerRef.current.contains(event.target)) {
                setIsAnimating(true);
                setPopupHeight(`${popupRef.current.scrollHeight}px`);
                requestAnimationFrame(() => {
                    setPopupHeight('0px');
                });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isAnimating]);

    // Handle selecting an option
    const handleSelect = (option) => {
        console.log("handleSelect.......", option);
        onChange(option); // Call onChange prop with selected option
        // setSelected(option); // Set single selected option
        // setSearchTerm(option); // Update input with selected option's name
        setIsAnimating(true);
        setTimeout(() => {
            handleTransitionEnd();
        }, 300);
        setPopupHeight(`${popupRef.current.scrollHeight}px`);
        requestAnimationFrame(() => {
            setPopupHeight('0px'); // Close dropdown
        });
    };

    // Filter options based on search term
    useEffect(() => {
        setFilteredOpt(optionsData);
    }, [optionsData]);
    // }, [optionsData, searchTerm]);

    // Recalculate height when options list changes
    useEffect(() => {
        if (isOpen) setPopupHeight(`${popupRef.current.scrollHeight}px`);
    }, [filteredOpt, isOpen]);

    return (
        <div className="animated-select-container" ref={containerRef}>
            <div className="search-bar">
                <i class="bi bi-search search-icon"></i>
                <input
                    style={{ boxSizing: 'border-box', outline: selected.length > 0 ? "3px solid #00aaff" : null }}
                    className="form-control"
                    type="text"
                    placeholder={`Search ${fieldName}...`}
                    onFocus={toggleDropdown}
                    onChange={(e) => {
                        onChange(e.target.value); // Call onChange prop with search term
                        // setSearchTerm(e.target.value)
                    }}
                    value={selected || ''} // Controlled input
                    onClick={toggleDropdown} // Open dropdown on click
                    onBlur={() => {
                        if (!isOpen) {
                            setIsAnimating(true);
                            setPopupHeight('0px');
                        }
                    }}
                />
            </div>

            {/* Dropdown container with animation */}
            <div
                className="dropdown-wrapper"
                style={{ maxHeight: popupHeight, zIndex: 999 }}
                ref={popupRef}
                onTransitionEnd={handleTransitionEnd}
            >
                {(isOpen || isAnimating) && (
                    <div className="dropdown-content">
                        <ul>
                            {filteredOpt.map((opt, idx) => (
                                <li key={idx} onClick={() => handleSelect(opt)}>
                                    {opt}
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