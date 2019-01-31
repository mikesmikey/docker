#!/bin/bash

echo 'Creating application user and db'

mongo $MONGODB_DATABASE \
        --eval "db.createUser({user: '$MONGODB_USERNAME', pwd: '$MONGODB_PASSWORD', roles:[{role:'dbOwner', db: '$MONGODB_DATABASE'}]});"
        
for script in `ls -v /docker-entrypoint-initdb.d/scripts/*.json`; do 
  filename=$(basename -- "$script")
  arrIN=(${filename//./ })
  echo 'Import : ' $arrIN
  mongoimport --db $MONGODB_DATABASE --collection $arrIN --file $script --jsonArray

done;