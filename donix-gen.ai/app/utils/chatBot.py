import os
from langchain_groq import ChatGroq
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate
from langchain.prompts import MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import trim_messages, HumanMessage
from dotenv import load_dotenv
from operator import itemgetter
import uuid

load_dotenv()

llm = ChatGroq(model=os.getenv("GROQ_MODEL"), api_key=os.getenv("GROQ_API_KEY"))

store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

def get_prompt():
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a knowledgeable and authoritative guide on organ donation and medical topics. "
                   "Your role is to provide accurate, reliable guidance on organ donation procedures, "
                   "medical conditions, and related healthcare matters. You must strictly refuse to answer any "
                   "question that is not related to organ donation or medical topics. If a question is unrelated, "
                   "respond with: 'This question is outside the scope of Donix. I cannot answer it.' "
                   "Remember past conversations to provide context-aware responses in {language}."),
        MessagesPlaceholder(variable_name="messages")
    ])
    return prompt

def get_trimmer():
    trimmer = trim_messages(
        max_tokens=900,
        strategy="last",
        token_counter=llm,
        include_system=True,
        allow_partial=False,
        start_on="human",
    )
    return trimmer

def create_chain():
    trimmer = get_trimmer()
    prompt = get_prompt()

    chain = (
        RunnablePassthrough.assign(messages=itemgetter("messages") | trimmer)
        | prompt
        | llm
    )
    return chain

def get_with_message_history():
    chain = create_chain()

    with_message_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="messages",
    )
    return with_message_history

def chat_interface(message, language="English", session_id=str(uuid.uuid4())):
    with_message_history = get_with_message_history()
    response = with_message_history.invoke(
        {
            "messages": HumanMessage(message),
            "language": language
        },
        config={"configurable": {"session_id": session_id}}
    ).content
    return response

def test_chat_function():
    test_message = "What is organ donation?"
    test_language = "English"
    test_session_id = str(uuid.uuid4())
    response = chat_interface(test_message, language=test_language, session_id=test_session_id)
    print("Test Response:", response)

if __name__ == "__main__":
    test_chat_function()
