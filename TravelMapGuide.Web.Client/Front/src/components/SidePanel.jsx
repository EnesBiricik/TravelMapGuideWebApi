import React from 'react'

export const SidePanel = ({ children, onClose }) => {
    return (
        <div style={styles.mainContainer}>
            <button onClick={onClose} style={styles.closeButton}> ▶ </button>
            <div style={styles.container}>
                {children}
            </div>
        </div>
    )
}

const styles = {
    mainContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        top: 0,
        right: '1rem',
        position: 'fixed',
        width: '20%',
    },
    container: {
        width: '100%',
        height: '90%',
        backgroundColor: '#1a1a1a',
        boxShadow: 'rgba(0, 0, 0, 1) 0px 52px 152px',
        padding: '0px',
        boxSizing: 'border-box',
        zIndex: 1000,
        overflowY: 'auto',
        transition: 'transform 0.3s ease-in-out',
        transform: 'translateX(0)',
        borderRadius: '1rem',
        color: '#fff',
    },
    closeButton: {
        position: 'fixed',
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: 'white',
        backgroundColor: 'rgb(26, 26, 26)',
        right: 'calc(20% + 1rem)',
        borderRadius: '1rem 0 0 1rem',
        padding: '2rem 1rem',
        zIndex: '10000',
        borderRight: '1px solid white',
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: '1rem',
        marginBottom: '20px',
    },
    title: {
        color: '#ffc107',
        fontFamily: "'Playfair Display', serif",
        fontSize: '2rem',
        marginBottom: '10px',
    },
    underline: {
        borderBottom: '1px solid #ffc107',
        marginBottom: '20px',
    },
};

export default SidePanel