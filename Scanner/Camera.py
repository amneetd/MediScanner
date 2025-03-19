#!/usr/bin/python3

from picamera2 import Picamera2, Preview
from Phidget22.Devices.DCMotor import DCMotor
from datetime import datetime
import time, os

# Configuration — tweak this value to lengthen/shorten the motor spin between photos
spin_time = 0.25    # seconds the motor spins before each capture
stop_time = 0.5    # seconds motor is stopped for each photo
num_photos = 10

# Setup camera
picam2 = Picamera2()
picam2.configure(picam2.create_still_configuration())
#picam2.start_preview(Preview.QTGL)
picam2.start()
time.sleep(2)  # warm‑up

# Setup motor
dc_motor = DCMotor()
dc_motor.openWaitForAttachment(5000)

# Prepare output directory
output_dir = "ScannedPhotos3"
os.makedirs(output_dir, exist_ok=True)

for i in range(1, num_photos + 1):
    # Spin
    dc_motor.setTargetVelocity(0.12)
    time.sleep(spin_time)

    # Stop & capture
    dc_motor.setTargetVelocity(0)
    time.sleep(stop_time)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
    filename = os.path.join(output_dir, f"{timestamp}_{i:02d}.jpg")
    picam2.capture_file(filename)
    time.sleep(stop_time)

# Shutdown
dc_motor.close()
picam2.stop()
picam2.stop_preview()

print(f"Done — captured {num_photos} photos with {spin_time}s spin + {stop_time}s stop each.")
