import os
import shutil
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
output_dir = "ScannedMedication"
os.makedirs(output_dir, exist_ok=True)

# Delete all files (and subdirectories) in the output directory
for filename in os.listdir(output_dir):
    file_path = os.path.join(output_dir, filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)  # Remove file or link
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)  # Remove directory and its contents
    except Exception as e:
        print(f"Failed to delete {file_path}. Reason: {e}")

# Use the output directory directly (no subfolders)
med_folder = output_dir

# Capture photos directly into the output directory
for i in range(1, num_photos + 1):
    # Spin the motor
    dc_motor.setTargetVelocity(0.12)
    time.sleep(spin_time)

    # Stop the motor and capture photo
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
