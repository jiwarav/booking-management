const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function getServices() {
  const response = await fetch(`${API_URL}/services`);

  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }

  return response.json();
}

export async function getAvailability(
  serviceId: number,
  date: string,
) {
  const response = await fetch(
    `${API_URL}/services/${serviceId}/availability?date=${date}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch availability');
  }

  return response.json();
}

export async function createBooking(data: {
  customerName: string;
  customerEmail: string;
  serviceId: number;
  startTime: string;
}) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? 'Failed to create booking');
  }

  return response.json();
}

export async function getBookings() {
  const response = await fetch(`${API_URL}/bookings?limit=100`);

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  return response.json();
}

export async function updateBookingStatus(
  id: string,
  status: string,
) {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? 'Failed to update booking');
  }

  return response.json();
}