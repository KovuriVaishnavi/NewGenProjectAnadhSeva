
import React, { useState } from 'react';
import LocationPicker from './LocationPicker'; // Import the LocationPicker component
import './Profile.css'; // Import the CSS file

const RecieverProfile = () => {
    const [name, setName] = useState('John Doe');
    const [phone, setPhone] = useState('2345678901');
    const [address, setAddress] = useState('123 Main St, City, Country');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isEditing, setIsEditing] = useState({ name: false, phone: false, address: false });
    const [errors, setErrors] = useState({ name: '', phone: '', address: '' });

    const validateFields = () => {
        let valid = true;
        let newErrors = { name: '', phone: '', address: '' };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            valid = false;
        } else if (name.length < 8 || name.length > 20) {
            newErrors.name = 'Name must be between 8 and 20 characters';
            valid = false;
        }

        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
            valid = false;
        } else if (!/^\d+$/.test(phone)) {
            newErrors.phone = 'Phone number should not contain letters or special characters';
            valid = false;
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleEditClick = (field) => {
        setIsEditing({ ...isEditing, [field]: true });
    };

    const handleSaveClick = (field) => {
        if (validateFields()) {
            setIsEditing({ ...isEditing, [field]: false });
        }
    };

    const handleLocationSelected = (selectedLocation) => {
        setLatitude(selectedLocation.latitude);
        setLongitude(selectedLocation.longitude);
        setAddress(selectedLocation.address);
        setIsEditing({ ...isEditing, address: false });
    };

    const firstName = name.split(' ')[0];

    return (
        <div className="profile">
            <h2>Profile</h2>
            <div className="profile-avatar">{firstName.charAt(0)}</div>
            
            <div>{errors.name && <span className="error">{errors.name}</span>}</div>
            <div className="profile-field">
                <label htmlFor="name">Name:</label>
                {isEditing.name ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                ) : (
                    <span>{name}</span>
                )}
                {isEditing.name ? (
                    <button className="edit-button" onClick={() => handleSaveClick('name')}>Save</button>
                ) : (
                    <button className="edit-button" onClick={() => handleEditClick('name')}>Edit</button>
                )}
            </div>

            <div>{errors.phone && <span className="error">{errors.phone}</span>}</div>
            <div className="profile-field">
                <label htmlFor="phone">Phone:</label>
                {isEditing.phone ? (
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        required
                    />
                ) : (
                    <span>{phone}</span>
                )}
                {isEditing.phone ? (
                    <button className="edit-button" onClick={() => handleSaveClick('phone')}>Save</button>
                ) : (
                    <button className="edit-button" onClick={() => handleEditClick('phone')}>Edit</button>
                )}
            </div>

            <div>{errors.address && <span className="error">{errors.address}</span>}</div>
            <div className="profile-field">
                <label htmlFor="address">Address:</label>
                {isEditing.address ? (
                    <>
                        <LocationPicker onLocationSelect={handleLocationSelected} />
                    </>
                ) : (
                    <span>{address.substring(0, 20)}...</span>
                )}
                {isEditing.address ? (
                    <button className="edit-button" onClick={() => handleSaveClick('address')}>Save</button>
                ) : (
                    <button className="edit-button" onClick={() => handleEditClick('address')}>Edit</button>
                )}
            </div>
        </div>
    );
};

export default RecieverProfile;
