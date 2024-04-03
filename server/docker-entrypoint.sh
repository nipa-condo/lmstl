#!/bin/bash

set -o errexit

echo "Docker Entrtypoint"

case "$1" in
  dbmigrate)
    set -- yarn typeorm:run
  ;;
  *)
    set -- yarn start:prod
  ;;
esac

exec "$@"