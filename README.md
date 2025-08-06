# note-organizer-1189-1198

## Database & ORM

This project uses **Sequelize** ORM with a PostgreSQL backend.  
The schema includes models for:

- **User**: Account and authentication (email, hashed password).
- **Note**: Belongs to user, contains title/content.
- **Tag**: Can be attached to many notes.
- **NoteTag**: Association table for note-tag many-to-many.

### Required Environment Variables

Add a `.env` file (see [.env.example](notes_app_backend/.env.example)):
```
DATABASE_URL=postgres://username:password@hostname:5432/database
NODE_ENV=development
PORT=3000
```
**Example**:  
`DATABASE_URL=postgres://postgres:example@localhost:5432/notes_app`

### Migrations

To initialize (sync) the database tables:
```
cd notes_app_backend
node src/models/migrate.js
```
or  
On server start, the app will attempt to sync the tables using Sequelize.
