# Postgres Database Removal and Recreation on Render

## 1. Remove and Recreate the Database on Render

### Remove the Database

1. Log in to your Render dashboard (https://dashboard.render.com).
2. Navigate to your PostgreSQL database service.
3. Click on the database you want to remove.
4. Look for the "Settings" or "Danger Zone" section.
5. Click "Delete Database" and confirm the action.
   - Warning: This will permanently delete all data in the database.

### Recreate the Database

1. In Render, go to the "Databases" section.
2. Click "Create a New Database."
3. Enter a name, select PostgreSQL, and configure options as needed.
4. Click "Create Database."
5. Note the connection details (host, port, database name, user, password) for later use.

## 2. Configure pgAdmin 4 to Connect to Render PostgreSQL

https://dashboard.render.com/d/dpg-d5kldv6r433s73euht7g-ahttps://dashboard.render.com/d/dpg-d5kldv6r433s73euht7g-aQQ

1. Download and install pgAdmin 4 (https://www.pgadmin.org/download/).
2. Open pgAdmin 4 and log in.
3. In the left sidebar, right-click "Servers" and select "Create > Server."
4. In the "General" tab, enter a name for your server (e.g., "Render Postgres").
5. In the "Connection" tab:
   - Host name/address: Use the host from Render's database details.
   - Port: Usually 5432 (or as specified by Render).
   - Maintenance database: Use the database name from Render.
   - Username: Use the user from Render.
   - Password: Use the password from Render.
6. Click "Save."
7. Expand the server in the sidebar to access your database.

## 3. Configure SQLTools Extension in VS Code for Render PostgreSQL

1. Install the SQLTools extension in VS Code:
   - Go to Extensions (Ctrl+Shift+X), search for "SQLTools," and install it.
2. Install the "SQLTools PostgreSQL/Redshift Driver" extension.
3. Click the SQLTools icon in the Activity Bar or open the Command Palette (Ctrl+Shift+P) and search for "SQLTools: Add new connection."
4. Select "PostgreSQL/Redshift."
5. Fill in the connection details:
   - Name: Any name (e.g., "Render Postgres")
   - Server/Host: Use the host from Render
   - Port: 5432 (or as specified)
   - Database: Use the database name
   - Username: Use the user
   - Password: Use the password
6. Click "Test Connection" to verify.
7. Click "Save Connection."
8. You can now run SQL queries directly from VS Code using SQLTools.

---

If you need help with any step, ask for more details.
