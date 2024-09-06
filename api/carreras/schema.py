from uuid import UUID
from pydantic import BaseModel, Field
    
class Carreras_base(BaseModel):
    id:UUID
    name: str
    
class Carreras_create(BaseModel):
    name: str = Field(min_length=1, max_length=100)

class PaginatedResponse(BaseModel):
    total: int
    items: list[Carreras_base]     