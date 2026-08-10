import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketApi';
import TicketForm from '../components/tickets/TicketForm';

function CreateTicketPage() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(ticketData) {
    setSubmitting(true);
    setError(null);

    try {
      const createdTicket = await createTicket(ticketData);

      navigate(`/tickets/${createdTicket.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create ticket.');
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-header__title">Create Ticket</h1>

        <p className="page-header__subtitle">
          Submit a new support request.
        </p>
      </header>

      <section className="ticket-form-card">
        {error && (
          <div className="ticket-form__server-error" role="alert">
            {error}
          </div>
        )}

        <TicketForm
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </section>
    </section>
  );
}

export default CreateTicketPage;