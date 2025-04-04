#!/bin/bash

# The base name is the number passed as argument and the extension is .html
base_name=$1
slide_name=$2
extension=".html"

# Check if the file with the given name already exists
if [[ -f "dist/client/text/$slide_name/$base_name$extension" ]]; then
  # If the file exists, start renaming the existing files
  counter=$base_name
  while [[ -f "dist/client/text/$slide_name/$((counter + 1))$extension" ]]; do
    ((counter++))
  done

#   echo $counter
#   exit 1
  # Rename all existing files
  for ((i = counter; i >= base_name; i--)); do
    mv "dist/client/text/$slide_name/$i$extension" "dist/client/text/$slide_name/$((i + 1))$extension"
  done
fi

# Create the new file at the original position
touch "dist/client/text/$slide_name/$base_name$extension"
echo "File $base_name$extension created."
