#!/bin/sh

echo "Ahoy!, I'm Robo converter..."

echo "Creating Outlook, Intranet and ID Card Directories..."
mkdir -p "96x96"
mkdir -p "500x500"
mkdir -p "2362x2362"

echo "Resizing Photos to 'Outlook' Dimensions..."

for file in *.jpg
do
  echo "converting $file to 96x96..."
  convert $file -gravity Center -crop 2362x2362+0+0 -resize 96x96^ +repage 96x96/$file
done

echo "Resizing Photos to 'Intranet' Dimensions..."

for file in *.jpg
do
  echo "converting $file to 500x500..."
  convert $file -gravity Center -crop 2362x2362+0+0 -resize 500x500^ +repage 500x500/$file
done

echo "Resizing Photos to 'ID Card' Dimensions..."

for file in *.jpg
do
  echo "Cropping $file..."
  convert $file -gravity Center -crop 2362x2362+0+0 +repage 2362x2362/$file
done
