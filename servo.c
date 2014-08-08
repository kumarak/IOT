/* servo.c */
#include <stdio.h>
#include <unistd.h>
#include <pigpio.h>

#define SERVO_GPIO 18

int main(int argc, char *argv[])
{
   int i;

   if (gpioInitialise()<0) 
   {
      printf("gpiInitialize failed");
      return 1; /* init failed */
   }
   //gpioSetPWMfrequency(SERVO_GPIO, 50);
   //freq = gpioGetPWMfrequency(SERVO_GPIO);
   //printf("PWM frequency: %d\n", freq);
   gpioSetMode(SERVO_GPIO, PI_OUTPUT);
   //gpioPWM(SERVO_GPIO, 255);

   i = 2000;   
   printf("left: %d\n", i);
   gpioServo(SERVO_GPIO, i);
   usleep(1000000);

   i = 1000;   
   printf("right: %d\n", i);
   gpioServo(SERVO_GPIO, i);
   usleep(2000000);

   gpioTerminate();
}
