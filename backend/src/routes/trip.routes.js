const express = require('express');
const { getTrips, getTrip, createTrip, updateTrip, deleteTrip } = require('../controllers/trip.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All trip routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getTrips)
  .post(createTrip);

router.route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(deleteTrip);

module.exports = router;
