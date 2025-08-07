from flask import Blueprint, jsonify

test_router = Blueprint('test_router', __name__)

@test_router.route("/", methods=['GET'])
def response():
    return jsonify({
        "success": True,
        "message": "Hello from test endpoint"
    })