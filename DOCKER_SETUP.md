# Docker Setup for Laravel + Angular + MySQL

## Project Structure
```
project-root/
├── backend/                 # Laravel project
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ... (Laravel files)
├── frontend/                # Angular project
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ... (Angular files)
└── docker-compose.yml
```

## Quick Start for Team Members

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Start all services
```bash
docker compose up --pull always
```

This command will:
- Pull the latest images
- Build Laravel and Angular images
- Start MySQL, Laravel, and Angular services
- Create volumes for data persistence

### 3. Access your application
- **Laravel API**: http://localhost:8000
- **Angular Frontend**: http://localhost:4200
- **MySQL**: localhost:3306 (from within containers) or 3306 externally

## Services

### MySQL Database
- **Container**: laravel_mysql
- **User**: laravel_user / laravel_password
- **Root Password**: root
- **Port**: 3306
- **Volume**: Persisted in `mysql_data` volume

### Laravel Backend
- **Container**: laravel_app
- **Port**: 8000
- **Live Code Sync**: `/backend` directory is mounted as a volume

### Angular Frontend
- **Container**: angular_app
- **Port**: 4200
- **Live Reload**: `/frontend/src` is mounted for hot reload

## Common Commands

### View logs for all services
```bash
docker compose logs -f
```

### View logs for specific service
```bash
docker compose logs -f laravel
docker compose logs -f angular_app
docker compose logs -f mysql
```

### Stop all services
```bash
docker compose down
```

### Stop and remove volumes (clean slate)
```bash
docker compose down -v
```

### Run Laravel commands inside container
```bash
docker compose exec laravel php artisan migrate
docker compose exec laravel php artisan tinker
docker compose exec laravel php artisan queue:work
```

### Run npm commands inside container
```bash
docker compose exec angular_app npm install
docker compose exec angular_app npx ng generate component my-component
```

### Access MySQL
```bash
docker compose exec mysql mysql -u laravel_user -p
# Enter password: laravel_password
```

## Development with Hot Reload

Both services support live code changes:

- **Laravel**: Edit files in `./backend` and changes reflect instantly
- **Angular**: Edit files in `./frontend/src` and changes reflect with hot reload on http://localhost:4200

No rebuild needed for code changes!

## Environment Variables

Edit `docker-compose.yml` to change:
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`
- Ports (3306, 8000, 4200)

## Sharing with Team

Team members only need:
1. Git access to the repository
2. Docker Desktop installed
3. Run `docker compose up --pull always`

Everything is containerized and self-contained!

## Troubleshooting

### Port already in use
Change ports in `docker-compose.yml`:
```yaml
ports:
  - "3307:3306"  # MySQL on 3307 instead of 3306
  - "8001:8000"  # Laravel on 8001 instead of 8000
  - "4201:4200"  # Angular on 4201 instead of 4200
```

### Database not connecting
Ensure MySQL is healthy:
```bash
docker compose ps
```
Wait for MySQL health check to pass (shows `healthy`).

### Build fails
Force rebuild:
```bash
docker compose up --build --no-cache
```
