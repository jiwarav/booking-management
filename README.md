# Booking Management System

A full-stack booking management system for staff to create bookings, view scheduled bookings, check service availability, and update booking statuses.

## Tech Stack

### Backend

* NestJS
* TypeScript
* PostgreSQL
* Prisma ORM
* REST API
* class-validator / class-transformer
* Jest

### Frontend

* Next.js
* TypeScript
* React

### Infrastructure & DevOps

* Docker
* Docker Compose
* GitHub Actions

## Features

* View available services
* Create customer bookings
* Check service availability by date
* View bookings with pagination and filtering
* Update booking status
* Prevent booking conflicts
* Booking status transitions:

  * `PENDING`
  * `CONFIRMED`
  * `COMPLETED`
  * `CANCELLED`
* PostgreSQL database with Service–Booking relationship
* Unit tests for backend services and controllers
* Dockerized development/runtime environment
* Continuous integration with GitHub Actions

## Project Structure
 ```
booking-management/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── bookings/
│   │   │   ├── dto/
│   │   │   ├── bookings.controller.ts
│   │   │   ├── bookings.service.ts
│   │   │   └── bookings.module.ts
│   │   ├── services/
│   │   │   ├── services.controller.ts
│   │   │   ├── services.service.ts
│   │   │   └── services.module.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── bookings/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── compose.yaml
└── README.md
```

## Database

The system uses PostgreSQL with Prisma.

### Service

| Field      | Type    |
| ---------- | ------- |
| `id`       | Integer |
| `name`     | String  |
| `duration` | Integer |

Services are treated as predefined data and are not managed through the application UI.

### Booking

| Field           | Type          |
| --------------- | ------------- |
| `id`            | UUID          |
| `customerName`  | String        |
| `customerEmail` | String        |
| `serviceId`     | Integer       |
| `startTime`     | DateTime      |
| `endTime`       | DateTime      |
| `status`        | BookingStatus |
| `createdAt`     | DateTime      |
| `updatedAt`     | DateTime      |

`Booking.serviceId` references `Service.id`.

## Running with Docker

Docker Compose runs the complete application stack:

```text
Next.js
   │
   ▼
NestJS REST API
   │
   ▼
PostgreSQL
```

### Requirements

* Docker
* Docker Compose

### Start the application

From the project root:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker compose ps
```

The services are exposed at:

* Frontend: `http://localhost:3001`
* Backend API: `http://localhost:3000`
* PostgreSQL: `localhost:5432`

### Stop the application

```bash
docker compose down
```

To also remove the PostgreSQL volume:

```bash
docker compose down -v
```

> Removing the volume deletes the PostgreSQL data stored by Docker.

## Running Without Docker

### Backend

```bash
cd backend
npm ci
npx prisma generate
npm run start:dev
```

The API runs on:

```text
http://localhost:3000
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

The frontend runs on the Next.js development server.

## Database Setup

The development PostgreSQL database can be started with Docker Compose:

```bash
docker compose up -d postgres
```

Run Prisma migrations:

```bash
cd backend
npx prisma migrate deploy
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Seed the predefined services:

```bash
npx prisma db seed
```

## REST API

### Services

Get all services:

```http
GET /services
```

Example:

```json
[
  {
    "id": 1,
    "name": "Haircut",
    "duration": 60
  }
]
```

Check availability for a service on a specific date:

```http
GET /services/:id/availability?date=YYYY-MM-DD
```

Example:

```http
GET /services/1/availability?date=2026-08-27
```

Example response:

```json
[
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00"
]
```

### Bookings

Create a booking:

```http
POST /bookings
```

The booking request contains:

```json
{
  "customerName": "Ziel",
  "customerEmail": "ziel@example.com",
  "serviceId": 1,
  "startTime": "2026-08-27T10:00:00.000Z"
}
```

The service duration is used to determine the booking's `endTime`.

Get bookings:

```http
GET /bookings
```

The booking list supports pagination and filtering.

The response uses the following structure:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 9,
    "totalPages": 1
  }
}
```

Update a booking status:

```http
PATCH /bookings/:id/status
```

Example:

```json
{
  "status": "CONFIRMED"
}
```

Supported statuses:

```text
PENDING
CONFIRMED
COMPLETED
CANCELLED
```

## Booking Availability

Availability is generated from the service duration and business hours.

Current business hours:

```text
09:00 - 17:00
```

Existing bookings are checked for overlapping time ranges. Cancelled bookings do not block availability.

For example, a 120-minute service produces slots such as:

```text
09:00
11:00
13:00
15:00
```

while a 60-minute service can produce:

```text
09:00
10:00
11:00
12:00
13:00
14:00
15:00
16:00
```

## Validation

The API validates incoming booking data using NestJS `ValidationPipe`.

Validation includes:

* Customer name must be provided
* Customer email must be a valid email address
* Service ID must be a positive integer
* Start time must be a valid ISO 8601 datetime

Unknown request properties are removed through the `whitelist` validation option.

## Testing

Backend unit tests use Jest.

Run the test suite:

```bash
cd backend
npm test -- --runInBand
```

Current test coverage includes:

* `BookingsService`
* `BookingsController`
* `ServicesService`
* `ServicesController`

The test suite currently contains 10 passing tests.

## Continuous Integration

GitHub Actions runs automatically on pushes to `main` and pull requests targeting `main`.

The CI workflow:

1. Installs backend dependencies
2. Generates the Prisma Client
3. Runs backend unit tests
4. Builds the backend
5. Installs frontend dependencies
6. Builds the frontend

This helps ensure that changes pushed to the repository remain testable and buildable.

## Docker Architecture

Docker Compose contains three services:

```text
┌──────────────────────┐
│      Frontend        │
│      Next.js         │
│      :3001           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       Backend        │
│       NestJS         │
│       :3000          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      PostgreSQL      │
│       :5432          │
└──────────────────────┘
```

PostgreSQL data is persisted through the `postgres_data` Docker volume.

## Development Notes

The application uses separate frontend and backend applications so that the REST API can be developed and tested independently from the user interface.

Services are predefined database records as required by the assessment and therefore do not have management functionality in the application.

Booking availability is calculated dynamically from service duration and existing bookings rather than storing individual time slots.

## License

This project was created as a technical assessment project.
