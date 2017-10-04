#!/usr/bin/env python

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import json
import RPi.GPIO as GPIO
import time


class WSHandler(tornado.websocket.WebSocketHandler):
	connections = []
	def check_origin(self, origin):
		return True
	def open(self):
		print("client connected")
		self.connections.append(self)		
	def on_message(self, message):
		print("message recieved")
		range = getrange()
		send(range)
	def on_close(self):
		self.connections.remove(self)
		print("client disconnected")
	   
class TestHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		f = open('/home/chrome/gpio/test.html')
		file = f.read()
		f.close()
		self.content_type = 'text/html'
		self.write(file)
		self.finish()


def send(value):
	message = {}
	message['range'] = value
	for conn in WSHandler.connections:
		conn.write_message(json.dumps(message))
		
def getrange():
	time.sleep(0.5)
	# Send 10us pulse to trigger
	GPIO.output(GPIO_TRIGGER, True)
	time.sleep(0.00001)
	GPIO.output(GPIO_TRIGGER, False)
	start = time.time()
	while GPIO.input(GPIO_ECHO)==0:
		start = time.time()
	while GPIO.input(GPIO_ECHO)==1:
		stop = time.time()
	elapsed = stop-start
	distance = elapsed * 34300
	distance = distance / 2
	return distance
			
# Setup GPIO		
GPIO.setmode(GPIO.BCM)
GPIO_TRIGGER = 23
GPIO_ECHO    = 24
GPIO.setup(GPIO_TRIGGER,GPIO.OUT)  # Trigger
GPIO.setup(GPIO_ECHO,GPIO.IN)      # Echo
GPIO.output(GPIO_TRIGGER, False)

#Setup Webserver
application = tornado.web.Application([
	(r"/", TestHandler),
    (r'/socket', WSHandler),
])


if __name__ == "__main__":
	http_server = tornado.httpserver.HTTPServer(application)
	http_server.listen(8888)
	tornado.ioloop.IOLoop.instance().start()
	
		
