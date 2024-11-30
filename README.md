# Brian Clanker Frontend

This is the frontend repository for the Brian Clanker project. It is built using Next.js, TypeScript, and Tailwind CSS. The project integrates various libraries and services such as Drizzle ORM, Prisma, and Privy for authentication.

## Table of Contents

- [Brian Clanker Frontend](#brian-clanker-frontend)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [Scripts](#scripts)
  - [Folder Structure](#folder-structure)
  - [Dependencies](#dependencies)
  - [License](#license)

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/mmatteo23/brian-clanker-fe.git
   cd brian-clanker-fe
   ```

2. **Install dependencies:**

   ```sh
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the necessary environment variables as described in the [Environment Variables](#environment-variables) section.

4. **Run the development server:**

   ```sh
   yarn dev
   ```

   The application will be available at `http://localhost:3000`.

## Environment Variables

The following environment variables are required for the project:

- `TURSO_DATABASE_URL`: The URL for the Turso database.
- `TURSO_AUTH_TOKEN`: The authentication token for the Turso database.
- `APP_URL`: The URL of the application.
- `IMAGE_WORKER_SECRET`: The secret for the images worker.

Example `.env` file:

```env
TURSO_DATABASE_URL=your-database-url
TURSO_AUTH_TOKEN=your-auth-token
APP_URL=http://localhost:3000
IMAGE_WORKER_SECRET=your-secret
```

## Scripts

The following scripts are available in the project:

- `yarn dev`: Runs the development server.
- `yarn build`: Builds the application for production.
- `yarn start`: Starts the production server.
- `yarn lint`: Runs ESLint to check for linting errors.
- `yarn db:generate`: Generates the Drizzle ORM schema.
- `yarn db:migrate`: Runs database migrations.
- `yarn db:studio`: Opens the Drizzle ORM studio.
- `yarn db:push`: Pushes the database schema to the database.
- `yarn db:pull`: Pulls the database schema from the database.

## Folder Structure

The project has the following folder structure:

- `src/`: Contains the source code for the application.
  - `components/`: Contains React components.
  - `utils/`: Contains utility functions and modules.
  - `app/`: Contains Next.js pages and API routes.
  - `styles/`: Contains global styles.
- `scripts/`: Contains custom scripts for development and build processes.
- `migrations/`: Contains database migration files.

## Dependencies

The project uses the following main dependencies:

- `next`: The Next.js framework.
- `react`: The React library.
- `tailwindcss`: The Tailwind CSS framework.
- `drizzle-orm`: The Drizzle ORM library.
- `prisma`: The Prisma ORM library.
- `@privy-io/react-auth`: The Privy authentication library.
- `@libsql/client`: The LibSQL client library.

For a complete list of dependencies, refer to the `package.json` file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
