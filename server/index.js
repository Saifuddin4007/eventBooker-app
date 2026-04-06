const express= require('express');
const cors= require('cors');
const dotenv= require('dotenv');
const mongoDB= require('./db/db');
const authRoutes= require('./routes/auth');
const eventRoutes= require('./routes/events');
const bookingRoutes= require('./routes/bookings');
const path= require('path');

const _dirname= path.resolve();


//!Connect to DB
mongoDB();

dotenv.config();
const app= express();
const PORT= process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: 'https://eventbooker-app.onrender.com', // your React app's exact origin
    credentials: true,               // required because axios has withCredentials: true
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

//!Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(express.static(path.join(_dirname, "/client/dist")));
app.use((req,res)=>{
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
})



app.use(express.json());



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
})