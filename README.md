# Letter App

Letter App is a full-stack web application that lets users create, edit, and manage digital letters. Users can sign in with Google and save their letters directly to Google Drive.

## Live Demo

Visit our application at: [https://letter-app-rd5v.vercel.app](https://letter-app-rd5v.vercel.app)

## Project Structure

```
LetterApp/
├── client/   # React frontend application
└── server/   # Express backend service
```

## Features

- **Google OAuth Authentication:** Sign in using Google accounts.
- **Digital Letter Editor:** Write and format your letters in a user-friendly editor.
- **Google Drive Integration:** Save and retrieve letters as Google Docs.
- **Simple & Clean UI:** Focus on your writing without distractions.

## Installation

### Prerequisites

- Node.js (>= 18.x)
- A Google API project with OAuth credentials and the Drive API enabled

### Steps

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/abhirajtr/letter-app.git
   cd letter-app
   ```

2. **Install Dependencies:**
   
   For the server:
   ```sh
   cd server
   npm install
   ```
   
   For the client:
   ```sh
   cd ../client
   npm install
   ```

3. **Configure Environment Variables:**
   
   Create a `.env` file in both the `server` and `client` directories.
   
   * **Server (.env):**
     ```
     PORT=5000
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
     SESSION_SECRET=your_session_secret
     ```
   
   * **Client (.env):**
     ```
     REACT_APP_API_BASE_URL=http://localhost:5000
     REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
     ```

4. **Run the Application:**
   
   Start the backend:
   ```sh
   cd server
   npm start
   ```
   
   Start the frontend:
   ```sh
   cd ../client
   npm start
   ```

## License

This project is licensed under the MIT License.

Feel free to adjust any details (like environment variable names or configuration settings) to suit your specific project setup. Enjoy building your Letter App!
