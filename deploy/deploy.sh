#!/usr/bin/env bash

# Collator - Intranet data API - Node.js
#------------------------------------------------------------------------------
# Simple Continuous Delivery script for keeping DIAS94 environment up to date
# with latest Git pushes.
# Runs on DIAS94 fired by a Git post-receive hook in repo
# inside /home/admin/repositories.
#------------------------------------------------------------------------------

set -e
oldrev=$1
newrev=$2

FILES_CHANGED=`git diff $oldrev $newrev --diff-filter=ACDMR --name-only | wc -l`

echo "$(tput -Tansi setaf 1)Files changed: $FILES_CHANGED$(tput -Tansi sgr 0)"

REPO_DIR="$(pwd)"
APP_ROOT_DIR=/opt/app/collator
PM2_APP_PROCESS_FILE=process.json

echo "$(tput -Tansi setaf 6)Installing required Node modules with 'npm install'...$(tput -Tansi sgr 0)"
npm install
npm run build

# Any other installation bits here

echo "$(tput -Tansi setaf 3)Running rsync to copy changes into app directory...$(tput -Tansi sgr 0)"
rsync --recursive --verbose --links --checksum --delete --exclude-from=deploy/rsync-exclude $REPO_DIR/ $APP_ROOT_DIR/

# Test if PM2 reloaded
# Set hot reloading?

echo "$(tput -Tansi setaf 3)Gracefully restarting the API with PM2...$(tput -Tansi sgr 0)"
# startOrReload will gracefully reload or restart or start the process.
pm2 startOrReload $APP_ROOT_DIR/$PM2_APP_PROCESS_FILE

cd $REPO_DIR
echo "$(tput -Tansi setaf 2; tput -Tansi bold)Deployment to $(tput -Tansi setaf 1)SIT$(tput -Tansi setaf 2) completed.$(tput -Tansi sgr 0)"
