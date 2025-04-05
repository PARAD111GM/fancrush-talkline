#!/usr/bin/env python3
import sys
import http.server
import socketserver
import urllib.request
import urllib.error
import json

PORT = 3001
TARGET_HOST = "http://localhost:54323"

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Forward the request to the target server
            target_url = f"{TARGET_HOST}{self.path}"
            print(f"Proxying request to: {target_url}")
            
            req = urllib.request.Request(target_url)
            
            # Copy headers from the incoming request
            for header in self.headers:
                if header.lower() != 'host':
                    req.add_header(header, self.headers[header])
            
            response = urllib.request.urlopen(req)
            
            # Send the response code
            self.send_response(response.status)
            
            # Send headers
            for header in response.headers:
                self.send_header(header, response.headers[header])
            
            # Add CORS headers
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, apikey')
            
            self.end_headers()
            
            # Send the body
            self.wfile.write(response.read())
            
        except urllib.error.URLError as e:
            print(f"Error proxying request: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_message = json.dumps({"error": str(e)})
            self.wfile.write(error_message.encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, apikey')
        self.end_headers()

def run_server():
    with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
        print(f"Serving proxy on port {PORT}")
        print(f"Forwarding to {TARGET_HOST}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Stopping server...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server() 