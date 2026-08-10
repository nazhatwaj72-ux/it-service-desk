import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteTicket, getTicket } from '../api/ticketApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function formatDate(dateString) {
  if (!dateString) return '—';

  return new Date(dateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toCssClass(value) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTicket = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTicket(id);
      setTicket(data);
    } catch (err) {
      setError(err.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete Ticket #${ticket.id}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await deleteTicket(ticket.id);

      navigate('/tickets', {
        state: {
          message: `Ticket #${ticket.id} was deleted successfully.`,
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to delete ticket');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <LoadingSpinner label="Loading ticket..." />
      </section>
    );
  }

  if (!ticket) {
    return (
      <section className="page">
        <div className="page-header">
          <h1 className="page-header__title">Ticket Details</h1>
        </div>

        <ErrorMessage
          message={error || 'Ticket could not be found.'}
          onRetry={fetchTicket}
        />

        <Link to="/tickets" className="btn btn--secondary">
          Back to Tickets
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">
            Ticket #{ticket.id}
          </h1>

          <p className="page-header__subtitle">
            View ticket details and manage the request
          </p>
        </div>

        <div className="ticket-detail__actions">
          <Link
            to="/tickets"
            className="btn btn--secondary"
          >
            Back to Tickets
          </Link>

          <Link
            to={`/tickets/${ticket.id}/edit`}
            className="btn btn--primary"
          >
            Edit Ticket
          </Link>

          <button
            type="button"
            className="btn btn--danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Ticket'}
          </button>
        </div>
      </div>

      {error && (
        <ErrorMessage message={error} onRetry={fetchTicket} />
      )}

      <article className="ticket-detail">
        <div className="ticket-detail__header">
          <div>
            <span className="ticket-detail__id">
              Ticket #{ticket.id}
            </span>

            <h2 className="ticket-detail__title">
              {ticket.title}
            </h2>
          </div>

          <div className="ticket-detail__badges">
            <span
              className={`badge badge--priority badge--${toCssClass(
                ticket.priority
              )}`}
            >
              {ticket.priority}
            </span>

            <span
              className={`badge badge--status badge--${toCssClass(
                ticket.status
              )}`}
            >
              {ticket.status}
            </span>
          </div>
        </div>

        <div className="ticket-detail__body">
          <div className="ticket-detail__description">
            <h3>Description</h3>

            <p>
              {ticket.description || 'No description provided.'}
            </p>
          </div>

          <div className="ticket-detail__information">
            <div className="ticket-detail__field">
              <span>Category</span>
              <strong>{ticket.category}</strong>
            </div>

            <div className="ticket-detail__field">
              <span>Priority</span>
              <strong>{ticket.priority}</strong>
            </div>

            <div className="ticket-detail__field">
              <span>Status</span>
              <strong>{ticket.status}</strong>
            </div>

            <div className="ticket-detail__field">
              <span>Requester</span>
              <strong>{ticket.requester}</strong>
            </div>

            <div className="ticket-detail__field">
              <span>Created</span>
              <strong>{formatDate(ticket.created_at)}</strong>
            </div>

            <div className="ticket-detail__field">
              <span>Last Updated</span>
              <strong>{formatDate(ticket.updated_at)}</strong>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default TicketDetailPage;