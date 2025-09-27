from uagents import Agent, Context, Model
import json

local = Agent( 
    name="local",
    seed="secret_seed_phrase_xxxxxx",
    port=8000,
    mailbox=True
    )

class Message(Model):
    message: str

class ResMessage(Model):
    message: str

SERVER_ADDR = "agent1qgrh82rawn4mzn05wzdslyg9e6arfn5e0x5uy0lrhcl05g2kk8v2geg8fs4"  

arr = ["array", "string", "hashset", "hashmap", "linkedlist"]

prompt = '''
You are an AI that generates coding interview questions.  
The topics are: Array, String, HashSet, HashMap, LinkedList.  

Your task: Generate a coding question for one of these topics.  
The output must strictly follow the JSON structure below:

[{
  "topic": "<topic name here>",
  "description": "<the coding question in detail>",
  "test cases": [
    {"input": "<sample input 1>", "output": "<expected output 1>"},
    {"input": "<sample input 2>", "output": "<expected output 2>"}
  ],
  "hidden cases": [
    {"input": "<hidden input 1>", "output": "<expected output 1>"},
    {"input": "<hidden input 2>", "output": "<expected output 2>"}
  ]
}]

Requirements:
- Always pick a topic from the given list.  
- Write a clear and well-defined coding question.  
- Provide **at least 2 public test cases** with both input and output.  
- Provide **at least 2 hidden test cases** with both input and output.  
- Ensure the JSON is valid and properly formatted.  
'''

# def create_prompt(index: int) -> str:
#     topic = arr[index % len(arr)]
#     detailed_prompt = prompt.replace("<topic name here>", topic)
#     return detailed_prompt

# @local.on_event("startup")
# async def send_query(ctx: Context):
@local.on_rest_get("/rest/get", Message)
async def handle_query(ctx: Context) -> str:
    query_msg = Message(message=prompt)
    ctx.logger.info("Received GET request")
    reply, status = await ctx.send_and_receive(SERVER_ADDR, query_msg, response_type=Message)
    if isinstance(reply, Message):
        ctx.logger.info(f"Received awaited response: {reply.message}")
    else:
        ctx.logger.info(f"Failed to receive response: {status}")
    

if __name__ == "__main__":
    local.run()