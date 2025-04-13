from flask import Blueprint, render_template
from flask import request, jsonify
from app.utils.imageReader import get_extracted_text,answer_from_image_text
from app.utils.chatBot import chat_interface
from app.utils.recoveryRoutine import predict_recovery_score, generate_recovery_plan, get_feedback_history, load_user_history, retrieve_similar_cases
from app.utils.recoveryRoutine import store_user_history
import uuid
main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "Flask Application is running!"

@main.route("/image-reader")
def image_reader():
    return render_template("imageReader.html")

@main.route("/image-reader", methods=["POST"])
def image_reader_post():
    if "image" not in request.files:
        return jsonify({'message': 'No image uploaded'}), 400

    image_blob = request.files["image"].read()
    
    try:
        extracted_text = get_extracted_text(image_blob)
        
        if not extracted_text:
            return jsonify({'message': 'No text found in the image'}), 400
        
        answer_from_image_text_response = answer_from_image_text("What is the image about?", extracted_text)
        
        return jsonify({
            'extracted_text': extracted_text,
            'answer_from_image_text': answer_from_image_text_response
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error processing the image: {str(e)}'}), 500
    
@main.route("/donix-chat")
def donix_chat():
    return render_template("chatBot.html")

@main.route("/ask-question", methods=["POST"])
def ask_question():
    question = request.json.get("question")
    language = request.json.get("language", "English")
    
    if not question:
        return jsonify({"error": "Question is required"}), 400
    
    response = chat_interface(question, language=language, session_id=str(uuid.uuid4()))
    if not response:
        return jsonify({"error": "No response from chat interface"}), 500

    res = {
        "question": question,
        "language": language,
        "answer": f"{response}",
    }
    
    return jsonify(res), 200

@main.route("/recovery-routine", methods=["GET", "POST"])
def recovery_routine():
    if request.method == "POST":
        heart_rate = request.form.get("heart_rate")
        bp = request.form.get("bp")
        oxygen_saturation = request.form.get("oxygen_saturation")
        symptoms = request.form.get("symptoms")
        feedback = request.form.get("feedback")

        data = {
            "heart_rate": heart_rate,
            "bp": bp,
            "oxygen_saturation": oxygen_saturation,
            "symptoms": symptoms,
        }
        score = predict_recovery_score(data)
        store_user_history(data, score, feedback)
        feedback_history = get_feedback_history()
        user_history = load_user_history()
        similar_cases = retrieve_similar_cases(data)
        plan = generate_recovery_plan(score, feedback_history, user_history, similar_cases)

        return render_template("recoveryRoutine.html", score=score, plan=plan, submitted=True)

    return render_template("recoveryRoutine.html", submitted=False)