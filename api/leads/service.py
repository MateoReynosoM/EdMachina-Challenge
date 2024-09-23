from uuid import UUID
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import joinedload


from db import db_dependency
from typing import Optional, List
from leads.model import Leads, LeadsMaterias
from carreras.model import Carreras
from materias.model import Materias
from personas.model import Personas
from leads.schema import Leads_base, Leads_create

def search_leads(db: db_dependency, id: Optional[UUID] = None, persona_id: Optional[UUID] = None, skip: int = 0,  limit: int = 10):
    query = db.query(Leads).options(
        joinedload(Leads.materias).joinedload(LeadsMaterias.materia) 
    )
    
    if id:
        query = query.filter(Leads.id == id)
    elif persona_id:
        query = query.filter(Leads.persona_id == persona_id)
    
    leads = query.offset(skip).limit(limit).all()
    
    filtered_leads = []
    for lead in leads:
        materias_details = [
            {
                'year_of_inscription': lm.year_of_inscription,
                'attendance_times': lm.attendance_times,
                'materia_id': lm.materia_id
            }
            for lm in lead.materias
        ]
        
        filtered_lead = Leads_base(
            id=lead.id,
            persona_id=lead.persona_id,
            materias_ids=materias_details,
            carrera_id=lead.carrera_id
        )
        
        filtered_leads.append(filtered_lead)
    
    return filtered_leads

def create_lead(db: db_dependency, lead: Leads_create):
    validar_datos(db, lead)


    db_lead = Leads(
        persona_id=lead.persona_id,
        carrera_id=lead.carrera_id,
    )


    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)


    for materia_data in lead.materias_ids:
        materia = db.query(Materias).filter(Materias.id == materia_data.materia_id).first()
        if materia:
            db_lead_materia = LeadsMaterias(
                lead_id=db_lead.id,
                materia_id=materia_data.materia_id,
                year_of_inscription=materia_data.year_of_inscription,
                attendance_times=materia_data.attendance_times
            )
            db.add(db_lead_materia)
        else:
            raise HTTPException(status_code=404, detail=f"Materia with ID {materia_data.materia_id} not found")

    db.commit()
    db.refresh(db_lead)

    return {"id": db_lead.id, "message": "Lead created successfully"}

def update_lead(db: db_dependency, lead_id: UUID, lead_data: Leads_create):
    lead_in_db = db.query(Leads).filter(Leads.id == lead_id).first()
    
    if not lead_in_db:
        raise HTTPException(status_code=404, detail="Lead not found")

    validar_datos(db, lead_data)

    lead_in_db.persona_id = lead_data.persona_id
    lead_in_db.carrera_id = lead_data.carrera_id

    existing_materias = db.query(LeadsMaterias).filter(LeadsMaterias.lead_id == lead_id).all()
    for materia in existing_materias:
        db.delete(materia)

    for materia_data in lead_data.materias_ids:
        materia = db.query(Materias).filter(Materias.id == materia_data.materia_id).first()
        if materia:
            db_lead_materia = LeadsMaterias(
                lead_id=lead_in_db.id,
                materia_id=materia_data.materia_id,
                year_of_inscription=materia_data.year_of_inscription,
                attendance_times=materia_data.attendance_times
            )
            db.add(db_lead_materia)
        else:
            raise HTTPException(status_code=404, detail=f"Materia with ID {materia_data.materia_id} not found")

    db.commit()
    db.refresh(lead_in_db)

    return {"id": lead_in_db.id, "message": "Lead updated successfully"}



def validar_datos(db: db_dependency, lead: Leads_create):
    persona = db.query(Personas).filter(Personas.id == lead.persona_id).first()
    materias_ids = [materia.materia_id for materia in lead.materias_ids]
    materia = db.query(Materias).filter(Materias.id.in_(materias_ids)).all()
    carrera = db.query(Carreras).filter(Carreras.id == lead.carrera_id).first()

    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    if not materia:
        raise HTTPException(status_code=404, detail="One or more Materias not found")
    if not carrera:
        raise HTTPException(status_code=404, detail="Carrera not found")


def remove_lead(db: db_dependency, id: int):
    lead_in_db = db.query(Leads).filter(Leads.id == id).first()
    
    if not lead_in_db:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead_materias = db.query(LeadsMaterias).filter(LeadsMaterias.lead_id == id).all()
    
    for lead_materia in lead_materias:
        db.delete(lead_materia)
    
    db.delete(lead_in_db)
    db.commit()
    
    return lead_in_db
