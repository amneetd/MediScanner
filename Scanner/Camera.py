import os
from picamera2 import Picamera2, Preview
from Phidget22.Devices.DCMotor import DCMotor
from datetime import datetime
import time

# Configuration — tweak these values as needed
spin_time = 0.25    # seconds the motor spins before each capture
stop_time = 0.5     # seconds the motor is stopped for each photo
num_photos = 10

# Setup camera
picam2 = Picamera2()
picam2.configure(picam2.create_still_configuration({"size": (2500, 2500)}))
# picam2.start_preview(Preview.QTGL)
picam2.start()
time.sleep(2)  # warm‑up

# Setup motor
dc_motor = DCMotor()
dc_motor.openWaitForAttachment(5000)

# Prepare main output directory
output_dir = "ScannedPhotos3"
os.makedirs(output_dir, exist_ok=True)

# Determine the next medication folder number
existing_folders = [
    d for d in os.listdir(output_dir)
    if os.path.isdir(os.path.join(output_dir, d)) and d.startswith("medication")
]
if existing_folders:
    # Extract numeric part from folder names and find the max number
    folder_numbers = [int(d.replace("medication", "")) for d in existing_folders if d.replace("medication", "").isdigit()]
    next_number = max(folder_numbers) + 1 if folder_numbers else 1
else:
    next_number = 1

# Create the new medication subfolder
med_folder = os.path.join(output_dir, f"medication{next_number}")
os.makedirs(med_folder, exist_ok=True)

# Capture photos into the medication subfolder
for i in range(1, num_photos + 1):
    # Spin
    dc_motor.setTargetVelocity(0.12)
    time.sleep(spin_time)

    # Stop & capture
    dc_motor.setTargetVelocity(0)
    time.sleep(stop_time)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
    filename = os.path.join(med_folder, f"{timestamp}_{i:02d}.jpg")
    picam2.capture_file(filename)
    time.sleep(stop_time)

# Shutdown
dc_motor.close()
picam2.stop()
picam2.stop_preview()

print(f"Done — captured {num_photos} photos in folder {med_folder} with {spin_time}s spin + {stop_time}s stop each.")
