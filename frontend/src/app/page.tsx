'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  createBooking,
  getAvailability,
  getServices,
} from '@/lib/api';
import { Service } from '@/types/booking';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  useEffect(() => {
    if (!serviceId || !date) {
      setAvailableTimes([]);
      setSelectedTime('');
      return;
    }

    setSelectedTime('');

    getAvailability(Number(serviceId), date)
      .then(setAvailableTimes)
      .catch(() => setAvailableTimes([]));
  }, [serviceId, date]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');

    if (!selectedTime) {
      setMessage('Please select an available time.');
      return;
    }

    try {
      await createBooking({
        customerName,
        customerEmail,
        serviceId: Number(serviceId),
        startTime: `${date}T${selectedTime}:00.000Z`,
      });

      setMessage('Booking created successfully.');

      setCustomerName('');
      setCustomerEmail('');
      setSelectedTime('');

      const updatedTimes = await getAvailability(
        Number(serviceId),
        date,
      );

      setAvailableTimes(updatedTimes);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Failed to create booking.',
      );
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-slate-500">
            Staff Portal
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Booking Management
          </h1>

          <p className="mt-2 text-slate-500">
            Create a new customer booking.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Create Booking
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Customer name
                </label>

                <input
                  id="customerName"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Enter customer name"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="customerEmail"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(event) =>
                    setCustomerEmail(event.target.value)
                  }
                  placeholder="customer@example.com"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="service"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Service
                </label>

                <select
                  id="service"
                  value={serviceId}
                  onChange={(event) =>
                    setServiceId(event.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">Select a service</option>

                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Date
                </label>

                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            {serviceId && date && (
              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">
                  Available times
                </p>

                {availableTimes.length === 0 ? (
                  <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    No available times for this date.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableTimes.map((time) => {
                      const selected = selectedTime === time;

                      return (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                            selected
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {message ? (
                <p
                  className={`text-sm ${
                    message.includes('successfully')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {message}
                </p>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!selectedTime}
              >
                Create Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}