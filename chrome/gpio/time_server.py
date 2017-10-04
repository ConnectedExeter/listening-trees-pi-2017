#!/usr/bin/env python

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import json
import time
from time import strftime as timestamp


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

def getrange():
	if int(timestamp('%M')) %10 >= 5:
		return 100
	else:
		return 1


def send(value):
	message = {}
	message['range'] = value
	for conn in WSHandler.connections:
		conn.write_message(json.dumps(message))
		

#Setup Webserver
application = tornado.web.Application([
	(r"/", TestHandler),
    (r'/socket', WSHandler),
])


if __name__ == "__main__":
	http_server = tornado.httpserver.HTTPServer(application)
	http_server.listen(8888)
	tornado.ioloop.IOLoop.instance().start()
	
		
