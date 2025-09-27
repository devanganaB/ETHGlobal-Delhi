from uagents import Agent, Context, Model
import json
from hyperon import MeTTa
from metta.codingrag import CodingRAG
from metta.knowledge import initialize_knowledge_graph

local = Agent( 
    name="local",
    seed="secret_seed_phrase_xxxxxx",
    port=8000,
    mailbox=True
    )

class Message(Model):
    message: str

class ResMessage(Model):
    # message: str
    topic: str
    requirements: list[str]
    description: str
    test_cases: list
    hidden_cases: list

SERVER_ADDR = "agent1qgrh82rawn4mzn05wzdslyg9e6arfn5e0x5uy0lrhcl05g2kk8v2geg8fs4"  

# setup MeTTa and RAG
metta = MeTTa()
initialize_knowledge_graph(metta)
rag = CodingRAG(metta)

available_topics = rag.query_topics()
all_topics = []
for topic in available_topics:
    all_topics.append(topic.lower())
# arr = ["array", "string", "hashset", "hashmap", "linkedlist"]

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


def build_prompt(topic: str) -> ResMessage:
    """Use CodingRAG to validate topic and build structured prompt JSON."""
    
    if topic.lower() not in available_topics:
        raise ValueError(f"Invalid topic: {topic}. Must be one of {available_topics}")

    requirements = rag.get_requirements()
   
    prompt = f"""
        You are an AI that generates coding interview questions.  

        Your task: Generate a coding question for the topic: {topic}.  

        The output must strictly follow this JSON structure and nothing else.  
        Do not include explanations, comments, or any extra text outside the JSON.

        {{
        "topic": "{topic}",
        "requirements": {json.dumps(requirements, indent=2)},
        "description": "Generate a coding interview question with constraints and examples.",
        "test cases": [
            {{"input": "<sample input 1>", "output": "<expected output 1>"}},
            {{"input": "<sample input 2>", "output": "<expected output 2>"}}
        ],
        "hidden cases": [
            {{"input": "<hidden input 1>", "output": "<expected output 1>"}},
            {{"input": "<hidden input 2>", "output": "<expected output 2>"}}
        ]
    }}
    """
    return prompt.strip()

# async def send_query(ctx: Context):
@local.on_rest_get("/rest/get", Message)
async def handle_query(ctx: Context) -> ResMessage:
    topic = "array"

    try:
        structured_prompt = build_prompt(topic)
    except ValueError as e:
        ctx.logger.error(str(e))
        return str(e)

    query_msg = Message(message=structured_prompt)
    ctx.logger.info("Received GET request")
    reply, status = await ctx.send_and_receive(SERVER_ADDR, query_msg, response_type=Message)
    if isinstance(reply, Message):
        ctx.logger.info(f"Received awaited response: {reply.message}")
        try:
            result_json = json.loads(reply.message)
            # Now you have a dict/list, not a raw string
            # return ResMessage(message=json.dumps(result_json, indent=2))
            return ResMessage(
                topic=result_json.get("topic"),
                requirements=result_json.get("requirements"),
                description=result_json.get("description"),
                test_cases=result_json.get("test cases"),
                hidden_cases=result_json.get("hidden cases")
            )
        except json.JSONDecodeError:
            ctx.logger.error("Hosted agent did not return valid JSON")
            # return ResMessage(message="Error: Invalid JSON received")
            return ResMessage(
                topic=topic,
                requirements=[],
                description="Error parsing response",
                test_cases=[],
                hidden_cases=[]
            )
    else:
        ctx.logger.info(f"Failed to receive response: {status}")
    

if __name__ == "__main__":
    local.run()