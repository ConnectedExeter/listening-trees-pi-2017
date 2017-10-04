#! /bin/bash

name=`cat /home/chrome/device.name`
myip=`hostname -i`
curl -s --form-string "token=a7KPM8JrpN7e5t7YoZf9ySS2c9dHLB" --form-string "user=3ZH0PDXgLUAFC2VZ1UG03mexj56GVf" --form-string "message=$name connected as $myip" https://api.pushover.net/1/messages.json
  
