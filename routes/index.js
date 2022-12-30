var express = require('express');
var router = express.Router();
const Place = require('../models/places');
require('../models/connection');


router.post('/places', (req, res) => {
    const {nickname, name, latitude, longitude} = req.body
   
    // Check if the place has not already been registered
    Place.findOne({ name: name, nickname: nickname, latitude: latitude, longitude: longitude, }).then(data => {
        console.log("dataaaa",data);
      if (data === null) {
        const newPlace = new Place({
            nickname: nickname,
            name: name,
            latitude: latitude,
            longitude: longitude,
        });
  
        newPlace.save().then(newDoc => {
          res.json({ result: true});
        });
      } else {
        // Place already exists in database
        res.json({ result: false, error: 'Place already exist' });
      }
    });
  });

  router.get('/places/:nickname', (req, res) => {
    

     Place.find({ nickname: req.params.nickname }).then(data => {
         const {nickname, name, latitude, longitude} = data
         if (data) {
      res.json({ result: true, places: data });
    
    } else {
      res.json({ result: false, error: 'Nickname not found' });
    }
  });
});

router.delete("/places", (req, res) => {
    Place.deleteOne({
      nickname: req.body.nickname, name: req.body.name
      },
    ).then(deletedPlace => {
      if (deletedPlace !== null) {
        // Place successfully deleted
        Place.find().then(data => {
          res.json({ result: true});
        });
    } else {
          res.json({ result: false, error: "Place or nickname not found" });
      }
    });
});


module.exports = router;
