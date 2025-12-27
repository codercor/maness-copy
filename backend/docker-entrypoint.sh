#!/bin/sh

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
sleep 5

# Run seed script (it only seeds if DB is empty)
echo "Running database seed..."
node dist/seed.js || true

# Start the main application
echo "Starting application..."
exec node dist/main
