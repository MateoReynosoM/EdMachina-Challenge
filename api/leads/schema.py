from uuid import UUID
from pydantic import BaseModel

    
class Leads_Materias_create(BaseModel):
    year_of_inscription: int
    attendance_times: int 
    materia_id:UUID
    
class Leads_base(BaseModel):
    id:UUID
    persona_id: UUID 
    materias_ids: list[Leads_Materias_create] 
    carrera_id: UUID 

class Leads_delete(BaseModel):
    id:UUID
    persona_id: UUID 
    carrera_id: UUID 

class Leads_create(BaseModel):
    persona_id: UUID 
    materias_ids: list[Leads_Materias_create] 
    carrera_id: UUID 

class PaginatedResponse(BaseModel):
    total: int
    items: list[Leads_base]