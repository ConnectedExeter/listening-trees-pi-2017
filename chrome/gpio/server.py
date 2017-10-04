#!/usr/bin/env python

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import json
import RPi.GPIO as GPIO
import time

input_pins=[3,5,7]

class WSHandler(tornado.websocket.WebSocketHandler):
	connections = []
	def open(self):
		print("client connected")
		self.connections.append(self)
	def on_message(self, message):
		print("message recieved")
		self.write_message('ack')
	def on_close(self):
		print("client disconnected")
	   
class TestHandler(tornado.web.RequestHandler):
	@tornado.web.asynchronous
	def get(self):
		f = open('test.html')
		file = f.read()
		f.close()
		self.content_type = 'text/html'
		self.write(file)
		self.finish()


def send(pin, value):
	message = {}
	message[pin] = value
	for conn in WSHandler.connections:
		conn.write_message(json.dumps(message))
		
		
		
def callback(pin):
	global time_stamp
	time_now = time.time()
	if (time_now - time_stamp) >= 0.3:
		if GPIO.input(pin):
			value = "HIGH"
		else:
			value = "LOW"
		print(str(pin) + " " +value  +" Detected")
		send(pin, value)
	time_stamp = time_now
	


time_stamp = time.time()
GPIO.setmode(GPIO.BOARD)
for pin in input_pins:
	GPIO.setup(pin, GPIO.IN)
	GPIO.add_event_detect(pin, GPIO.BOTH, callback=callback)

application = tornado.web.Application([
	(r"/", TestHandler),
    (r'/socket', WSHandler),
])


if __name__ == "__main__":
	http_server = tornado.httpserver.HTTPServer(application)
	http_server.listen(8888)
	tornado.ioloop.IOLoop.instance().start()
