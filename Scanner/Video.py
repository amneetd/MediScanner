#!/usr/bin/python3

from picamera2 import Picamera2, Preview
from picamera2.encoders import H264Encoder  # Import the encoder you need
from Phidget22.Devices.DCMotor import DCMotor
from datetime import datetime
import time, os

# Configuration — tweak these values to adjust motor timing
spin_time = 0.25    # seconds the motor spins
stop_time = 0.5     # seconds the motor stops between cycles
num_cycles = 12     # total number of spin/stop cycles

# Setup camera for video recording
picam2 = Picamera2()
picam2.configure(picam2.create_video_configuration())
# Uncomment the next line if you wish to see a preview:
# picam2.start_preview(Preview.QTGL)
picam2.start()
time.sleep(2)  # warm‑up

# Setup motor
dc_motor = DCMotor()
dc_motor.openWaitForAttachment(5000)

# Prepare output directory for video
output_dir = "ScannedVideo"
os.makedirs(output_dir, exist_ok=True)

# Create a timestamp-based filename (using .h264 as the output format)
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
filename = os.path.join(output_dir, f"{timestamp}.h264")

# Instantiate the encoder (H264 in this case)
encoder = H264Encoder()

# Start video recording with encoder and output file specified
picam2.start_recording(encoder=encoder, output=filename)

# Perform motor cycles during the video recording
for i in range(num_cycles):
    # Spin the motor
    dc_motor.setTargetVelocity(0.11)
    time.sleep(spin_time)
    
    # Stop the motor
    dc_motor.setTargetVelocity(0)
    time.sleep(stop_time)

# Stop video recording
picam2.stop_recording()

# Shutdown motor and camera
dc_motor.close()
picam2.stop()
# If preview was started, uncomment the next line:
# picam2.stop_preview()

print(f"Done — recorded video with {num_cycles} cycles (total duration: {(spin_time+stop_time)*num_cycles} seconds).")
