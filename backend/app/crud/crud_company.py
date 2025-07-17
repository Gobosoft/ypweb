from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Company, Project, User
from schemas import CompanyCreate
from core.utils.types import CompanyStatus

def create_company(db: Session, data: CompanyCreate) -> Company:
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing = db.query(Company).filter(Company.business_id == data.business_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Company with this business_id already exists")

    coordinator_id = None
    status = CompanyStatus.UNRESERVED

    if data.coordinator_name:
        coordinator = db.query(User).filter(User.name == data.coordinator_name).first()
        if coordinator:
            coordinator_id = coordinator.id
            status = CompanyStatus.RESERVED
        else:
            raise HTTPException(status_code=404, detail="Coordinator not found")

    # Luodaan yritys
    company = Company(
        name=data.name,
        business_id=data.business_id,
        display_name=data.display_name or data.name,
        booth_size=data.booth_size,
        special_requests=data.special_requests,
        status=status.value,
        project_id=data.project_id,
        coordinator_id=coordinator_id,
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company
