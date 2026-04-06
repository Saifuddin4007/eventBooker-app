const express= require('express');
const cors= require('cors');
const dotenv= require('dotenv');
const mongoDB= require('./db/db');
const authRoutes= require('./routes/auth');
const eventRoutes= require('./routes/events');
const bookingRoutes= require('./routes/bookings');

dotenv.config();
const app= express();
const PORT= process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // your React app's exact origin
    credentials: true,               // required because axios has withCredentials: true
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

//!Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);


//!Connect to DB
mongoDB();

app.use(cors());
app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
})