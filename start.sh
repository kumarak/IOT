# start node server
node app.js &

#mjpg_streamer -i "input_file.so -f ./pics -n 2014_07_24_21_58_47_picture_000000000.jpg" -o "/usr/lib/output_http.so -p 8080 -w /home/pi/mjpg-streamer-code-182/mjpg-streamer/www" -o "output_file.so -f ./pics -d 15000" && fg

# start streaming server
mjpg_streamer -i "/usr/lib/input_uvc.so -d /dev/video0 -n -r 640x480 -f 10" -o "/usr/lib/output_http.so -p 8080 -w /home/pi/mjpg-streamer-code-182/mjpg-streamer/www" -o "output_file.so -f ./pics -d 15000" && fg
