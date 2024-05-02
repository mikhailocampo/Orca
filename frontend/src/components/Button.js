import React from 'react';

const Button = ({ onClick, label, className }) => {
    return (
        <button onClick={onClick} className={`py-2 px-4 rounded text-white bg-blue-500 ${className}`}>
            {label}
        </button>
    );
}

export default Button;