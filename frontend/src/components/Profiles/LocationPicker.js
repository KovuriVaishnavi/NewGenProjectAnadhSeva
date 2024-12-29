import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

// Define the custom icon
const customIcon = L.icon({
    iconUrl: 'https://png.pngtree.com/png-clipart/20230419/ourlarge/pngtree-3d-pin-map-location-icon-transparent-psd-png-image_6713919.png', // Provided URL
    iconSize: [40, 40], // Adjust the size to your preference
    iconAnchor: [20, 40], // Center bottom point of the icon
    popupAnchor: [0, -40], // Popup opens above the icon
});

const LocationPicker = ({ onLocationSelect }) => {
    const [showModal, setShowModal] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [address, setAddress] = useState('');

    const [currentLocation, setCurrentLocation] = useState([51.505, -0.09]); // Default location (fallback to London)

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    const handleShow = () => setShowModal(true);

    const handleClose = () => {
        setShowModal(false);
        setLatitude(null);
        setLongitude(null);
        setAddress('');
    };

    const fetchCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation([latitude, longitude]);
                    setLatitude(latitude);
                    setLongitude(longitude);
                    fetchAddress(latitude, longitude);
                },
                (error) => {
                    console.error('Error fetching location:', error);
                    alert('Unable to fetch your location. Defaulting to a generic location.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const fetchAddress = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            setAddress(response.data.display_name || 'Address not found');
        } catch (error) {
            console.error('Error fetching address:', error);
            setAddress('Unable to fetch address');
        }
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                setLatitude(lat);
                setLongitude(lng);
                fetchAddress(lat, lng);
            },
        });
        return null;
    };

    const handleSaveLocation = () => {
        if (latitude && longitude && address) {
            // Pass the selected data to the parent via the callback
            onLocationSelect({ address, latitude, longitude });
            handleClose();
        } else {
            alert('Please select a location on the map.');
        }
    };

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                Pick Location
            </Button>

            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Select Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MapContainer
                        center={currentLocation}
                        zoom={13}
                        style={{ height: '400px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        <MapClickHandler />
                        {latitude && longitude && (
                            <Marker position={[latitude, longitude]} icon={customIcon} />
                        )}
                    </MapContainer>
                    <div style={{ marginTop: '20px' }}>
                        <strong>Selected Address:</strong> {address || 'No location selected'}
                        <br />
                        <strong>Latitude:</strong> {latitude || 'N/A'}
                        <br />
                        <strong>Longitude:</strong> {longitude || 'N/A'}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleSaveLocation}>
                        Save Location
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default LocationPicker;
