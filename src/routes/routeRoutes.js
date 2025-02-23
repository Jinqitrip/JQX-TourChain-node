const router = require('express').Router();
const { check } = require('express-validator');
const routeController = require('../controllers/routeController');

router.get('/recommend_region', 
  [
    check('region').notEmpty(),
    check('sort').optional().isIn(['hot', 'price_asc'])
  ],
  routeController.getRegionRecommendations
);

router.get('/recommend_destination', 
  [
    check('destination').notEmpty(),
    check('sort').optional().isIn(['hot', 'price_asc'])
  ],
  routeController.getDestinationRecommendations
);

router.post('/custom', 
  [
    check('description').notEmpty()
  ],
  routeController.submitCustomRoute
);

module.exports = router;