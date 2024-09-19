import uuid
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from db import Base

class Personas(Base):
    __tablename__='personas'
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String)
    first_name = Column(String)
    dni = Column(Integer, unique=True)
    email = Column(String, unique=True)
    address = Column(String)
    phone = Column(String)