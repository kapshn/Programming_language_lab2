import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import os


class FolderHTTPRequestHandler(BaseHTTPRequestHandler):
	def do_GET(self):
		if (self.path == '/favicon.ico'): return
		if (self.path=='/'):
			self.path='/FolderHTML.html'
		temp = self.path.split('?')
		path = temp[0]
		cwd = os.getcwd() + path 
		if os.path.splitext(cwd)[1] == '.html':
			f = open(cwd,'rb')
			self.send_response(200)
			self.send_header('Content-type','text/html')
			self.end_headers()
			self.wfile.write(f.read())
			return
		if os.path.splitext(cwd)[1] == '.css':
			f = open(cwd,'rb')
			self.send_response(200)
			self.send_header('Content-type','text/css')
			self.end_headers()
			self.wfile.write(f.read())
			return
		if os.path.splitext(cwd)[1] == '.js':
			f = open(cwd,'rb')
			self.send_response(200)
			self.send_header('Content-type','application/javascript')
			self.end_headers()
			self.wfile.write(f.read())
			return
		if len(temp) == 1:
			query = ''
		else:
			query = temp[1]
			temp_2 = query.split('=')
			query_name = temp_2[0]
			query_param = temp_2[1]
			if query_name == 'createdir':
				os.mkdir(cwd+'/'+query_param)
			if query_name == 'deletedir':
				os.rmdir(cwd+'/'+query_param,dir_fd=None)
		jsonarray = []
		self.send_response(200)
		if os.path.isfile(cwd):
			f = open(cwd,'rb')
			self.send_header('content-disposition','attachment') 
			self.end_headers()
			self.wfile.write(f.read())
		else:
			self.send_header('content-type','application/json')
			for listitem in os.listdir(cwd):
				listitem_path = os.path.join(cwd,listitem)
				json_string = {'Name':os.path.basename(listitem_path),'Size':os.stat(listitem_path).st_size}
				if os.path.isfile(listitem_path):
					json_string.update(Type='file')
				else:
					json_string.update(Type='folder')
					if os.listdir(listitem_path):
						json_string.update(isEmpty='false')
					else:
						json_string.update(isEmpty='true')
				jsonarray.append(json_string)
			self.end_headers()
			self.wfile.write(bytes(json.dumps(jsonarray), 'utf-8'))

PORT = 8080

httpd = HTTPServer(("",PORT), FolderHTTPRequestHandler)

print("serving at port", PORT)
httpd.serve_forever()