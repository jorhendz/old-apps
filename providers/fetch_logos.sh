#!/usr/bin/env bash
set -e # please stop if you fail :)))))

SSH_HOST="linux203.unoeuro.com"
SSH_USER="boernebasen.dk"
SSH_PASS="zgt9p4y5"

REPO_NAME="Boernebasen"
REPO_URL="github.com/kaostornado/${REPO_NAME}.git"

# If changing the PAT, delete repo in Simply
GITHUB_PAT="8f61e8bd3e64417e037bff88e035e578361157d0"

SIMPLY="/var/www/boernebasen.dk"


sshpass -p ${SSH_PASS} scp -r  ${SSH_USER}@${SSH_HOST}:${SIMPLY}/app/admin/logos/ ./migration-data/
