#!/bin/bash

echo "Waiting for Kong to start..."
until curl -s http://kong:8001/; do
  sleep 2
done
echo "Setting up RabbitMQ WebSocket Service in Kong..."

# Delete routes and services for a fresh start
echo "Removing any existing routes..."
curl -s -X DELETE http://kong:8001/routes/rabbitmq-ws-route
sleep 1
echo "Removing any existing services..."
curl -s -X DELETE http://kong:8001/services/rabbitmq-ws
sleep 1

# Create a service for RabbitMQ WebSocket
echo "Creating RabbitMQ WebSocket service..."
curl -i -X POST http://kong:8001/services \
  --data name=rabbitmq-ws \
  --data url=http://rabbitmq:15675/ws

# Add a route with proper WebSocket configuration
echo "Creating route to the service..."
curl -i -X POST http://kong:8001/services/rabbitmq-ws/routes \
  --data "paths[]=/mqtt-ws" \
  --data "protocols[]=http" \
  --data "protocols[]=https" \
  --data name=rabbitmq-ws-route

echo "Kong configuration completed!"