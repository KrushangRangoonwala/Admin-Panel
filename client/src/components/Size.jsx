// Size.jsx
import React, { useEffect, useState } from 'react';
import './Size.css';
import api from '../axiosConfig';
import AddSizeForm from './AddSizeForm';

const Size = ({ isSizeFormOpen, setIsSizeFormOpen, allSize, setAllSize, getAllSize }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        isOpen && getAllSize();
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    async function handleDeleteSize(id) {
        try {
            await api.delete(`/size/id/${id}`);
            getAllSize();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <div className="size-dropdown-container">
                <div className="size-dropdown-header" onClick={handleToggle}>
                    <span className="size-title">Available Sizes</span>
                    <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'} toggle-icon`}></i>
                </div>

                {isOpen && (
                    <>
                        <div className="add-size-wrapper">
                            <button className="add-size-button" onClick={() => setIsSizeFormOpen(true)}>
                                <i className="bi bi-plus-circle"></i> Add Size
                            </button>
                        </div>

                        <ul className="size-dropdown-list">
                            {allSize.map((size, index) => (
                                <li key={index} className="size-item">
                                    <span className="short-name">{size.shortName}</span>
                                    <span className="full-name">{size.name}</span>
                                    <i className="bi bi-trash delete-icon" onClick={() => handleDeleteSize(size._id)}></i>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

        </>
    );
};

export default Size;
