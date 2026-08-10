const API_BASE = '/api/tickets';

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export async function getTickets(filters = {}) {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set('status', filters.status);
  }

  if (filters.priority) {
    params.set('priority', filters.priority);
  }

  if (filters.category) {
    params.set('category', filters.category);
  }

  if (filters.search) {
    params.set('search', filters.search);
  }

  const query = params.toString();

  const response = await fetch(
    query ? `${API_BASE}?${query}` : API_BASE
  );

  return handleResponse(response);
}

export async function getTicket(id) {
  const response = await fetch(`${API_BASE}/${id}`);

  return handleResponse(response);
}

export async function createTicket(ticket) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticket),
  });

  return handleResponse(response);
}

export async function updateTicket(id, ticket) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticket),
  });

  return handleResponse(response);
}

export async function deleteTicket(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
}

export async function getTicketStats() {
  const response = await fetch(`${API_BASE}/stats`);

  return handleResponse(response);
}