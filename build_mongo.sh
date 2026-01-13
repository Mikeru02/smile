#!/bin/bash

# ===== CONFIG =====
MONGO_CONTAINER="mongodb"
MONGO_EXPRESS_CONTAINER="mongo-express"
NETWORK_NAME="mongo-net"

MONGO_ROOT_USER="tamsadmin"
MONGO_ROOT_PASS="admintams"

# ===== CHECK DOCKER =====
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed."
    echo "Install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# ===== CREATE NETWORK =====
if ! docker network ls | grep -q $NETWORK_NAME; then
    echo "Creating Docker network..."
    docker network create $NETWORK_NAME
fi

# ===== RUN MONGODB =====
if ! docker ps -a | grep -q $MONGO_CONTAINER; then
    echo "Starting MongoDB..."
    docker run -d \
        --name $MONGO_CONTAINER \
        --network $NETWORK_NAME \
        -e MONGO_INITDB_ROOT_USERNAME=$MONGO_ROOT_USER \
        -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_ROOT_PASS \
        -p 27017:27017 \
        mongo
else
    echo "MongoDB container already exists."
fi

# ===== RUN MONGO EXPRESS =====
if ! docker ps -a | grep -q $MONGO_EXPRESS_CONTAINER; then
    echo "Starting Mongo Express..."
    docker run -d \
        --name $MONGO_EXPRESS_CONTAINER \
        --network $NETWORK_NAME \
        -e ME_CONFIG_MONGODB_ADMINUSERNAME=$MONGO_ROOT_USER \
        -e ME_CONFIG_MONGODB_ADMINPASSWORD=$MONGO_ROOT_PASS \
        -e ME_CONFIG_MONGODB_SERVER=$MONGO_CONTAINER \
        -e ME_CONFIG_MONGODB_ENABLE_ADMIN=true \
        -e ME_CONFIG_BASICAUTH_USERNAME=$MONGO_ROOT_USER \
        -e ME_CONFIG_BASICAUTH_PASSWORD=$MONGO_ROOT_PASS \
        -p 8081:8081 \
        mongo-express
else
    echo "Mongo Express container already exists."
fi


echo ""
echo "✅ MongoDB is running on port 27017"
echo "✅ Mongo Express is running at: http://localhost:8081"
echo "   Username: $MONGO_ROOT_USER"
echo "   Password: $MONGO_ROOT_PASS"
