from sqlalchemy import (
    Column, String, Boolean, ForeignKey,
    DateTime, Text, Float, Enum as SQLEnum, Index, Date, event, Integer
)
import uuid
from sqlalchemy.orm import relationship, declarative_base, Session
from datetime import datetime, timezone
from app.core.utils.uuid_type import GUID  # Assuming this is your BINARY(16) UUID type
from app.core.utils.types import (UserRole)

Base = declarative_base()

class Company(Base):
    __tablename__ = 'companies'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    business_id = Column(String(50), unique=True, index=True)  # Y-tunnus
    booth_size = Column(String(50))
    special_requests = Column(Text)
    status = Column(String(50), index=True)
    display_name = Column(String(255), index=True)
    exhibition_year_id = Column(GUID(), ForeignKey('exhibition_years.id'), index=True)
    coordinator_id = Column(GUID(), ForeignKey('users.id'), index=True)

    exhibition_year = relationship("ExhibitionYear", back_populates="companies")
    coordinator = relationship("User", back_populates="assigned_companies")
    contacts = relationship("Contact", back_populates="company")
    comments = relationship("Comment", back_populates="company")
    orders = relationship("Order", back_populates="company")
    contract = relationship("Contract", uselist=False, back_populates="company")
    materials = relationship("Material", back_populates="company")
    arrival_info = relationship("ArrivalInfo", back_populates="company")

    __table_args__ = (
        Index('ix_company_status_display', 'status', 'display_name'),
    )


class Contact(Base):
    __tablename__ = 'contacts'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), index=True)
    email = Column(String(255))
    phone = Column(String(50))
    is_primary = Column(Boolean, default=False)
    company_id = Column(GUID(), ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="contacts")


class User(Base):
    __tablename__ = 'users'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), index=True)
    email = Column(String(120), nullable=False, unique=True)
    password_hash = Column(String(150), nullable=False)
    refresh_token = Column(String(300), index=True, nullable=True)
    role = Column(SQLEnum(UserRole, name="user_roles"), index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    assigned_companies = relationship("Company", back_populates="coordinator")


class Comment(Base):
    __tablename__ = 'comments'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    text = Column(Text)
    created_at = Column(DateTime, index=True)
    company_id = Column(GUID(), ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="comments")


class Order(Base):
    __tablename__ = 'orders'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    product_name = Column(String(255), index=True)
    price = Column(Float)
    company_id = Column(GUID(), ForeignKey('companies.id'), index=True)
    exhibition_year_id = Column(GUID(), ForeignKey('exhibition_years.id'), index=True)

    company = relationship("Company", back_populates="orders")
    exhibition_year = relationship("ExhibitionYear", back_populates="orders")


class Contract(Base):
    __tablename__ = 'contracts'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    file_path = Column(String(255))
    is_returned = Column(Boolean, default=False, index=True)
    company_id = Column(GUID(), ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="contract")


class Material(Base):
    __tablename__ = 'materials'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    type = Column(String(100), index=True)
    file_path = Column(String(255))
    company_id = Column(GUID(), ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="materials")


class ArrivalInfo(Base):
    __tablename__ = 'arrival_info'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    lunch_count = Column(Float)
    dietary_restrictions = Column(Text)
    cocktail_count = Column(Float)
    company_id = Column(GUID(), ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="arrival_info")


class ExhibitionYear(Base):
    __tablename__ = 'exhibition_years'
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    year = Column(Integer, nullable=False, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    orders = relationship("Order", back_populates="exhibition_year")
    companies = relationship("Company", back_populates="exhibition_year")


@event.listens_for(ExhibitionYear, "before_insert")
@event.listens_for(ExhibitionYear, "before_update")
def ensure_single_active_exhibition_year(mapper, connect, target):
    if target.is_active:
        session = Session(bind=connect)
        session.query(ExhibitionYear).filter(
            ExhibitionYear.is_active == True,
            ExhibitionYear.id != target.id
        ).update({ExhibitionYear.is_active: False})
        session.commit()
        session.close()
