# Dream Trip Planner

A beautiful photobook-style web application for planning and managing your travel trips.

## Features

- User authentication (register, login, logout)
- Create and manage trips with destinations and dates
- Plan daily itineraries with morning, afternoon, and evening activities
- Track trip expenses by category
- Upload and manage trip photos
- Export trip details in various formats (JSON, HTML, PDF)
- Photobook-inspired design with warm colors and elegant typography

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- TailwindCSS for styling
- Font Awesome for icons
- Custom photobook-style CSS

### Backend Options

This application supports multiple backend options:

1. **Supabase Backend** - Uses Supabase for authentication and database storage
2. **Firebase Backend** - Can be configured to use Firebase (implementation pending)
3. **LocalStorage Backend** - For local development and demo purposes, uses browser localStorage

## Deployment Instructions

### Deploying to Netlify

1. **Fork or Clone this Repository**
   - Make sure you have a copy of this repository in your GitHub account

2. **Configure Supabase (Optional)**
   - Create a new Supabase project at https://supabase.com
   - Create the following tables in your Supabase database:
     - `trips` - For storing trip information
   - Get your Supabase URL and anon key from the API settings
   - Update the `supabase-api.js` file with your Supabase URL and anon key

3. **Deploy to Netlify**
   - Go to https://app.netlify.com and sign in
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - Build command: (leave empty)
     - Publish directory: `frontend`
   - Click "Deploy site"

4. **Environment Variables (if using Supabase)**
   - In Netlify, go to Site settings > Build & deploy > Environment
   - Add the following environment variables:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_KEY`: Your Supabase anon key

### Local Development

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd Dream-trip-planner
   ```

2. **Open the Application**
   - For the no-backend demo, simply open `frontend/no-backend.html` in your browser
   - No server or Node.js installation required!

3. **Using with Supabase**
   - Update the Supabase credentials in `frontend/src/js/supabase-api.js`
   - Open `frontend/index.html` in your browser
- Node.js with Express
- MongoDB for data storage
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dream-trip-planner.git
   cd dream-trip-planner
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/dream-trip-planner
     JWT_SECRET=your_secret_key
     JWT_EXPIRE=30d
     ```

4. Start the backend server:
   ```
   npm start
   ```

5. Open the frontend:
   - Navigate to the `frontend` directory
   - Open `index.html` in a web browser

## Usage

1. Register a new account or login with existing credentials
2. Create a new trip with destinations and dates
3. Add activities to your itinerary
4. Track expenses and upload photos
5. Export your trip details when ready

## License

MIT