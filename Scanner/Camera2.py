#!/usr/bin/python3

import os
import time
from picamera2 import Picamera2, Preview

# Create the Calibration2 folder if it doesn't exist
calibration_dir = "Calibration2"
os.makedirs(calibration_dir, exist_ok=True)

# Determine next image number based on existing images in Calibration2
existing_images = [
    f for f in os.listdir(calibration_dir)
    if f.startswith("distance") and f.endswith(".jpg")
]
if existing_images:
    numbers = []
    for filename in existing_images:
        # Extract numeric part from filename: remove 'distance' prefix and '.jpg' suffix
        num_part = filename[len("distance"):filename.rfind(".")]
        if num_part.isdigit():
            numbers.append(int(num_part))
    next_image_number = max(numbers) + 1 if numbers else 1
else:
    next_image_number = 1

image_filename = os.path.join(calibration_dir, f"distance{next_image_number}.jpg")
print(f"Saving image in: {image_filename}")

# Setup the camera
picam2 = Picamera2()
# Uncomment the following line to enable preview if desired
# picam2.start_preview(Preview.QTGL)

# Use a still image configuration
config = picam2.create_still_configuration({"size": (2592, 2592)})
picam2.configure(config)
picam2.start()
time.sleep(2)  # Warm‑up time for the camera

# Capture one still photo and save it
picam2.capture_file(image_filename)
print(f"Captured image: {image_filename}")

# Shutdown the camera
picam2.stop()
picam2.stop_preview()

print("Capture complete.")
