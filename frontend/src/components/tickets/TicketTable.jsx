import { Link } from 'react-router-dom';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function toCssClass(value) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

function TicketTable({ tickets }) {
  return (
    <div className="ticket-table-wrapper">
      <table className="ticket-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Category</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col">Requester</th>
            <th scope="col">Created</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td data-label="ID">#{ticket.id}</td>

              <td data-label="Title" className="ticket-table__title">
                {ticket.title}
              </td>

              <td data-label="Category">
                {ticket.category}
              </td>

              <td data-label="Priority">
                <span
                  className={`badge badge--priority badge--${toCssClass(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
              </td>

              <td data-label="Status">
                <span
                  className={`badge badge--status badge--${toCssClass(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </td>

              <td data-label="Requester">
                {ticket.requester}
              </td>

              <td data-label="Created">
                {formatDate(ticket.created_at)}
              </td>

              <td data-label="Action">
                <Link
                  to={`/tickets/${ticket.id}`}
                  className="btn btn--secondary ticket-table__view"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;