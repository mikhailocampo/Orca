import React from 'react';

const ContextMenu = ({ visible, position, onClose, menuItems }) => {
    if (!visible) return null;

    return (
        <div>
            <ul
                className="absolute bg-white list-none p-2 shadow-md cursor-pointer"
                style={{ top: `${position.y}px`, left: `${position.x}px`, zIndex: 50 }}
                onMouseLeave={onClose}
            >
                {menuItems.map((item, index) => (
                    <li key={index} onClick={item.onClick} className='hover:text-blue-500'>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContextMenu;
