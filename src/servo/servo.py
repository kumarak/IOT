
# servo controller

import RPi.GPIO as GPIO
import time

def set(property, value):
	try:
		f = open("/sys/class/rpi-pwm/pwm0/"+property, 'w')
		f.write(value)
		f.close()
	except:
		print("Error writing to: "+property+"value: "+value)

def setServo(angle):
	set("servo",str(angle))



def main():
	global delay_period = 0.01
	set("delayed","0")
	set("mode", "servo")
	set("servo_max", "180")
	set("active", "1")

	while True:
		for angle in range(0, 180):
			setServo(angle)
			time.sleep(delay_period)
		for angle in range(0, 180):
			setServo(180-angle)
			time.sleep(delay_period)

if __name__ == '__main__':
	main()