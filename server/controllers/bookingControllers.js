const Booking= require('../models/Booking');
const OTP= require('../models/OTP');
const Event= require('../models/Event');
const {sendBookingEmail, sendOTPEmail}= require('../utils/email');

const generateOTP= () =>{
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendBookingOTP= async (req,res) => {
    try{
        const otp= generateOTP();
        await OTP.findOneAndDelete({email: req.user.email, action: 'event_booking'});
        await OTP.create({email: req.user.email, otp: otp, action: 'event_booking'});
        await sendOTPEmail(req.user.email, otp, 'event_booking');
        res.json({message: "OTP sent to your email for booking confirmation"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.bookEvent= async (req,res) =>{
    const {eventId, otp}= req.body;

    try{
        const otpRecord= await OTP.findOne({email: req.user.email, otp, action: "event_booking"});
        if(!otpRecord){
            return res.status(400).json({message: "Invalid OTP"});
        }

        const event= await Event.findById(eventId);
        if(!event){
            return res.status(404).json({message: "Event not found"});
        }

        if(event.availableSeats<=0){
            return res.status(400).json({message: "No seats available for this event"});
        }

        const existingBooking= await Booking.findOne({userId: req.user._id, eventId});
        if(existingBooking){
            return res.status(400).json({message: "You have already booked this event"});
        }

        const booking= await Booking.create({
            userId: req.user._id,
            eventId,
            status: 'pending',
            paymentStatus: 'non_paid',
            amount: 'event.ticketPrice'
        });
        await OTP.deleteMany({email: req.user.email, action: "event_booking"});
        
        res.status(201).json({message: "Booking successful, please check your email for confirmation"});

    }catch(err){
        res.status(500).json({message: err.message});
    }
}


exports.confirmBooking= async (req,res) =>{
    try{
        const paymentStatus= req.body.paymentStatus;
        if(!['paid', 'non_paid'.includes(paymentStatus)]){
            return res.status(400).json({message: "Invalid payment status"});
        }
        const booking= await Booking.findById(req.params.id).populate('eventId');
        if(!booking){
            return res.status(404).json({message: "Booking not found"});
        }

        if(booking.status==='confirmed'){
            return res.status(400).json({message: "Booking is already confirmed"});
        }

        const event= await Event.findById(booking.eventId._id);
        if(event.totalSeats <=0){
            return res.status(400).json({message: "No seats available for this event"});
        }

        booking.status= 'confirmed';
        if(paymentStatus){
            booking.paymentStatus= paymentStatus;
        }
        await booking.save();
        event.availableSeats -=1;
        await event.save();
        await sendBookingEmail(booking.userId.email, event.title, booking._id);
        res.status(200).json({message: "Booking confirmed successfully"});

    }catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.getMyBookings= async (req,res) =>{
    try{
        const bookings= await Booking.find({userId: req.user._id}).populate('eventId');
        res.json(bookings);
    }catch(err){
        res.status(500).json({message: err.message});

    }

}


exports.cancelBooking= async (req,res) =>{
    try{
        const booking= await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({message: "Booking not found"});
        }

        if(booking.userId.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "You are not authorized to cancel this booking"});
        }

        if(booking.status=== 'confirmed'){
            const event= await Event.findById(booking.eventId._id);
            event.availableSeats +=1;
            await event.save();
        }

        await booking.remove();
        res.json({message: "Booking cancelled successfully"});

        booking.status= 'cancelled';
        await booking.save();

    }catch(err){
        res.status(500).json({message: err.message});

    }
}


