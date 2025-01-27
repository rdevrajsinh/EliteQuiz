"use client"
import React, { useEffect, useState } from "react";
import { IoChevronUp } from "react-icons/io5";

const ScrollToTop = () => {
    const [isvisible, setIsvisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsvisible(true);
        } else {
            setIsvisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <div className="scroll-to-top">
            {isvisible && (
                <div onClick={scrollToTop} className="back-top-container">
                    <IoChevronUp />
                </div>
            )}
        </div>
    );
};

export default ScrollToTop;
