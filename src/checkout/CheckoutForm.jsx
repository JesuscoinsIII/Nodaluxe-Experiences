import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

function CheckoutForm({ bookingDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // IMPORTANT: This is a simplified test mode implementation.
      // In production, you need to:
      // 1. Create a payment intent on your backend server
      // 2. Return the client secret to the frontend
      // 3. Pass the client secret to the Elements component
      // 4. Call stripe.confirmPayment() with the client secret
      
      // For test/demo purposes, we validate the form
      const { error } = await elements.submit();
      
      if (error) {
        setErrorMessage(error.message);
        setIsProcessing(false);
        return;
      }

      // Simulate successful payment in test mode
      // In production, this should be replaced with actual payment confirmation
      setTimeout(() => {
        setPaymentSuccess(true);
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-500 mb-4">Payment Successful!</h3>
        <p className="text-gray-400 mb-6">
          Your booking has been confirmed. You will receive a confirmation email shortly.
        </p>
        <div className="space-y-3">
          <a
            href="/"
            className="block w-full bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition"
          >
            Return to Home
          </a>
          <a
            href="/book-now.html"
            className="block w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Book Another Trip
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <label className="block text-gray-400 mb-2 text-sm">
          Email Address
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold transition"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-400 mb-2 text-sm">
          Card Details
        </label>
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <PaymentElement />
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isProcessing || !stripe
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gold text-black hover:bg-gold-dark'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay $${bookingDetails.amount}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted. Powered by Stripe.
      </p>
    </form>
  );
}

export default CheckoutForm;
