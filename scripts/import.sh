#!/bin/sh

echo "Ahoy!, I'm Robo importer..."

for file in *.jpg
do
  echo "importing $file to 500x500..."
  curl --noproxy "*" -i -X POST -H "Content-Type: multipart/form-data" -F "image=@$file" http://dias94.bedrock.mft.wa.gov.au:3000/api/v1/census/avatar
done
