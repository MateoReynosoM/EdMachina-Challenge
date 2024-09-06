from uuid import UUID
from pydantic import BaseModel, Field
    
class Materias_base(BaseModel):
    id:UUID
    name: str
    duration: int
    
class Materias_create(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    duration: int = Field(ge=1, le=12)


class PaginatedResponse(BaseModel):
    total: int
    items: list[Materias_base]     