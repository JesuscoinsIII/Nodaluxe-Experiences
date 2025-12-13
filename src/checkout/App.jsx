import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// NOTE: This is a test mode publishable key. In production, this should be:
// - Stored in environment variables (e.g., import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
// - Replaced with a production key for live payments
// Test publishable key (safe to expose in client-side code)
const stripePromise = loadStripe('pk_test_51QSWKjFkiYAZ0jz8G1K3hYGvN8VvXzxjdY7pFvH5xPzT9pEfQH7J2VqQKRZSLz0z9YJD5xvN8KtQH9pWJQ8xV7jD00aBcDeFgh');

function App() {
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Get booking details from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    const pickup = params.get('pickup') || 'Not specified';
    const dropoff = params.get('dropoff') || 'Not specified';
    const date = params.get('date') || 'Not specified';
    const time = params.get('time') || 'Not specified';
    const passengers = params.get('passengers') || '1';
    const vehicle = params.get('vehicle') || 'Luxury Sedan';
    const amount = params.get('amount') || '150.00';

    setBookingDetails({
      pickup,
      dropoff,
      date,
      time,
      passengers,
      vehicle,
      amount
    });
  }, []);

  const options = {
    mode: 'payment',
    amount: bookingDetails ? Math.round(parseFloat(bookingDetails.amount) * 100) : 15000,
    currency: 'usd',
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#d4af37',
        colorBackground: '#1F2937',
        colorText: '#ffffff',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <>
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a href="/" className="text-2xl font-bold text-gold">Nodaluxe</a>
            <nav className="hidden md:flex gap-6 text-sm text-gray-300">
              <a href="/#spaces" className="hover:text-gold transition">Partner Venues</a>
              <a href="/events.html" className="hover:text-gold transition">Events</a>
              <a href="/sponsorships.html" className="hover:text-gold transition">Sponsorships</a>
            </nav>
          </div>
          <div className="text-sm flex items-center gap-4">
            <a href="tel:+14696698878" className="text-gray-300 hover:text-gold transition">469-669-8878</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen p-6 bg-gray-950 flex flex-col items-center">
        <div className="max-w-4xl w-full mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gold mb-4">Complete Your Booking</h1>
            <p className="text-gray-400">Secure payment powered by Stripe</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gold mb-6">Booking Summary</h2>
              {bookingDetails ? (
                <div className="space-y-4 text-gray-300">
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Vehicle:</span>
                    <span className="font-medium">{bookingDetails.vehicle}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Date:</span>
                    <span className="font-medium">{bookingDetails.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Time:</span>
                    <span className="font-medium">{bookingDetails.time}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Passengers:</span>
                    <span className="font-medium">{bookingDetails.passengers}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Pickup:</span>
                    <span className="font-medium text-right">{bookingDetails.pickup}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Dropoff:</span>
                    <span className="font-medium text-right">{bookingDetails.dropoff}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4">
                    <span className="text-gold">Total Amount:</span>
                    <span className="text-gold">${bookingDetails.amount}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Loading booking details...</div>
              )}
              
              <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Test Mode:</strong> Use test card 4242 4242 4242 4242 with any future expiry date and CVC.
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gold mb-6">Payment Details</h2>
              {bookingDetails && (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm bookingDetails={bookingDetails} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Nodaluxe Experiences. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
