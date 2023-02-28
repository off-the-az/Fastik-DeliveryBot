const express = require('express');
const router = express.Router();
const Ticket = require('../controller/ticketController');

router.get('/get', async function(req, res, next) {
  try {
    const controller = new Ticket(); 
    res.json(await controller.readAll());
  } catch (err) {
    console.error(`Error while getting info from DB Tickets. Error: `, err.message);
    next(err);
  }
});

router.get('/get/byId/:id', async function(req, res, next) {
  try {
    let controller = new Ticket(); 
    res.json(await controller.readBy({_id: req.params['id'] }));
  } catch (err) {
    console.error(`Error while getting info from DB Tickets. Error: `, err.message);
    next(err);
  }
});

router.get('/get/byName/:fullname', async function(req, res, next) {
  try {
    let controller = new Ticket(); 
    res.json(await controller.readBy({owner: req.params['fullname'] }));
  } catch (err) {
    console.error(`Error while getting info from DB Tickets. Error: `, err.message);
    next(err);
  }
});


router.get('/get/byStatus/:status', async function(req, res, next) {
  try {
    let controller = new Ticket(); 
    res.json(await controller.readBy({status: Number(req.params['status']) }));
  } catch (err) {
    console.error(`Error while getting info from DB Tickets. Error: `, err.message);
    next(err);
  }
});



/**************************** Demo ********************************/

router.get('/get/byDate/:date', async function(req, res, next) {
  try {
    let controller = new Ticket(); 
    res.json(await controller.readBy({date: req.params['date'] }));
  } catch (err) {
    console.error(`Error while getting info from DB Tickets. Error: `, err.message);
    next(err);
  }
});

/******************************************************************/




router.post('/add', async function(req, res, next) {
  try {
    let controller = new Ticket(); 
    res.json(await controller.addTicket(req.body));
  } catch (err) {
      console.error(`Error while creating record in DB Tickets Error: `, err.message);
      next(err);
  }
});

router.put('/update/:id', async function(req, res, next) {
  try {
    let controller = new Ticket(); 
    res.json(await controller.updateTicket({_id: req.params["id"]}, req.body));
  } catch (err) {
      console.error(`Error while updating record in DB Tickets Error: `, err.message);
      next(err);
  }
});

router.delete('/delete/byId/:id', async function(req, res, next) {
  try {
    let controller = new Ticket(); 
    res.json(await controller.deleteBy({_id: req.params["id"]}, req.body));
  } catch (err) {
      console.error(`Error while deleting record in DB Tickets Error: `, err.message);
      next(err);
  }
});

router.delete('/delete/byName/:username', async function(req, res, next) {
  try {
    let controller = new Ticket(); 
    res.json(await controller.deleteBy({name: req.params["username"]}, req.body));
  } catch (err) {
      console.error(`Error while deleting record in DB Tickets Error: `, err.message);
      next(err);
  }
});



/**************************** Demo ********************************/

router.delete('/delete/byDate/:date', async function(req, res, next) {
  try {
    let controller = new Ticket(); 
    res.json(await controller.deleteby({date: req.params['date'] }));
  } catch (err) {
    console.error(`Error while getting info from DB Tickets. Error: `, err.message);
    next(err);
  }
});

/******************************************************************/



module.exports = router;