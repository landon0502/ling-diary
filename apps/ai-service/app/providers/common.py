from app.providers.base import BaseProvider
from openai import OpenAI
from typing import List
from app.models import ChatMessage, ChatResponse
from app.models.ai_platform import AiModelConf
class CommonProviders(BaseProvider):
    def __init__(self, mode:str, provider: str, auth_url: str, api_key: str):
        self.mode = mode
        self.auth_url = auth_url
        self.provider = provider
        self.api_key = api_key
        self._client = OpenAI(
            api_key=api_key,
            base_url=auth_url,
        )
    def _generate_stream(self, messages: List[ChatMessage], **kwargs):
        response = self._client.chat.completions.create(
            model=self.mode, 
            messages = [message.model_dump() for message in messages], 
            stream= True)
        for chunk in response:
            delta = chunk.choices[0].delta
            if delta.content:
                yield {"data": delta.content}
        yield {"data":""}

    def _generate(self, messages, **kwargs):
        response = self._client.chat.completions.create(
            model=self.mode, 
            messages = [message.model_dump() for message in messages], 
            stream= False)
        return ChatResponse(
            content=response.choices[0].message.content or "",
            model=response.model,
            usage=response.usage.model_dump() if response.usage else None,
        )

