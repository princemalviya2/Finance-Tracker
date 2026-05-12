from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = "data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    
    with open(DATA_FILE, "r") as file:
        return json.load(file)

def save_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get_transactions")
def get_transactions():
    return jsonify(load_data())

@app.route("/add_transaction", methods=["POST"])
def add_transaction():

    data = load_data()

    transaction = {
        "title": request.json["title"],
        "amount": request.json["amount"],
        "type": request.json["type"]
    }

    data.append(transaction)
    save_data(data)

    return jsonify({"message": "Transaction Added"})

@app.route("/delete_transaction/<int:index>", methods=["DELETE"])
def delete_transaction(index):

    data = load_data()

    if 0 <= index < len(data):
        data.pop(index)
        save_data(data)

    return jsonify({"message": "Deleted"})

import webbrowser

if __name__ == "__main__":
    webbrowser.open("http://127.0.0.1:5000")
    app.run(debug=True)