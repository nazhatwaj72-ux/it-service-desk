const express = require("express");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.get("/stats", ticketController.getStats);
router.get("/", ticketController.getAllTickets);
router.get("/:id", ticketController.getTicketById);
router.post("/", ticketController.createTicket);
router.put("/:id", ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

module.exports = router;
