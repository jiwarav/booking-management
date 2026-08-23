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
      return;
    }

    setSelectedTime('');

    getAvailability(Number(serviceId), date)
      .then(setAvailableTimes)
      .catch(() => setAvailableTimes([]));
  }, [serviceId, date]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!selectedTime) {
      setMessage('Please select a time.');
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
    <main>
      <h1>Create Booking</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName">Customer name</label>
          <input
            id="customerName"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="customerEmail">Email</label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="service">Service</label>
          <select
            id="service"
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
            required
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
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>

        {availableTimes.length > 0 && (
          <div>
            <p>Available time</p>

            {availableTimes.map((time) => (
              <button
                type="button"
                key={time}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        )}

        <button type="submit">Create Booking</button>

        {message && <p>{message}</p>}
      </form>
    </main>
  );
}