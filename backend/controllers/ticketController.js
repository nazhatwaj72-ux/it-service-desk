const ticketService = require("../services/ticketService");
const { asyncHandler } = require("../middleware/errorHandler");

const getStats = asyncHandler(async (req, res) => {
    const stats = await ticketService.getStats();
    res.status(200).json(stats);
});

const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await ticketService.getAllTickets();
    res.status(200).json({ tickets, count: tickets.length });
});

const getTicketById = asyncHandler(async (req, res) => {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.status(200).json(ticket);
});

const createTicket = asyncHandler(async (req, res) => {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
});

const updateTicket = asyncHandler(async (req, res) => {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    res.status(200).json(ticket);
});

const deleteTicket = asyncHandler(async (req, res) => {
    const result = await ticketService.deleteTicket(req.params.id);
    res.status(200).json(result);
});

module.exports = {
    getStats,
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket
};
