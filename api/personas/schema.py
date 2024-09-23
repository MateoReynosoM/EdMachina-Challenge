from uuid import UUID
from fastapi import HTTPException
from pydantic import BaseModel, Field, EmailStr

    
class Personas_base(BaseModel):
    id: UUID
    name: str
    first_name: str
    dni: int
    email:EmailStr
    phone: str
    address: str

class Personas_update(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    first_name: str = Field(min_length=1, max_length=50)
    phone: str
    address: str = Field(min_length=1, max_length=70)
    
class Personas_create(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    first_name: str = Field(min_length=1, max_length=50)
    dni: int = Field(ge=0, le=99999999)
    email: EmailStr 
    address: str = Field(min_length=1, max_length=70)
    phone: str

class PaginatedResponse(BaseModel):
    total: int
    items: list[Personas_base]     