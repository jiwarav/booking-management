'use client';

import { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus } from '@/lib/api';
import { Booking } from '@/types/booking';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadBookings() {
    try {
      setLoading(true);

      const response = await getBookings();

      setBookings(response.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load bookings.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
  id: string,
  status: Booking['status'],
) {
  try {
    setUpdatingId(id);

    await updateBookingStatus(id, status);

    await loadBookings();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : 'Failed to update booking status.',
    );
  } finally {
    setUpdatingId(null);
  }
}

  useEffect(() => {
    loadBookings();
  }, []);

  function formatDateTime(value: string) {
    return new Date(value).toLocaleString('en-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  if (loading) {
    return <main>Loading bookings...</main>;
  }

  if (error) {
    return <main>{error}</main>;
  }

  return (
    <main>
      <h1>Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Schedule</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <div>{booking.customerName}</div>
                  <small>{booking.customerEmail}</small>
                </td>

                <td>{booking.service.name}</td>

                <td>
                  {formatDateTime(booking.startTime)}
                  {' — '}
                  {formatDateTime(booking.endTime)}
                </td>

                <td>
                    <select
                        value={booking.status}
                        disabled={updatingId === booking.id}
                        onChange={(event) =>
                        handleStatusChange(
                            booking.id,
                            event.target.value as Booking['status'],
                        )
                        }
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}