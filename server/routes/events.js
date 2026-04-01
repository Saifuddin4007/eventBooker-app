const express= require('express');
const router= express.Router();
const {protect, admin}= require('../middleware/auth');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventControllers');

//Get all events
router.get('/', getAllEvents);

//Get event by Id
router.get('/:id', getEventById);

//Create evet (Admin Only)
router.post('/', protect, admin, createEvent);


//Update event (Admin Only)
router.put('/:id', protect, admin, updateEvent);

//Delete event (Admin Only)
router.delete('/:id', protect, admin, deleteEvent);


module.exports= router;