const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Listing = require('../models/Listing');

// @route   POST api/marketplace
// @desc    Create a listing
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, category, images } = req.body;
    
    if (!title || !description || price == null || !category) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newListing = new Listing({
      title,
      description,
      price,
      category,
      images: images || [],
      sellerId: req.user.id,
      uniqueId: req.user.uniqueId
    });

    const listing = await newListing.save();
    await listing.populate('sellerId', ['name', 'profilePic']);
    
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/marketplace
// @desc    Get listings for community
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Basic filter by available status (making marketplace global across all communities)
    const filter = { status: 'available' };
    
    if (req.query.category) filter.category = req.query.category;
    
    const listings = await Listing.find(filter)
      .sort({ isBoosted: -1, createdAt: -1 }) // Boosted listings first
      .populate('sellerId', ['name', 'profilePic']);
      
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/marketplace/:id/sold
// @desc    Mark listing as sold
// @access  Private
router.put('/:id/sold', auth, async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ msg: 'Listing not found' });
    if (listing.sellerId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    listing.status = 'sold';
    await listing.save();
    
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
