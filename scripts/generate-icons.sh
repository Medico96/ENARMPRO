#!/bin/bash

# ================================================================
# Generate PWA Icons from a single source image
# ================================================================

# Requires ImageMagick: brew install imagemagick

SOURCE="public/logo.png"
SIZES=(72 96 128 144 152 192 384 512)

echo "🎨 Generating PWA icons..."

if [ ! -f "$SOURCE" ]; then
    echo "❌ Source image not found: $SOURCE"
    echo "Please create a 1024x1024 PNG logo first"
    exit 1
fi

for size in "${SIZES[@]}"; do
    echo "Generating ${size}x${size}..."
    convert "$SOURCE" -resize "${size}x${size}" "public/icon-${size}x${size}.png"
done

echo "✓ All icons generated!"
