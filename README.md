# Carpooling Website A modern carpooling platform that connects drivers and passengers for shared journeys, making travel more affordable, sustainable, and social. ## Features - **Ride Publishing**: Drivers can easily publish rides with origin, destination, timing, and vehicle details - **Smart Search**: Autocomplete-enabled location search with real-time suggestions - **User Authentication**: Secure login/signup with JWT authentication - **Ride Booking**: Passengers can book seats and join rides - **User Profiles**: View rider details, ratings, and preferences - **Responsive Design**: Works seamlessly on desktop and mobile devices ## Tech Stack ### Frontend - React with Vite - TailwindCSS for styling - Radix UI components - React Hook Form with Zod validation - Axios for API calls ### Backend - Node.js with Express - MongoDB with Mongoose - JWT authentication - Multer for file uploads - CORS-enabled API ## Getting Started ### Prerequisites - Node.js installed - MongoDB database (local or Atlas) ### Installation 1. **Clone the repository**
bash
git clone <repository-url>
cd carpooling-website
2. **Install dependencies**
bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
3. **Environment Setup** Create .env files in both server and client directories: **Server .env:**
MONGO_URI=mongodb://localhost:27017/carpooling
ORIGIN=http://localhost:5174
SERVER=http://localhost:8080
JWT_SECRET=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRY=7d
**Client .env:**
VITE_REACT_API_URI=http://localhost:8080/api
4. **Start the application**
bash
# Start backend server (from server directory)
npm run dev

# Start frontend client (from client directory)
npm run dev
## How It Works 1. **Publish a Ride**: Drivers enter journey details, vehicle information, and set pricing 2. **Search Rides**: Passengers search for available rides using the smart location search 3. **Book Seats**: Passengers book seats and join rides with secure authentication 4. **Connect**: Drivers and passengers can communicate and coordinate journey details ## Key Components - **PublishCard**: Ride publishing form with vehicle details - **Search**: Smart autocomplete location search - **RideDetail**: Detailed ride information and booking interface - **AuthContext**: Global authentication state management - **ProtectedRoute**: Route protection for authenticated users ## Contributing This project is built with modern web development practices and focuses on user experience, security, and scalability.
