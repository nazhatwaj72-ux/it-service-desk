import { useState, useEffect, useCallback } from 'react';
import { getTicketStats, getTickets } from '../api/ticketApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

function StatCard({ label, value, variant }) {
  return (
    <article className={`stat-card stat-card--${variant}`}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </article>
  );
}

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

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsData, ticketsData] = await Promise.all([
        getTicketStats(),
        getTickets(),
      ]);

      setStats(statsData);
      setRecentTickets(ticketsData.tickets.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <section className="page dashboard">
      <div className="page-header">
        <h2 className="page-header__title">Dashboard</h2>
        <p className="page-header__subtitle">
          Overview of support ticket activity
        </p>
      </div>

      {loading && <LoadingSpinner label="Loading dashboard..." />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
      )}

      {!loading && !error && stats && (
        <>
          <div className="dashboard__stats">
            <StatCard label="Total Tickets" value={stats.total} variant="total" />
            <StatCard label="Open" value={stats.open} variant="open" />
            <StatCard
              label="In Progress"
              value={stats.inProgress}
              variant="in-progress"
            />
            <StatCard label="Resolved" value={stats.resolved} variant="resolved" />
            <StatCard label="Closed" value={stats.closed} variant="closed" />
          </div>

          <section className="dashboard__recent" aria-labelledby="recent-tickets-heading">
            <h3 id="recent-tickets-heading" className="dashboard__section-title">
              Recent Tickets
            </h3>

            {recentTickets.length === 0 ? (
              <EmptyState
                title="No tickets yet"
                description="Support tickets will appear here once they are created."
              />
            ) : (
              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Title</th>
                      <th scope="col">Category</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Status</th>
                      <th scope="col">Requester</th>
                      <th scope="col">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td data-label="ID">#{ticket.id}</td>
                        <td data-label="Title" className="dashboard-table__title">
                          {ticket.title}
                        </td>
                        <td data-label="Category">{ticket.category}</td>
                        <td data-label="Priority">
                          <span
                            className={`badge badge--priority badge--${toCssClass(ticket.priority)}`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td data-label="Status">
                          <span
                            className={`badge badge--status badge--${toCssClass(ticket.status)}`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td data-label="Requester">{ticket.requester}</td>
                        <td data-label="Created">{formatDate(ticket.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default DashboardPage;
