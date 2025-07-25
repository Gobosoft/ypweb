from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import CompanyContactLog
from app.schemas.contact import CompanyContactLogCreate
from uuid import UUID

async def add_contact_note(
    db: AsyncSession, data: CompanyContactLogCreate, user_id: UUID
) -> CompanyContactLog:
    stmt = select(CompanyContactLog).where(
        CompanyContactLog.company_id == data.company_id,
        CompanyContactLog.user_id == user_id
    )

    result = await db.execute(stmt)
    existing_note = result.scalars().first()

    if existing_note:
        existing_note.text = data.text
        existing_note.contact_status = data.contact_status
        await db.commit()
        await db.refresh(existing_note)
        return existing_note
    else:
        new_note = CompanyContactLog(
            text=data.text,
            company_id=data.company_id,
            user_id=user_id,
            contact_status=data.contact_status,
        )
        db.add(new_note)
        await db.commit()
        await db.refresh(new_note)
        return new_note
    