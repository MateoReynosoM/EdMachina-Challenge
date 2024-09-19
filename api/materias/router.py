from uuid import UUID
from fastapi import APIRouter, Query, status

from db import db_dependency
from materias.schema import *
from materias.service import *

router_materias = APIRouter(
    tags=['Materias'],
    prefix='/materias' 
)

@router_materias.get('/get', response_model=PaginatedResponse)
async def get_materias(
    db: db_dependency,
    name: str = None,
    skip: int = Query(0, ge=0),  
    limit: int = Query(30, le=100) 
):
    total_count = db.query(Materias).count()
    materias = search_materias(db, name, skip, limit)
    if not materias:
        raise HTTPException(status_code=404, detail="Materia not found")
    return PaginatedResponse(total=total_count, items=materias)

@router_materias.post('/post', response_model=Materias_base, status_code=status.HTTP_201_CREATED)
async def post_materia(
    db: db_dependency, 
    materia: Materias_create
):
    return create_materia(db, materia)


@router_materias.put('/update/{id}', response_model=Materias_base) 
async def put_materia(
    db: db_dependency, 
    id: UUID, 
    materia: Materias_create
):
    return update_materia(db, id, materia)


@router_materias.delete('/delete/{id}', response_model=Materias_base)
async def delete_materia(
    db: db_dependency, 
    id: UUID
): 
    return remove_materia(db, id)

