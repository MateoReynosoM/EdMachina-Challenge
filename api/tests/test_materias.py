import pytest
from fastapi.testclient import TestClient
from main import app
from db import Base, engine, session_local
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

# Test the creation of a materia
def test_create_materia(db_session):
    materia_data = {
        "name": "Mathematics",
        "duration": 6  # Valid duration
    }
    response = client.post("/materias/post", json=materia_data)
    assert response.status_code == 201  # Updated to match '201 Created'
    data = response.json()
    assert data["name"] == "Mathematics"
    assert data["duration"] == 6

# Test searching for materias
def test_search_materia(db_session):
    params = {
        "name": "Mathematics"
    }
    response = client.get("/materias/get", params=params)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0  # 'items' key should contain the materias
    assert data["items"][0]["name"] == "Mathematics"

# Test updating a materia
def test_update_materia(db_session):
    # First create a materia
    materia_data = {
        "name": "Science",
        "duration": 4
    }
    create_response = client.post("/materias/post", json=materia_data)
    assert create_response.status_code == 201
    created_materia = create_response.json()

    # Now update the materia
    update_data = {
        "name": "Science Updated",
        "duration": 5
    }
    update_response = client.put(f"/materias/update/{created_materia['id']}", json=update_data)
    assert update_response.status_code == 200
    updated_materia = update_response.json()
    assert updated_materia["name"] == "Science Updated"
    assert updated_materia["duration"] == 5

# Test deleting a materia
def test_remove_materia(db_session):
    # First create a materia
    materia_data = {
        "name": "History",
        "duration": 3
    }
    create_response = client.post("/materias/post", json=materia_data)
    assert create_response.status_code == 201
    created_materia = create_response.json()

    # Now delete the materia
    delete_response = client.delete(f"/materias/delete/{created_materia['id']}")
    assert delete_response.status_code == 200

    # Try to get the deleted materia (should return 404)
    get_response = client.get(f"/materias/get", params={"name": "History"})
    assert get_response.status_code == 404