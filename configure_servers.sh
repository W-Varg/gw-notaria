#!/bin/bash

# Script to configure staging and production servers
# Run this after starting containers

echo "Configuring staging server..."

# Copy .env to staging shared
docker cp /home/dev/Documents/restringida/ucb/notaria/backend-ntr/.env staging-server:/var/www/backend-ntr/shared/.env

# Generate SSH key if not exists
if [ ! -f ~/.ssh/id_rsa ]; then
  ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
fi

# Copy SSH key to staging
docker cp ~/.ssh/id_rsa.pub staging-server:/home/deploy/.ssh/authorized_keys
docker exec staging-server chown deploy:deploy /home/deploy/.ssh/authorized_keys

echo "Configuring production server..."

# Copy .env to prod shared
docker cp /home/dev/Documents/restringida/ucb/notaria/backend-ntr/.env prod-server:/var/www/backend-ntr/shared/.env

# Copy SSH key to prod
docker cp ~/.ssh/id_rsa.pub prod-server:/home/deploy/.ssh/authorized_keys
docker exec prod-server chown deploy:deploy /home/deploy/.ssh/authorized_keys

echo "Servers configured. SSH key added."