const express= require('express');
const cors= require('cors');
const dotenv= require('dotenv');
const mongoDB= require('./db/db');
const authRoutes= require('./routes/auth');

dotenv.config();
const app= express();
const PORT= process.env.PORT || 5000;
app.use(express.json());

//!Routes
app.use('/api/auth', authRoutes);


//!Connect to DB
mongoDB();

app.use(cors());
app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
})