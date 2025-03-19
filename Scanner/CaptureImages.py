from Phidget22.Phidget import *
from Phidget22.Devices.DCMotor import *
import time

def main():
    #motor does 2 full revolutions
    dcMotor0 = DCMotor()

    dcMotor0.openWaitForAttachment(5000)

    dcMotor0.setTargetVelocity(0.1)
    print("Motor started.")

    time.sleep(3.1)

    dcMotor0.setTargetVelocity(0)
    print("Motor stopped.")

    time.sleep(0.5)
    dcMotor0.close()

if __name__ == '__main__':
    main()
