# Employee Status Management — Backend

A NestJS REST API for managing employee statuses, built with **NestJS**, **TypeORM**, and **PostgreSQL**.

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| NestJS | Backend framework |
| TypeORM | ORM |
| PostgreSQL (Neon) | Database |
| Multer | File upload handling |
| class-validator | DTO validation |
| Jest | Unit & E2E testing |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon free tier)

### Installation
```bash
npm install
```

### Environment Setup

Create a `.env` file in the root:
```env
DATABASE_URL=your_postgres_connection_string
```

### Run in development
```bash
npm run start:dev
```

API runs on **http://localhost:3000/api**

### Build for production
```bash
npm run build
npm run start:prod
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | Get all employees |
| GET | /api/employees/:id | Get employee by ID |
| POST | /api/employees | Create employee |
| PATCH | /api/employees/:id | Update employee |
| PATCH | /api/employees/:id/status | Update employee status |
| DELETE | /api/employees/:id | Delete employee |
| POST | /api/employees/:id/avatar | Upload avatar image |
| DELETE | /api/employees/:id/avatar | Remove avatar image |

---

## Employee Status Values

| Status | Value |
|--------|-------|
| Working | `Working` |
| On Vacation | `OnVacation` |
| Lunch Time | `LunchTime` |
| Business Trip | `BusinessTrip` |

---

## Project Structure
```
src/
├── employees/
│   ├── employee.entity.ts    # TypeORM entity
│   ├── employee.dto.ts       # Validation DTOs
│   ├── employees.controller.ts # REST endpoints
│   ├── employees.service.ts  # Business logic
│   ├── employees.module.ts   # Module config
│   └── employees.service.spec.ts # Unit tests
├── app.module.ts             # Root module
└── main.ts                   # Bootstrap
uploads/                      # Uploaded avatar images
```

---

## Testing

### Unit tests
```bash
npm run test
```

### E2E tests
```bash
npm run test:e2e
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:cov` | Run tests with coverage |