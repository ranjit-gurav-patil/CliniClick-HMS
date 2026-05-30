import { useCallback } from 'react';
import logo from '../assets/cliniclick-logo.png';

// 1. The Script Loader (Only loads once)
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true); // Skip if already loaded
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// 2. The Custom Hook
export function useRazorpay() {
  const openCheckout = useCallback(async ({
    orderData,
    sessionToken = null,
    prefill = {},
    onSuccess,
    onDismiss
  }) => {
    
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Payment Gateway offline. Check your internet.");
      if (onDismiss) onDismiss();
      return;
    }

    const options = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'CliniClick SaaS',
      description: `Subscription for ${orderData.plan_name}`,
      image: logo,
      order_id: orderData.order_id,
      prefill: prefill, // Injects email/phone for guest registration
      handler: function (response) {
        // Automatically save token if it's a guest checkout
        if (sessionToken) {
          localStorage.setItem('token', sessionToken);
        }
        // Fire the specific success action for the page
        if (onSuccess) onSuccess(response);
      },
      theme: { color: '#0ea5e9' },
      modal: {
        ondismiss: function() {
          // Fire the specific dismiss action for the page
          if (onDismiss) onDismiss();
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }, []);

  return { openCheckout };
}