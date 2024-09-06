from uuid import UUID
from fastapi import HTTPException

from db import db_dependency
from personas.model import Personas
from personas.schema import Personas_base, Personas_create

def search_personas(db: db_dependency, name: str, first_name: str, dni: int, skip: int = 0, limit: int = 10 ):
    query = db.query(Personas)
    if name:
        query = query.filter(Personas.name.ilike(f"%{name}%"))
    if first_name:
        query = query.filter(Personas.first_name.ilike(f"%{first_name}%"))
    if dni:
        query = query.filter(Personas.dni == dni)

    personas = query.offset(skip).limit(limit).all()
    filtered_personas = []
    for p in personas:
        p = Personas_base(**p.__dict__)
        filtered_personas.append(p)
    return filtered_personas


def create_persona(db: db_dependency, persona: Personas_create):
    if db.query(Personas).filter(Personas.dni == persona.dni).first():
        raise HTTPException(status_code=400, detail="DNI already in use")
    db_persona = Personas(**persona.dict(exclude_unset=True))
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
    return Personas_base(**db_persona.__dict__)


def update_persona(db: db_dependency, id: UUID, persona: Personas_create):
    persona_in_db = db.query(Personas).filter(Personas.id == id).first()
    if not persona_in_db:
        raise HTTPException(status_code=404, detail="Persona not found")
    
    if db.query(Personas).filter(Personas.dni == persona.dni).filter(Personas.id != id).first():
        raise HTTPException(status_code=400, detail="DNI already in use")
    
    update_data = persona.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(persona_in_db, key, value)
    db.commit()
    db.refresh(persona_in_db)
    return persona_in_db


def remove_persona(db: db_dependency, id: UUID):
    persona_in_db = db.query(Personas).filter(Personas.id == id).first()
    if not persona_in_db:
        raise HTTPException(status_code=404, detail="Persona not found")

    db.delete(persona_in_db)
    db.commit()
    return persona_in_db