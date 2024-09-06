import uuid
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from db import Base

class Materias(Base):
    __tablename__='materias'
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, unique=True)
    duration = Column(Integer)

    leads = relationship(
        'LeadsMaterias', back_populates='materia', cascade="all, delete-orphan"
    )