from uuid import UUID
from fastapi import HTTPException
from db import db_dependency
from materias.model import Materias
from materias.schema import Materias_create, Materias_base

def search_materias(db: db_dependency, name: str, skip: int = 0, limit: int = 10):
    query = db.query(Materias)
    if name:
        query = query.filter(Materias.name.ilike(f"%{name}%"))

    materias = query.offset(skip).limit(limit).all()
    filtered_materias = []
    
    for m in materias:
        m = Materias_base(**m.__dict__)
        filtered_materias.append(m)
    return filtered_materias


def create_materia(db: db_dependency, materia: Materias_create):
    materia_in_db = db.query(Materias).filter(Materias.name.ilike(materia.name)).first()
    if materia_in_db:
        raise HTTPException(status_code=400, detail="Name already in use")
    
    db_materia = Materias(**materia.dict(exclude_unset=True))
    db.add(db_materia)
    db.commit()
    db.refresh(db_materia)
    return Materias_base(**db_materia.__dict__)


def update_materia(db: db_dependency, id: UUID, materia: Materias_create):
    materia_in_db = db.query(Materias).filter(Materias.id == id).first()
    if not materia_in_db:
        raise HTTPException(status_code=404, detail="Materia not found")
    
    if db.query(Materias).filter(Materias.name.ilike(materia.name)).where(
        Materias.id != materia_in_db.id).first():
            raise HTTPException(status_code=400, detail="Name already in use")

    update_data = materia.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(materia_in_db, key, value)
    db.commit()
    db.refresh(materia_in_db)
    return materia_in_db  


def remove_materia(db: db_dependency, id: UUID):
    materia_in_db = db.query(Materias).filter(Materias.id == id).first()
    if not materia_in_db:
        raise HTTPException(status_code=404, detail="Materia not found")

    db.delete(materia_in_db)
    db.commit()
    return materia_in_db