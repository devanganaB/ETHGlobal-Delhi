from uagents import Agent, Context, Model

local = Agent( 
    name="local",
    seed="secret_seed_phrase_xxxxxx",
    port=8000,
    mailbox=True
    )

class Message(Model):
    message: str


SERVER_ADDR = "agent1qgrh82rawn4mzn05wzdslyg9e6arfn5e0x5uy0lrhcl05g2kk8v2geg8fs4"  

@local.on_event("startup")
async def send_query(ctx: Context):
    query_msg = Message(message="what is 2+3=?")
    await ctx.send(SERVER_ADDR, query_msg)

@local.on_message(model=Message)
async def message_handler(ctx: Context, sender:str, message: Message):
    ctx.logger.info(f"Recieved message from {sender} : {message.message}")

if __name__ == "__main__":
    local.run()