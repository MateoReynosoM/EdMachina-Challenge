import pytest
import random
from fastapi.testclient import TestClient
from main import app
from db import Base, engine, session_local
from leads.schema import Leads_create, Leads_base
from personas.schema import Personas_create
from carreras.schema import Carreras_create
from materias.schema import Materias_create

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

# Helper function to create a persona
def create_persona():
    # Generate a random DNI number
    unique_dni = random.randint(10000000, 99999999)
    
    persona_data = {
        "name": "Alice",
        "first_name": "Smith",
        "dni": unique_dni,
        "email": "alice.smith@example.com",
        "address": "123 Main St",
        "phone": "1234567890"
    }
    
    response = client.post("/personas/post", json=persona_data)
    assert response.status_code == 201
    return response.json()


# Helper function to create a carrera
carrera_names = [
    "Engineering",
    "Business",
    "Arts",
    "Science",
    "Mathematics"
]

# Initialize an index to keep track of which name to use
carrera_index = 0

def create_carrera():
    global carrera_index

    # Use the current name from the list
    carrera_name = carrera_names[carrera_index]
    
    # Move to the next index
    carrera_index = (carrera_index + 1) % len(carrera_names)
    
    carrera_data = {
        "name": carrera_name
    }
    response = client.post("/carreras/post", json=carrera_data)
    assert response.status_code == 201
    return response.json()

# Helper function to create a materia
# Define a list of materia names to use
materia_names = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science"
]

# Initialize an index to keep track of which name to use
materia_index = 0

def create_materia():
    global materia_index

    # Use the current name from the list
    materia_name = materia_names[materia_index]
    
    # Move to the next index
    materia_index = (materia_index + 1) % len(materia_names)
    
    materia_data = {
        "name": materia_name,
        "duration": 6  # Or any other duration logic you want to use
    }
    response = client.post("/materias/post", json=materia_data)
    assert response.status_code == 201
    return response.json()
# Test the creation of a lead
def test_create_lead():
    persona = create_persona()
    carrera = create_carrera()
    materia = create_materia()

    lead_data = {
        "persona_id": persona["id"],
        "carrera_id": carrera["id"],
        "materias_ids": [
            {
                "materia_id": materia["id"],
                "year_of_inscription": 2024,
                "attendance_times": 10
            }
        ]
    }
    response = client.post("/leads/post", json=lead_data)
    assert response.status_code == 201
    data = response.json()
    print("Create Lead Response:", data)
    assert "id" in data
    assert data["message"] == "Lead created successfully"

# Test searching for leads
def test_search_lead():
    persona = create_persona()
    carrera = create_carrera()
    materia = create_materia()

    lead_data = {
        "persona_id": persona["id"],
        "carrera_id": carrera["id"],
        "materias_ids": [
            {
                "materia_id": materia["id"],
                "year_of_inscription": 2024,
                "attendance_times": 10
            }
        ]
    }
    create_response = client.post("/leads/post", json=lead_data)
    assert create_response.status_code == 201
    lead_id = create_response.json().get("id")

    # Search for the lead
    response = client.get(f"/leads/get?id={lead_id}")
    assert response.status_code == 200
    data = response.json()
    print("Search Lead Response:", data)
    assert data["items"][0]["id"] == lead_id
    assert data["items"][0]["persona_id"] == persona["id"]
    assert data["items"][0]["carrera_id"] == carrera["id"]


# Test deleting a lead
def test_remove_lead():
    persona = create_persona()
    carrera = create_carrera()
    materia = create_materia()

    lead_data = {
        "persona_id": persona["id"],
        "carrera_id": carrera["id"],
        "materias_ids": [
            {
                "materia_id": materia["id"],
                "year_of_inscription": 2024,
                "attendance_times": 10
            }
        ]
    }
    create_response = client.post("/leads/post", json=lead_data)
    assert create_response.status_code == 201
    lead_id = create_response.json().get("id")

    # Now delete the lead
    delete_response = client.delete(f"/leads/delete/{lead_id}")
    assert delete_response.status_code == 200

    # Try to get the deleted lead (should return 404)
    get_response = client.get(f"/leads/get?id={lead_id}")
    assert get_response.status_code == 404
