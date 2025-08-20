import React, { use, useState } from 'react';
import styles from './StartSellingPage.module.scss';
import useScrollOnMount from 'src/Hooks/App/useScrollOnMount.tsx';
import { useSelector, useDispatch } from 'react-redux';
import { showAlert } from 'src/Features/alertsSlice.tsx';
import useOnlineStatus from 'src/Hooks/Helper/useOnlineStatus.tsx';
import formSchemas from 'src/Types/forms.ts';
import type { SellerRegistrationFormValues } from 'src/Types/forms.ts';
import type { AppDispatch, RootState } from 'src/Types/store.ts';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { updateInput } from 'src/Features/formsSlice.tsx'
import { newShop } from 'src/Features/sellerSlice.tsx';

const StartSellingPage = () => {
    const { sellerRegistrationForm } = useSelector((state: RootState) => state.forms);
    const { shopName, agreeTerms, businessEmail, address, phoneNumber, shopDescription } = sellerRegistrationForm;
    const dispatch = useDispatch<AppDispatch>();
    const isWebsiteOnline = useOnlineStatus();
    const { t } = useTranslation();

    useScrollOnMount(100);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(updateInput({
            formName: 'sellerRegistrationForm',
            key: e.target.name as keyof typeof sellerRegistrationForm,
            value:
                e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value
        }));
    };

    // Handler for form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isWebsiteOnline) {
          internetConnectionAlert(dispatch, t);
          return;
        }
        const result = formSchemas.sellerRegistration.safeParse(sellerRegistrationForm);
        if (!result.success) {
          console.log("Invalid registration credentials");
          return;
        }
        const formData: SellerRegistrationFormValues = result.data;
        try {
            await dispatch(newShop(formData)).unwrap();
            sentFormAlert(t, dispatch);
        } catch (error) {
            errorAlert(dispatch, 'Submit failed');
        }
        console.log('Form data submitted:', sellerRegistrationForm);
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
                        value={shopName}
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
                        value={businessEmail}
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
                        value={phoneNumber}
                        onChange={handleChange}
                        placeholder="Contact phone number"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={address}
                        onChange={handleChange}
                        placeholder="Contact address"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="shopDescription">Shop Description</label>
                    <textarea
                        id="shopDescription"
                        name="shopDescription"
                        value={shopDescription}
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
                        checked={agreeTerms}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="agreeTerms">
                        I have read and agree to the EShop <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
                    </label>
                </div>

                <button type="submit" className={styles.submitButton} disabled={!agreeTerms}>
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default StartSellingPage;

function internetConnectionAlert(dispatch: AppDispatch, t: TFunction) {
  const alertText = t("toastAlert.signInFailed");
  const alertState = "error";
  dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
}

function sentFormAlert(t: TFunction, dispatch: AppDispatch) {
  const alertText = t("toastAlert.formSubmitted");
  const alertState = "success";
  setTimeout(() => {
    dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
  }, 1500);
}

function errorAlert(dispatch: AppDispatch, alertText: string) {
  const alertState = "error";
  dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
}