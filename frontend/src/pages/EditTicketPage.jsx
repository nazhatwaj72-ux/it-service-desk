import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTicket, updateTicket } from '../api/ticketApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const initialForm = {
  title: '',
  description: '',
  category: 'Other',
  priority: 'Medium',
  status: 'Open',
  requester: '',
};

const categories = [
  'Hardware',
  'Software',
  'Network',
  'Access',
  'Email',
  'Other',
];

const priorities = ['Low', 'Medium', 'High', 'Critical'];

const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

function EditTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchTicket = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const ticket = await getTicket(id);

      setForm({
        title: ticket.title || '',
        description: ticket.description || '',
        category: ticket.category || 'Other',
        priority: ticket.priority || 'Medium',
        status: ticket.status || 'Open',
        requester: ticket.requester || '',
      });
    } catch (err) {
      setError(err.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError(null);

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!form.description.trim()) {
      setError('Description is required.');
      return;
    }

    if (!form.requester.trim()) {
      setError('Requester is required.');
      return;
    }

    setSaving(true);

    try {
      await updateTicket(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority,
        status: form.status,
        requester: form.requester.trim(),
      });

      navigate(`/tickets/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update ticket');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <LoadingSpinner label="Loading ticket..." />
      </section>
    );
  }

  if (error && !form.title) {
    return (
      <section className="page">
        <div className="page-header">
          <h1 className="page-header__title">Edit Ticket</h1>
          <p className="page-header__subtitle">
            Update the selected support ticket
          </p>
        </div>

        <ErrorMessage message={error} onRetry={fetchTicket} />

        <Link to="/tickets" className="btn btn--secondary">
          Back to Tickets
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-header__title">Edit Ticket #{id}</h1>
        <p className="page-header__subtitle">
          Update the information for this support ticket.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <form className="ticket-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter ticket title"
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue"
            disabled={saving}
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={saving}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              disabled={saving}
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={saving}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="requester">Requester</label>
            <input
              id="requester"
              name="requester"
              type="text"
              value={form.requester}
              onChange={handleChange}
              placeholder="Requester name"
              disabled={saving}
            />
          </div>
        </div>

        <div className="ticket-form__actions">
          <Link
            to={`/tickets/${id}`}
            className="btn btn--secondary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditTicketPage;