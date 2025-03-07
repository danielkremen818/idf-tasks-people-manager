
#!/bin/sh
set -e

echo "Starting application container..."

# Wait for PostgreSQL to be ready
if [ -n "$POSTGRES_HOST" ]; then
  echo "Waiting for PostgreSQL at $POSTGRES_HOST to be ready..."
  
  RETRIES=5
  until pg_isready -h $POSTGRES_HOST -U $POSTGRES_USER || [ $RETRIES -eq 0 ]; do
    echo "Waiting for PostgreSQL server to be ready... $((RETRIES)) remaining attempts..."
    RETRIES=$((RETRIES-1))
    sleep 5
  done
  
  if [ $RETRIES -eq 0 ]; then
    echo "PostgreSQL not available, continuing anyway..."
  else
    echo "PostgreSQL is ready!"
  fi
fi

# Check if app needs to run as nginx or root
if [ "$1" = "nginx" ]; then
  echo "Running as nginx user..."
  exec su-exec nginx "$@"
else
  echo "Running as root user..."
  exec "$@"
fi
