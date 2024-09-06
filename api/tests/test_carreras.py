import pytest
from fastapi.testclient import TestClient
from main import app
from db import Base, engine, session_local
from carreras.schema import Carreras_create

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

# Test the creation of a carrera
def test_create_carrera(db_session):
    carrera_data = {
        "name": "Engineering"
    }
    response = client.post("/carreras/post", json=carrera_data)
    assert response.status_code == 201  # Updated to match '201 Created'
    data = response.json()
    assert data["name"] == "Engineering"

# Test searching for carreras
def test_search_carrera(db_session):
    params = {
        "nombre": "Engineering"
    }
    response = client.get("/carreras/get", params=params)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0  # 'items' key should contain the carreras
    assert data["items"][0]["name"] == "Engineering"

# Test updating a carrera
def test_update_carrera(db_session):
    # First create a carrera
    carrera_data = {
        "name": "Business"
    }
    create_response = client.post("/carreras/post", json=carrera_data)
    assert create_response.status_code == 201
    created_carrera = create_response.json()

    # Now update the carrera
    update_data = {
        "name": "Business Updated"
    }
    update_response = client.put(f"/carreras/update/{created_carrera['id']}", json=update_data)
    assert update_response.status_code == 200
    updated_carrera = update_response.json()
    assert updated_carrera["name"] == "Business Updated"

# Test deleting a carrera
def test_remove_carrera(db_session):
    # First create a carrera
    carrera_data = {
        "name": "Arts"
    }
    create_response = client.post("/carreras/post", json=carrera_data)
    assert create_response.status_code == 201
    created_carrera = create_response.json()

    # Now delete the carrera
    delete_response = client.delete(f"/carreras/delete/{created_carrera['id']}")
    assert delete_response.status_code == 200

    # Try to get the deleted carrera (should return 404)
    get_response = client.get("/carreras/get", params={"nombre": "Arts"})
    assert get_response.status_code == 404
