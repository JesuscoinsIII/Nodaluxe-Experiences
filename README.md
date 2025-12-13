# Nodaluxe-Experiences
[![Netlify Status](https://api.netlify.com/api/v1/badges/dc0b4ea9-c3f0-43f3-94b2-6e8516ddf0ea/deploy-status)](https://app.netlify.com/projects/nodaluxe/deploys)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/JesuscoinsIII/Nodaluxe-Experiences/blob/main/LICENSE)


## Overview

Nodaluxe-Experiences is a comprehensive event management solution built to enhance Modal booking and streamline the broader event ecosystem. We provide tools and integrations to simplify event creation, scheduling, and delivery.  Our focus is on providing a seamless and reliable experience for both event organizers and attendees.

## License: [Copyright (c) 2025 Jesuscoins Nodaluxe Experiences, LLC](https://opensource.org/licenses/MIT)


## Key Features

*   **Seamless Booking:**  Our core feature provides a frictionless booking experience, integrating with Modal and other platforms.
*   **React Checkout Page:**  Secure payment processing with Stripe integration in test mode for luxury transportation bookings.
*   **Event Management Tools:**  (Expand on this with specifics - e.g., ticketing, scheduling, attendee management)
*   **Integration with TWILIO:**  Enables SMS and voice communication for event updates and reminders.
*   **Netlify Deployment:**  Fast and reliable hosting with automated builds.
*   **Google Cloud Integration:**  Utilizing Google Cloud services for scalability and data management.
*   **Firebase Integration:**  Leveraging Firebase for authentication and real-time data synchronization.
*   **SendGrid Integration:**  Enabling reliable email delivery for event notifications and marketing.

## Technology Stack

*   **Frontend:** HTML/CSS/JavaScript, React 19 (for checkout page)
*   **Build Tool:** Vite
*   **Payment Processing:** Stripe (test mode)
*   **Backend:** sTRI[E] (Please provide more details about sTRI[E])
*   **Cloud:** Google Cloud
*   **Hosting:** Netlify
*   **Communication:** Twilio, SendGrid
*   **Database:** Firebase
*   **Version Control:** GitHub

## Getting Started

### Prerequisites

*   **Node.js:**  Version 16 or higher.
*   **npm or yarn:** Package manager.
*   **Google Cloud Account:**  With appropriate permissions.
*   **Firebase Account:**  With a project set up.
*   **Twilio Account:**  With a phone number and credentials.
*   **SendGrid Account:** With API keys and setup.
*   **Modal Account:** To utilize booking features.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd nodaluxe-experiences
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
    ```

3.  **Configure Environment Variables:**

    *   Create a `.env` file in the root directory.
    *   Add your environment variables as follows (replace with your actual values):

        ```
        GOOGLE_CLOUD_KEY_FILE=<your_google_cloud_key_file_path>
        FIREBASE_API_KEY=<your_firebase_api_key>
        TWILIO_ACCOUNT_SID=<your_twilio_account_sid>
        TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
        SENDGRID_API_KEY=<your_sendgrid_api_key>
        MODAL_API_KEY=<your_modal_api_key>
        # Add other environment variables as needed
        ```

4.  **Setup Google Cloud:**
    *   (Provide detailed instructions here on how to set up the Google Cloud environment, including authentication and project configuration.)

5.  **Setup Firebase:**
    *   (Provide detailed instructions here on how to set up Firebase, including authentication and database configuration.)

### Usage

*   **Running the Development Server:**

    ```bash
    npm run dev  # Starts the React checkout page development server
    ```

*   **Building for Production:**

    ```bash
    npm run build  # Builds the React checkout page
    ```

*   **Deployment:**

    *   The project is configured for Netlify deployment. Push your changes to the main branch, and Netlify will automatically build and deploy the application.
    *   The build command `npm run build` creates the checkout page in `dist/checkout/`

### Checkout Page

The React-based checkout page provides secure payment processing for transportation bookings. See [CHECKOUT.md](CHECKOUT.md) for detailed documentation.

**Quick Start:**
1. Navigate to `/book-now.html` to create a booking
2. Click "Pay Now" to proceed to the checkout page
3. Use test card `4242 4242 4242 4242` for testing payments

**Note:** The current implementation is in test mode. For production use, a backend API is required to create Stripe Payment Intents.

## Contributing

We welcome contributions to Nodaluxe-Experiences!  Please read our [Contributing Guidelines](<!-- Link to your contributing guidelines -->) before submitting a pull request.


 Contact [info@nodaluxe.com]

