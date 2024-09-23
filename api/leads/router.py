from uuid import UUID
from fastapi import APIRouter, Query, status

from db import db_dependency
from leads.schema import *
from leads.service import *

router_leads = APIRouter(
    tags=['Leads'],
    prefix='/leads' 
)

@router_leads.get('/get', response_model=PaginatedResponse)
async def get_leads(
    db: db_dependency,
    id: Optional[UUID] = Query(None),
    persona_id: Optional[UUID] = Query(None),
    skip: int = Query(0, ge=0),  
    limit: int = Query(30, le=100)  
):
    total_count = db.query(Leads).count()
    leads = search_leads(db, id, persona_id, skip, limit)
    if not leads:
        raise HTTPException(status_code=404, detail="Leads not found")
    return PaginatedResponse(total=total_count, items=leads)


    
@router_leads.post('/post', status_code=status.HTTP_201_CREATED)
async def post_lead(
    db: db_dependency, 
    lead: Leads_create
):
    return create_lead(db, lead)

@router_leads.put('/update/{id}')
async def put_lead(
    db: db_dependency, 
    id: UUID,
    lead: Leads_create
):
    return update_lead(db, id, lead)


@router_leads.delete('/delete/{id}', response_model=Leads_delete)
async def delete_lead(
    db: db_dependency, 
    id: UUID
): 
    return remove_lead(db, id)

