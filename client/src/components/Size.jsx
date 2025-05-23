import React, { useEffect, useState } from 'react';
import './Size.css';
import api from '../axiosConfig';
import AddSizeForm from './AddSizeForm';

const Size = ({ isSizeFormOpen, setIsSizeFormOpen, allSize, setAllSize, getAllSize }) => {
    // const [allSize, setAllSize] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        isOpen && getAllSize();
    }, [isOpen])

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    async function getAllSize() {
        try {
            const response = await api.get('/size');
            console.log('Sizes:', response.data);
            setAllSize(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function handleDeleteSize(id) {
        try {
            const response = await api.delete(`/size/id/${id}`);
            console.log('Size deleted:', response.data);
            getAllSize();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <div className="dropdown-container">
                <div className="dropdown-header" onClick={handleToggle}>
                    {isOpen ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                    Available Sizes
                    <i className="bi bi-plus-circle add-size" onClick={() => setIsSizeFormOpen(true)}></i>
                    {/* <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9662;</span> */}
                </div>
                {isOpen && (
                    <ul className="dropdown-list">
                        {allSize.map((size, index) => (
                            <li key={index}>
                                <span style={{ width: '20px' }}>{size.shortName}</span>
                                <span style={{ width: '100px' }}>{size.name}</span>
                                <i className="bi bi-trash" onClick={() => handleDeleteSize(size._id)}></i>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default Size;