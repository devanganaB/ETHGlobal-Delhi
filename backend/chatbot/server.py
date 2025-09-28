# server.py
import os, json, requests
from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
from utils import get_leetcode_data  # your function

API_KEY  = "sk_61b3b6aa66604925b3245baf4b12dfb0d164c3bbf43d4a35bd41d9c5efa2626f"
BASE_URL = "https://api.asi1.ai/v1/chat/completions"
MODEL = "asi1-mini"

app = FastAPI()

# Allow frontend (React, Next.js, etc.) to call this API
# app.add_middleware(

#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

get_leetcode_tool = {
    "type": "function",
    "function": {
        "name": "get_leetcode_data",
        "description": "Get Leetcode data for user by users username.",
        "parameters": {
            "type": "object",
            "properties": {"username": {"type": "string"}},
            "required": ["username"]
        }
    }
}

user_sessions = {}

@app.post("/chat/{session_id}")
async def chat_endpoint(session_id: str, req: Request):
    body = await req.json()
    user_message = body.get("message", "")

    # Step 1: Send user msg → model
    messages = user_sessions.get(session_id, [])
    if(len(messages) == 0):
        messages = [{"role": "user", "content": user_message}]
        user_sessions.update({session_id: messages})
        resp1 = requests.post(
            BASE_URL,
            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
            json={"model": MODEL, "messages": messages, "tools": [get_leetcode_tool]},
        ).json()

        choice = resp1["choices"][0]["message"]

        # Step 2: If no tool call, return answer
        if "tool_calls" not in choice:
            return {"reply": choice["content"]}

        # Step 3: Execute tool
        tool_call = choice["tool_calls"][0]
        args = json.loads(tool_call["function"]["arguments"])
        leetcode_data = get_leetcode_data(**args)

        # Step 4: Send tool result back to model
        assistant_msg = {"role": "assistant", "content": "", "tool_calls": [tool_call]}
        tool_result_msg = {
            "role": "tool",
            "tool_call_id": tool_call["id"],
            "content": json.dumps({"data": leetcode_data})
        }

        messages += [assistant_msg, tool_result_msg]
        user_sessions.update({session_id: messages})

    resp2 = requests.post(
        BASE_URL,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={"model": MODEL, "messages": messages, "tools": [get_leetcode_tool]},
    ).json()

    final_answer = resp2["choices"][0]["message"]["content"]
    return {"reply": final_answer}
