from uuid import UUID
from fastapi import HTTPException

from db import db_dependency
from carreras.model import Carreras
from carreras.schema import Carreras_create, Carreras_base
from leads.model import Leads

def search_carreras(db: db_dependency, name: str, skip: int = 0, limit: int = 10):
    query = db.query(Carreras)

    if name:
        query = query.filter(Carreras.name.ilike(f"%{name}%"))

    carreras = query.offset(skip).limit(limit).all()
    filtered_carreras = []
    for c in carreras:
        c = Carreras_base(**c.__dict__)
        filtered_carreras.append(c)
    return filtered_carreras


def create_carrera(db: db_dependency, carrera: Carreras_create):
    carrera_in_db = db.query(Carreras).filter(Carreras.name.ilike(carrera.name)).first()
    if carrera_in_db:
        raise HTTPException(status_code=400, detail="Name already in use")
    
    db_carrera = Carreras(name=carrera.name)
    db.add(db_carrera)
    db.commit()
    db.refresh(db_carrera)
    return Carreras_base(**db_carrera.__dict__)


def update_carrera(db: db_dependency, id: UUID, carrera: Carreras_create):
    carrera_in_db = db.query(Carreras).filter(Carreras.id == id).first()
    if not carrera_in_db:
        raise HTTPException(status_code=404, detail="Carrera not found")
    
    if db.query(Carreras).filter(Carreras.name.ilike(carrera.name)).where(
        Carreras.id != carrera_in_db.id).first():
            raise HTTPException(status_code=400, detail="Name already in use")


    update_data = carrera.dict(exclude_unset=True) 
    for key, value in update_data.items():
        setattr(carrera_in_db, key, value)
    db.commit()
    db.refresh(carrera_in_db)
    return carrera_in_db  


def remove_carrera(db: db_dependency, id: UUID):
    carrera_in_db = db.query(Carreras).filter(Carreras.id == id).first()
    if not carrera_in_db:
        raise HTTPException(status_code=404, detail="Carrera not found")

    leads_asociados = db.query(Leads).filter(Leads.carrera_id == id).all()
    for lead in leads_asociados:
        lead.carrera_id = None 

    db.delete(carrera_in_db)
    db.commit()
    return carrera_in_db