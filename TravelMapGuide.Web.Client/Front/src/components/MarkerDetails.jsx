import React from 'react';

const MarkerDetails = ({ markerData, onClose }) => {
    if (!markerData) return null;

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= markerData.starReview ? '#ffc107' : '#e4e5e9' }}>
                    &#9733;
                </span>
            );
        }
        return stars;
    };

    return (
        <div style={styles.container}>
            <button onClick={onClose} style={styles.closeButton}>X</button>
            {markerData.imageUrl && (
                <img
                    src={`http://localhost:7018/img/${markerData.imageUrl}`} // URL'yi tamamlayın
                    alt={markerData.name}
                    style={{ width: '100%', height: 'auto' }} // Stil ayarları
                />
            )}
            <h1 style={styles.title}>{markerData.name}</h1>
            <div style={styles.underline}></div>
            <p><strong>Description:</strong> {markerData.description}</p>
            <p><strong>Star Review:</strong> {renderStars()}</p>
            <p><strong>Cost:</strong> ${markerData.cost}</p>
            <p><strong>Latitude:</strong> {markerData.latitude}</p>
            <p><strong>Longitude:</strong> {markerData.longitude}</p>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '30%', // Daha geniş bir alan sağlanabilir
        height: '100%',
        backgroundColor: '#1a1a1a',
        borderLeft: '1px solid #ffc107',
        padding: '20px',
        boxSizing: 'border-box',
        zIndex: 1000,
        overflowY: 'auto',
        transition: 'transform 0.3s ease-in-out',
        transform: 'translateX(0)',
        borderRadius: '.2rem',
        color: '#ffc107',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#ffc107',
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

export default MarkerDetails;
