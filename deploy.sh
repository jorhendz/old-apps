#!/usr/bin/env bash

set -e

if git remote | grep heroku > /dev/null; then
    echo Heroku remote already exists as "`git remote get-url heroku`"
else
    echo Setting up the heroku remote
    git remote add heroku https://git.heroku.com/boernebasen.git
fi
git push heroku production:main
