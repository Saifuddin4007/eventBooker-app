const Event= require('../models/Event');


exports.getAllEvents= async (req,res) => {
    try{

        const filters= {};
        if(req.query.category){
            filters.category= req.query.category;
        }
        if(req.query.date){
            filters.date= {$gte: new Date(req.query.date)};
        }
        if(req.query.location){
            filters.location= req.query.location;
        }
        if(req.query.ticketPrice){
            filters.ticketPrice= {$lte: parseFloat(req.query.ticketPrice)};
        }


        const events= await Event.find(filters);
        res.json(events);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}


exports.getEventById= async (req,res) => {
    try{
        const event= await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({message: 'Event not found'});
        }
        res.json(event);

    }catch(err){
        res.status(500).json({message: err.message});
    }
}


exports.createEvent= async (req,res) =>{
    try{
        const {title, description, date, location, category, totalSeats, ticketPrice, imageUrl
        } = req.body;
        const event= await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl
        });
        res.status(201).json(event);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.updateEvent= async (req,res) => {
    try{
        const {title, description, date, location, category, totalSeats, ticketPrice, imageUrl} = req.body;
        const event= await Event. findByIdAndUpdate(req.params.id, {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl

        });
        if(!event){
            return res.status(404).json({message: 'Event not found'});
        }
        res.status(201).json(event);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}


exports.deleteEvent= async (req,res) =>{
    try{
        const event= await Event.findByIdAndDelete(req.params.id);
        res.json({message: 'Event deleted successfully'});
        if(!event){
            return res.status(404).json({message: 'Event not found'});
        }
        res.status(200).json({message: 'Event deleted successfully'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}