#!/bin/bash

# Remove the build directory if it exists
if [ -d "deploy" ]; then
    rm -rf "deploy"
fi

echo "Building Application"

npm run deploy

# Create the build directory if it doesn't exist
mkdir -p "deploy"

# Copy the file to deploy directory
cp -r public deploy/public
cp -r .next/standalone/ deploy/
cp -r .next/static deploy/.next


echo "Build preparation completed."

# Check if the specified folder exists
if [ ! -d "deploy" ]; then
    echo "Error: Folder deploy not found."
    exit 1
fi

# Zip the folder
zip -r "deploy" "deploy"

# Check if the zip command was successful
if [ $? -eq 0 ]; then
    echo "Folder deploy zipped successfully."
else
    echo "Error zipping folder deploy."
fi
