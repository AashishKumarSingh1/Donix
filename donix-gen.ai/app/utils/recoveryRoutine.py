import os
import json
import numpy as np
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from sentence_transformers import SentenceTransformer
import faiss

load_dotenv()
llm = ChatGroq(model=os.getenv("GROQ_MODEL"), api_key=os.getenv("GROQ_API_KEY"))

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
d = 384

if os.path.exists("user_history.index"):
    index = faiss.read_index("user_history.index")
else:
    index = faiss.IndexFlatL2(d)

def load_user_history():
    if os.path.exists("user_history.json"):
        with open("user_history.json", "r") as file:
            return json.load(file)
    return []

def store_user_history(data, score, feedback):
    history = load_user_history()
    entry = {"vitals": data, "score": score, "feedback": feedback}
    history.append(entry)

    with open("user_history.json", "w") as file:
        json.dump(history, file, indent=4)

    if feedback:
        with open("feedback.txt", "a") as file:
            file.write(f"{feedback}\n")

    embedding = embedding_model.encode(json.dumps(entry)).tolist()
    index.add(np.array([embedding], dtype=np.float32))
    faiss.write_index(index, "user_history.index")

def retrieve_similar_cases(data):
    if index.ntotal == 0:
        return []
    embedding = embedding_model.encode(json.dumps(data)).tolist()
    distances, indices = index.search(np.array([embedding], dtype=np.float32), k=3)
    history = load_user_history()
    return [history[i] for i in indices[0] if i < len(history)]

def predict_recovery_score(data):
    prompt = f"""
    Given the following patient vitals and symptoms:
    - Heart Rate: {data['heart_rate']}
    - Blood Pressure: {data['bp']}
    - Oxygen Saturation: {data['oxygen_saturation']}
    - Symptoms: {data['symptoms']}

    Predict a recovery score between 0 and 100. Only return the numeric score.
    """
    score = llm.predict(prompt).strip()
    return score

def generate_recovery_plan(score, feedback_history, user_history, similar_cases):
    prompt = f"""
    The patient has a recovery score of {score}.

    Create a personalized recovery plan considering:
    - Feedback History: {feedback_history}
    - User History: {user_history}
    - Similar Cases: {similar_cases}

    Make sure to address any feedback-related concerns and tailor the plan accordingly.
    """
    plan = llm.predict(prompt).strip()
    return plan

def get_feedback_history():
    if os.path.exists("feedback.txt"):
        with open("feedback.txt", "r") as file:
            return file.read()
    return "No feedback yet."

def test_plan():
    test_data = {
        "heart_rate": 85,
        "bp": "125/85",
        "oxygen_saturation": 96,
        "symptoms": "Mild chest pain and fatigue"
    }

    print("=== Running Health Prediction & Plan Generator ===\n")
    score = predict_recovery_score(test_data)
    print(f"[Predicted Recovery Score]: {score}\n")

    feedback = "Feeling better after medication."
    store_user_history(test_data, score, feedback)

    feedback_history = get_feedback_history()
    user_history = load_user_history()
    similar_cases = retrieve_similar_cases(test_data)

    plan = generate_recovery_plan(score, feedback_history, user_history, similar_cases)
    print("[Generated Recovery Plan]:\n", plan)

if __name__ == "__main__":
    test_plan()
