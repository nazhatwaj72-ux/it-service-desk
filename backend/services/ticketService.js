const pool = require("../config/db");
const {
    CATEGORIES,
    PRIORITIES,
    STATUSES,
    DEFAULT_PRIORITY,
    DEFAULT_STATUS
} = require("../utils/constants");
const { AppError } = require("../middleware/errorHandler");

const validateTicketFields = (data, { isUpdate = false } = {}) => {
    const errors = [];

    if (!isUpdate || data.title !== undefined) {
        if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
            errors.push("Title is required");
        } else if (data.title.trim().length > 150) {
            errors.push("Title must be 150 characters or less");
        }
    }

    if (!isUpdate || data.description !== undefined) {
        if (
            !data.description ||
            typeof data.description !== "string" ||
            !data.description.trim()
        ) {
            errors.push("Description is required");
        }
    }

    if (!isUpdate || data.category !== undefined) {
        if (!data.category || !CATEGORIES.includes(data.category)) {
            errors.push(`Category must be one of: ${CATEGORIES.join(", ")}`);
        }
    }

    if (data.priority !== undefined && !PRIORITIES.includes(data.priority)) {
        errors.push(`Priority must be one of: ${PRIORITIES.join(", ")}`);
    }

    if (data.status !== undefined && !STATUSES.includes(data.status)) {
        errors.push(`Status must be one of: ${STATUSES.join(", ")}`);
    }

    if (!isUpdate || data.requester !== undefined) {
        if (
            !data.requester ||
            typeof data.requester !== "string" ||
            !data.requester.trim()
        ) {
            errors.push("Requester is required");
        } else if (data.requester.trim().length > 100) {
            errors.push("Requester must be 100 characters or less");
        }
    }

    if (errors.length > 0) {
        throw new AppError(errors.join("; "), 400);
    }
};

const getStats = async () => {
    const [rows] = await pool.query(`
        SELECT
            COUNT(*) AS total,
            SUM(status = 'Open') AS open,
            SUM(status = 'In Progress') AS inProgress,
            SUM(status = 'Resolved') AS resolved,
            SUM(status = 'Closed') AS closed
        FROM tickets
    `);

    const stats = rows[0];

    return {
        total: Number(stats.total),
        open: Number(stats.open),
        inProgress: Number(stats.inProgress),
        resolved: Number(stats.resolved),
        closed: Number(stats.closed)
    };
};

const getAllTickets = async () => {
    const [rows] = await pool.query(`
        SELECT
            id,
            title,
            description,
            category,
            priority,
            status,
            requester,
            created_at,
            updated_at
        FROM tickets
        ORDER BY created_at DESC
    `);

    return rows;
};

const getTicketById = async (id) => {
    const [rows] = await pool.query(
        `
        SELECT
            id,
            title,
            description,
            category,
            priority,
            status,
            requester,
            created_at,
            updated_at
        FROM tickets
        WHERE id = ?
        `,
        [id]
    );

    if (rows.length === 0) {
        throw new AppError("Ticket not found", 404);
    }

    return rows[0];
};

const createTicket = async (data) => {
    validateTicketFields(data);

    const title = data.title.trim();
    const description = data.description.trim();
    const category = data.category;
    const priority = data.priority || DEFAULT_PRIORITY;
    const status = data.status || DEFAULT_STATUS;
    const requester = data.requester.trim();

    const [result] = await pool.query(
        `
        INSERT INTO tickets (title, description, category, priority, status, requester)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [title, description, category, priority, status, requester]
    );

    return getTicketById(result.insertId);
};

const updateTicket = async (id, data) => {
    validateTicketFields(data, { isUpdate: true });

    const existingTicket = await getTicketById(id);

    const updatedTicket = {
        title: data.title !== undefined ? data.title.trim() : existingTicket.title,
        description:
            data.description !== undefined
                ? data.description.trim()
                : existingTicket.description,
        category: data.category !== undefined ? data.category : existingTicket.category,
        priority: data.priority !== undefined ? data.priority : existingTicket.priority,
        status: data.status !== undefined ? data.status : existingTicket.status,
        requester:
            data.requester !== undefined ? data.requester.trim() : existingTicket.requester
    };

    await pool.query(
        `
        UPDATE tickets
        SET title = ?, description = ?, category = ?, priority = ?, status = ?, requester = ?
        WHERE id = ?
        `,
        [
            updatedTicket.title,
            updatedTicket.description,
            updatedTicket.category,
            updatedTicket.priority,
            updatedTicket.status,
            updatedTicket.requester,
            id
        ]
    );

    return getTicketById(id);
};

const deleteTicket = async (id) => {
    await getTicketById(id);

    await pool.query("DELETE FROM tickets WHERE id = ?", [id]);

    return { message: "Ticket deleted successfully" };
};

module.exports = {
    getStats,
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket
};
