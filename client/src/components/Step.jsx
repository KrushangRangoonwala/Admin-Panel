import React, { useRef, useState, useEffect } from "react";
import "./Step.css";


const Step = ({ index, title, description, children, isBoxOpen, setOpenedStep }) => {
    const [isOpen, setIsOpen] = useState(isBoxOpen);
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState("0px");

    const toggleOpen = () => {
        if (!isOpen) {
            // Expanding: measure height and set
            setOpenedStep(index);
            setIsOpen(true);
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            // Collapsing: set fixed height first, then 0
            const currentHeight = `${contentRef.current.scrollHeight}px`;
            setMaxHeight(currentHeight);
            setOpenedStep(null);
            requestAnimationFrame(() => {
                setMaxHeight("0px");  
                setIsOpen(false);
            });
        }
    };

    useEffect(() => {
        if (isBoxOpen) {
            setIsOpen(true);
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setIsOpen(false);
            setMaxHeight("0px");
        }
    }, [isBoxOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setMaxHeight(`${contentRef.current.scrollHeight}px`);
            }, 200);
        } else {
            setTimeout(() => {
                setMaxHeight("0px");
            }, 200);
        }
    }, [isOpen, children]);

    return (
        <div className={`step-card ${isOpen ? "open" : ""}`}>
            <div className="step-header" onClick={toggleOpen}>
                <div className="step-title">
                    <div className="step-index">{String(index).padStart(2, "0")}</div>
                    <div>
                        <strong>{title}</strong>
                        <div className="text-gray-500 text-sm">{description}</div>
                    </div>
                </div>
                <div>{isOpen ? <i class="bi bi-chevron-up"></i> : <i class="bi bi-chevron-down"></i>}</div>
            </div>

            <div
                className="step-content-wrapper"
                ref={contentRef}
                style={{ maxHeight }}
            >
                <div className="step-content-inner">{children}</div>
            </div>
        </div>
    );
};

export default Step