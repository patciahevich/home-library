# Home Library Service

## Overview

**Home Library Service** is a RESTful API application for managing a personal library, allowing users to create, read, update, and delete records of tracks, artists, albums, and related information. The application provides basic CRUD operations and offers functionalities such as associating artists with albums and tracks, managing user accounts, and maintaining a favorites list.

## Features

- **User Management**: Create, view, update, and delete user accounts.
- **Artists, Albums, and Tracks**: Manage records for artists, albums, and tracks, with relationships between them (e.g., albums linked to artists).
- **Favorites**: Add or remove artists, albums, and tracks from a favorites list.
- **Reference Handling**: Automatically remove references in related entities when an item is deleted. For example, if an artist is deleted, the `artistId` field in related albums and tracks becomes `null`, and the artist is removed from favorites (if present).

## Requirements

- _Node.js_
- _NestJS_
- _Database_: In-memory database

## Installation

1. Clone this repository.

2. Install dependencies:

```
npm install
```

or (if it's needed)

```
npm install --legacy-peer-deps
```

3. Configure environment variables by copying `.env.example` to `.env` and updating the values as needed.

4. Open your Postgres service (using pgAdmin or by with the terminal)

5. Apply pending migrations:

```
npx prisma migrate deploy
```

6. Start the application in development mode:

```
npm start

```

N.B. if you don't want to run the APP with Docker and want to use local DB please change `POSTGRES_HOST` to `localhost` in your .env file.

## How to work with Docker

**Important note** : For work with [Docker](https://app.docker.com/) you should install this app on your local machine.

1. Build the Docker image:

```
docker-compose build
```

2. After the image has been created you can run in with the command:

```
docker-compose run
```

3. You can also see all your images and the necessary information ( name, ID, size) using :

```
docker images
```

## Another way to open the app and use it

1.  Use the command to pull the [project](https://hub.docker.com/r/volhapatsiahevich/library_service) from DockerHub and run it

```
docker pull volhapatsiahevich/library_service
```

## Using the app

After starting the app on port (_4000_ as default) you can open in your browser OpenAPI documentation by typing **http://localhost:4000/doc/**.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

The command `npx prisma studio` opens **Prisma Studio**, a powerful, web-based GUI for managing and exploring your database.
