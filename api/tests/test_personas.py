import pytest
from fastapi.testclient import TestClient
from main import app
from db import Base, engine, session_local
from personas.schema import Personas_create

client = TestClient(app)

# Set up the database and create tables for testing
@pytest.fixture(scope="module", autouse=True)
def setup_and_teardown():
    Base.metadata.create_all(bind=engine)  # Create the tables
    yield
    Base.metadata.drop_all(bind=engine)  # Drop tables after tests

@pytest.fixture(scope="function")
def db_session():
    session = session_local()
    try:
        yield session
    finally:
        session.close()

# Test the creation of a persona
def test_create_persona(db_session):
    persona_data = {
        "name": "John",
        "first_name": "Doe",
        "dni": 12345678,
        "email": "john.doe@example.com",
        "phone": "123456789",  # Optional but provided here
        "address": "123 Main St"  # Required field in schema
    }
    response = client.post("/personas/post", json=persona_data)
    assert response.status_code == 201  # Updated to match '201 Created'
    data = response.json()
    assert data["dni"] == 12345678
    assert data["name"] == "John"

# Test updating a persona
def test_update_persona(db_session):
    # First create a persona
    persona_data = {
        "name": "Jane",
        "first_name": "Doe",
        "dni": 87654321,
        "email": "jane.doe@example.com",
        "phone": "987654321",  # Optional field
        "address": "456 Main St"  # Required field in schema
    }
    create_response = client.post("/personas/post", json=persona_data)
    assert create_response.status_code == 201
    created_persona = create_response.json()

    # Now update the persona
    update_data = {
        "name": "Jane Updated",
        "first_name": "Doe Updated",
        "dni": 87654321,
        "email": "jane.updated@example.com",
        "phone": "987654321",
        "address": "456 Updated St"
    }
    update_response = client.put(f"/personas/update/{created_persona['id']}", json=update_data)
    assert update_response.status_code == 200
    updated_persona = update_response.json()

