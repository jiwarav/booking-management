'use client';

import { useEffect, useState } from 'react';

import {
  getBookings,
  updateBookingStatus,
} from '@/lib/api';

import { Booking } from '@/types/booking';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadBookings() {
    try {
      setLoading(true);
      setError('');

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
      setError('');

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

  function getStatusClasses(status: Booking['status']) {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200';

      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';

      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-500">
            Loading bookings...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-slate-500">
            Staff Portal
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Bookings
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage customer bookings.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {bookings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-slate-900">
                No bookings found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                New bookings will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Service
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Schedule
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {booking.customerName}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          {booking.customerEmail}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">
                          {booking.service.name}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          {booking.service.duration} min
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div>
                          {formatDateTime(booking.startTime)}
                        </div>

                        <div className="mt-1 text-slate-400">
                          to {formatDateTime(booking.endTime)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          disabled={updatingId === booking.id}
                          onChange={(event) =>
                            handleStatusChange(
                              booking.id,
                              event.target.value as Booking['status'],
                            )
                          }
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none transition disabled:cursor-wait disabled:opacity-50 ${getStatusClasses(
                            booking.status,
                          )}`}
                        >
                          <option value="PENDING">
                            PENDING
                          </option>

                          <option value="CONFIRMED">
                            CONFIRMED
                          </option>

                          <option value="COMPLETED">
                            COMPLETED
                          </option>

                          <option value="CANCELLED">
                            CANCELLED
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}