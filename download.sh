#!/bin/bash

URL="https://github.com/Edit-Mr/emfont/archive/90e67a91574a62cfb44cbf0f86c8c679aa6fc865.zip"
FILE="fonts.zip"

while true; do
    wget -O "$FILE" "$URL"
    if [ $? -eq 0 ]; then
        echo "Download succeeded!"
        break
    else
        echo "Download failed. Retrying in 5 seconds..."
        sleep 5
    fi
done

