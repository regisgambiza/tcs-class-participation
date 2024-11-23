// src/components/QRScanner.js
import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import './styles/QRScanner.css';

function QRScanner({ onScan, stopScanning }) {
    const videoRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startScanning = () => {
            codeReader
                .decodeFromVideoDevice(null, videoRef.current, (result, error) => {
                    if (result) {
                        onScan(result.text);  // Pass the QR code data to the parent component
                        stopScanning();       // Stop scanning after successful scan
                    }
                    if (error) {
                        setErrorMessage(error.message);
                    }
                })
                .catch(err => setErrorMessage(err.message));
        };

        startScanning();

        return () => {
            // Stop scanning on component unmount
            codeReader.reset();
        };
    }, [onScan, stopScanning]);

    return (
    <div className="qr-scanner-container">
        <h3 className="qr-scanner-title">Scan QR Code</h3>
        {errorMessage && <p className="qr-error-message">Error: {errorMessage}</p>}
        <video ref={videoRef} className="qr-video" width="100%" height="auto"></video>
    </div>
);

}

export default QRScanner;
