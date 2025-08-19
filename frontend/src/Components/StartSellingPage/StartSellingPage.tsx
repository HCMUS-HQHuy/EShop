import React, { useState } from 'react';
import styles from './StartSellingPage.module.scss';

const StartSellingPage = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        shopName: '',
        businessEmail: '',
        phoneNumber: '',
        shopDescription: '',
        agreeTerms: false,
    });

    // Handler for input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        // Check if the input is a checkbox
        const isCheckbox = type === 'checkbox';
        const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

        setFormData(prevData => ({
            ...prevData,
            [name]: inputValue,
        }));
    };

    // Handler for form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Add logic to send form data to the backend
        // For example: dispatch a Redux action or call an API
        console.log('Form data submitted:', formData);

        // Display a success message (example)
        alert('Your request to open a shop has been submitted!');
    };

    return (
        <div className={styles.startSellingContainer}>
            <div className={styles.introSection}>
                <h1>Become a Seller on EShop</h1>
                <p>Reach millions of customers and grow your business. Get started today!</p>
            </div>

            <form className={styles.registrationForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="shopName">Shop Name</label>
                    <input
                        type="text"
                        id="shopName"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        placeholder="e.g., ABC Fashion Store"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="businessEmail">Business Email</label>
                    <input
                        type="email"
                        id="businessEmail"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Contact phone number"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="shopDescription">Shop Description</label>
                    <textarea
                        id="shopDescription"
                        name="shopDescription"
                        value={formData.shopDescription}
                        onChange={handleChange}
                        rows={5}
                        placeholder="A brief introduction to your shop and products..."
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                    <input
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="agreeTerms">
                        I have read and agree to the EShop <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
                    </label>
                </div>

                <button type="submit" className={styles.submitButton} disabled={!formData.agreeTerms}>
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default StartSellingPage;