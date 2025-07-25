from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models import CompanyContactLog
from app.schemas.contact import CompanyContactLogCreate
from uuid import UUID
from fastapi import HTTPException
from app.models import Contact
from app.schemas.contact import ContactUpdateSchema

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


async def update_contact_by_company_and_email(
    db: AsyncSession,
    company_id: UUID,
    data: ContactUpdateSchema
) -> Contact:
    result = await db.execute(
        select(Contact).where(
            Contact.company_id == company_id,
            Contact.email == data.email
        )
    )
    contact = result.scalars().first()

    if contact:
        contact.name = data.name
        contact.phone = data.phone
        contact.description = data.description
        contact.is_primary = data.is_primary
    else:
        contact = Contact(
            company_id=company_id,
            name=data.name,
            email=data.email,
            phone=data.phone,
            description=data.description,
            is_primary=data.is_primary,
        )
        db.add(contact)

    await db.commit()
    await db.refresh(contact)
    return contact

async def delete_contact_by_company_and_id(
    db: AsyncSession, company_id: UUID, contact_id: UUID
):
    result = await db.execute(
        select(Contact).filter(Contact.id == contact_id, Contact.company_id == company_id)
    )
    contact = result.scalars().first()

    if not contact:
        raise HTTPException(status_code=404, detail="Yhteyshenkilöä ei löytynyt")

    await db.delete(contact)
    await db.commit()
    