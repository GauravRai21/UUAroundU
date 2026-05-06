const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;
    
    if (!title || !description || !date || !time || !location) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      creatorId: req.user.id,
      uniqueId: req.user.uniqueId
    });

    const event = await newEvent.save();
    await event.populate('creatorId', ['name', 'profilePic']);
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events
// @desc    Get all upcoming events for user's community
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ 
      uniqueId: req.user.uniqueId,
      date: { $gte: new Date().setHours(0,0,0,0) } // Only upcoming events
    })
    .sort({ date: 1 })
    .populate('creatorId', ['name', 'profilePic']);
      
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/events/rsvp/:id
// @desc    RSVP to an event
// @access  Private
router.put('/rsvp/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const isGoing = event.attendees.includes(req.user.id);
    
    if (isGoing) {
      event.attendees = event.attendees.filter(userId => userId.toString() !== req.user.id);
    } else {
      event.attendees.unshift(req.user.id);
    }

    await event.save();
    res.json(event.attendees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
