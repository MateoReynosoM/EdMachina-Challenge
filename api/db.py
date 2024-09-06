from typing import Annotated
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

#* Environment variables for database credentials
db_name = os.getenv("DB_NAME")
db_pg_user = os.getenv("DB_PG_USER")
db_pg_password = os.getenv("DB_PG_PASSWORD")
test_db_name = os.getenv("DB_TEST_NAME")  # Hardcoded test DB name

#* Check if the environment is testing or not
IS_TESTING = os.getenv("TESTING", "False").lower() == "true"

#* Set the database URL based on the environment
if IS_TESTING:
    DATABASE_URL = f"postgresql://{db_pg_user}:{db_pg_password}@localhost:5432/{test_db_name}"
else:
    db_host = os.getenv("DB_HOST", "postgresdb")
    DATABASE_URL = f"postgresql://{db_pg_user}:{db_pg_password}@{db_host}:5432/{db_name}"

#* Create the engine and session
engine = create_engine(DATABASE_URL)
session_local = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

#* Function to create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

#* Dependency for getting the database session
def get_db():
    db = session_local()
    try:
        yield db
        db.commit()
    finally:
        db.close()

#* Annotated dependency for use in FastAPI routes
db_dependency = Annotated[Session, Depends(get_db)]