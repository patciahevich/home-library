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

3. Configure environment variables by copying `.env.example` to `.env` and updating the values as needed.

4. Start the application in development mode:

```
npm start
```

After starting the app on port (_4000_ as default) you can open in your browser OpenAPI documentation by typing **http://localhost:4000/doc/**.
For more information about OpenAPI/Swagger please visit https://swagger.io/.
