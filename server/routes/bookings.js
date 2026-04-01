const express= require('express');
const router= express.Router();
const {protect, admin}= require('../middleware/auth');
const { bookEvent, getMyBookings, confirmBooking, cancelBooking, sendBookingOTP }= require('../controllers/bookingControllers');

router.post('/', protect, bookEvent);
router.get('/myBooking', protect, getMyBookings);
router.post('/send-otp', protect, sendBookingOTP);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.delete('/:id', protect, cancelBooking);

module.exports= router;