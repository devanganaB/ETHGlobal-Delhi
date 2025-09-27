# flask.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from uagents.query import query
from uagents import Model
import os, json
from dotenv import load_dotenv

load_dotenv()

class QueryMessage(Model):
    message: str

class ResponseMessage(Model):
    message: str

app = Flask(__name__)
CORS(app)

server_address = "agent1qgrh82rawn4mzn05wzdslyg9e6arfn5e0x5uy0lrhcl05g2kk8v2geg8fs4"

@app.route("/")
def home():
    return "Welcome to the Coding Question Generator API!"

@app.route("/api/generate", methods=["GET"])
async def generate_question():
    user_message = request.args.get("prompt", "What 5+4=?")

    # Send query to server agent
    response = await query(
        destination=server_address,
        message=QueryMessage(message=user_message),
        timeout=60.0
    )

    print("Raw response:", response)

    # decode structured ResponseMessage
    # data = json.loads(response.decode_payload())
    return jsonify(response)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
