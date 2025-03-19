#!/usr/bin/python3

import os
import time
from datetime import datetime
from picamera2 import Picamera2, Preview

# Create the main Calibration folder if it doesn't exist
calibration_dir = "Calibration"
os.makedirs(calibration_dir, exist_ok=True)

# Determine the next test folder name inside Calibration
existing_tests = [
    d for d in os.listdir(calibration_dir)
    if os.path.isdir(os.path.join(calibration_dir, d)) and d.startswith("Test")
]
if existing_tests:
    # Extract the numeric part and increment it
    test_numbers = [int(d.replace("Test", "")) for d in existing_tests if d.replace("Test", "").isdigit()]
    next_test_number = max(test_numbers) + 1 if test_numbers else 1
else:
    next_test_number = 1

test_folder = os.path.join(calibration_dir, f"Test{next_test_number}")
os.makedirs(test_folder, exist_ok=True)
print(f"Saving images in: {test_folder}")

# Setup the camera
picam2 = Picamera2()
#picam2.start_preview(Preview.QTGL)  # Optional preview; comment out if not needed

# Use a still image configuration
config = picam2.create_still_configuration({"size": (2500, 2500)})
picam2.configure(config)
picam2.start()
time.sleep(2)  # Warm‑up time for the camera

# Capture 3 still photos and save them in the test folder
for i in range(1, 4):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
    filename = os.path.join(test_folder, f"{timestamp}_img{i:02d}.jpg")
    picam2.capture_file(filename)
    print(f"Captured image: {filename}")
    time.sleep(0.5)  # Short delay between captures

# Shutdown the camera
picam2.stop()
picam2.stop_preview()

print("Test capture complete.")
