import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTickets } from '../api/ticketApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

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

function formatDate(dateString) {
  if (!dateString) return '—';

  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function toCssClass(value) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

function TicketListPage() {
  const location = useLocation();

  const [tickets, setTickets] = useState([]);

  // What is currently typed in the search box
  const [searchInput, setSearchInput] = useState('');

  // Search/filter values actually sent to the backend
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ''
  );

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTickets(filters);
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSearchChange(event) {
    setSearchInput(event.target.value);
  }

  function handleSearch() {
    setFilters((previous) => ({
      ...previous,
      search: searchInput.trim(),
    }));
  }

  function handleSearchKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  }

  function clearFilters() {
    setSearchInput('');

    setFilters({
      search: '',
      status: '',
      priority: '',
      category: '',
    });
  }

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.priority ||
    filters.category;

  return (
    <section className="page">
      <div className="page-header page-header--with-action">
        <div>
          <h1 className="page-header__title">All Tickets</h1>

          <p className="page-header__subtitle">
            Search, filter, and manage support tickets
          </p>
        </div>

        <Link
          to="/tickets/new"
          className="btn btn--primary"
        >
          Create Ticket
        </Link>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <section className="ticket-filters">
        <div className="ticket-search">
          <label htmlFor="search">
            Search
          </label>

          <div className="ticket-search__controls">
            <input
              id="search"
              type="search"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search title, description, or requester..."
            />

            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        <div className="ticket-filter-group">
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="ticket-filter-group">
          <label htmlFor="priority">
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
          >
            <option value="">All Priorities</option>

            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="ticket-filter-group">
          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn--secondary ticket-filters__clear"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </section>

      {loading && (
        <LoadingSpinner label="Loading tickets..." />
      )}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={fetchTickets}
        />
      )}

      {!loading && !error && tickets.length === 0 && (
        <EmptyState
          title={
            hasActiveFilters
              ? 'No matching tickets'
              : 'No tickets yet'
          }
          description={
            hasActiveFilters
              ? 'Try changing your search or filter criteria.'
              : 'Create a ticket to get started.'
          }
        />
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="ticket-list">
          <div className="ticket-list__summary">
            Showing {tickets.length} ticket
            {tickets.length !== 1 ? 's' : ''}
          </div>

          <div className="ticket-table-wrapper">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Requester</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td data-label="ID">
                      #{ticket.id}
                    </td>

                    <td
                      data-label="Title"
                      className="ticket-table__title"
                    >
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
                        className="ticket-table__view"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default TicketListPage;