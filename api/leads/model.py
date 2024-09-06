
import uuid
from uuid import UUID
from sqlalchemy import Column, Integer, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from db import Base

from personas.model import Personas
from materias.model import Materias
from carreras.model import Carreras

class LeadsMaterias(Base):
    __tablename__ = 'leads_materias'

    lead_id = Column(PGUUID(as_uuid=True), ForeignKey('leads.id', ondelete='CASCADE'), primary_key=True)
    materia_id = Column(PGUUID(as_uuid=True), ForeignKey('materias.id', ondelete='CASCADE'), primary_key=True)
    attendance_times = Column(Integer, nullable=False)
    year_of_inscription = Column(Integer, nullable=False)

    lead = relationship('Leads', back_populates='materias')
    materia = relationship('Materias', back_populates='leads')


class Leads(Base):
    __tablename__ = 'leads'

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    persona_id = Column(PGUUID(as_uuid=True), ForeignKey('personas.id'))
    carrera_id = Column(PGUUID(as_uuid=True), ForeignKey('carreras.id'))

    materias = relationship(
        'LeadsMaterias', back_populates='lead', cascade="all, delete-orphan"
    )


