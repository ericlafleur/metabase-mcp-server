#!/bin/bash

# Docker run script for Metabase MCP Server
# Usage: ./docker-run.sh

# Check if required environment variables are set
if [ -z "$METABASE_URL" ]; then
    echo "Error: METABASE_URL environment variable is required"
    echo "Please set it with: export METABASE_URL=https://your-metabase-instance.com"
    exit 1
fi

if [ -z "$METABASE_API_KEY" ] && [ -z "$METABASE_USERNAME" ]; then
    echo "Error: Authentication credentials are required"
    echo "Please set either:"
    echo "  export METABASE_API_KEY=your_api_key"
    echo "Or:"
    echo "  export METABASE_USERNAME=your_username"
    echo "  export METABASE_PASSWORD=your_password"
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t mcp-metabase-server .

if [ $? -ne 0 ]; then
    echo "Docker build failed!"
    exit 1
fi

# Prepare environment variables for Docker
ENV_VARS="-e METABASE_URL=$METABASE_URL"

if [ -n "$METABASE_API_KEY" ]; then
    ENV_VARS="$ENV_VARS -e METABASE_API_KEY=$METABASE_API_KEY"
fi

if [ -n "$METABASE_USERNAME" ]; then
    ENV_VARS="$ENV_VARS -e METABASE_USERNAME=$METABASE_USERNAME"
fi

if [ -n "$METABASE_PASSWORD" ]; then
    ENV_VARS="$ENV_VARS -e METABASE_PASSWORD=$METABASE_PASSWORD"
fi

# Run the container
echo "Starting MCP Metabase Server..."
docker run -it --rm $ENV_VARS mcp-metabase-server