#!/bin/sh
sudo modprobe bcm2835-v4l2
v4l2-ctl --overlay=1
./start.sh
