from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey,
    DateTime, Text, Float, Enum, Index
)
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    year = Column(Integer, nullable=False, index=True)
    name = Column(String(255), nullable=False)

    companies = relationship("Company", back_populates="project")


class Company(Base):
    __tablename__ = 'companies'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    business_id = Column(String(50), unique=True, index=True)  # Y-tunnus
    booth_size = Column(String(50))
    special_requests = Column(Text)
    status = Column(String(50), index=True)  # e.g., 'confirmed', 'declined', etc.
    display_name = Column(String(255), index=True)
    project_id = Column(Integer, ForeignKey('projects.id'), index=True)
    coordinator_id = Column(Integer, ForeignKey('users.id'), index=True)

    project = relationship("Project", back_populates="companies")
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
    id = Column(Integer, primary_key=True)
    name = Column(String(255), index=True)
    email = Column(String(255))
    phone = Column(String(50))
    is_primary = Column(Boolean, default=False)
    company_id = Column(Integer, ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="contacts")


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), index=True)
    email = Column(String(120), nullable=False, unique=True)
    password_hash = Column(String(150), nullable=False)
    refresh_token = Column(String(300), index=True, nullable=True)
    role = Column(Enum('AK', 'PP', 'IT', 'Finance', name='user_roles'), index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), 
                        onupdate=lambda: datetime.now(timezone.utc), nullable=False)


    assigned_companies = relationship("Company", back_populates="coordinator")


class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True)
    text = Column(Text)
    created_at = Column(DateTime, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="comments")


class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    product_name = Column(String(255), index=True)
    price = Column(Float)
    company_id = Column(Integer, ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="orders")


class Contract(Base):
    __tablename__ = 'contracts'
    id = Column(Integer, primary_key=True)
    file_path = Column(String(255))
    is_returned = Column(Boolean, default=False, index=True)
    company_id = Column(Integer, ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="contract")


class Material(Base):
    __tablename__ = 'materials'
    id = Column(Integer, primary_key=True)
    type = Column(String(100), index=True)
    file_path = Column(String(255))
    company_id = Column(Integer, ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="materials")


class ArrivalInfo(Base):
    __tablename__ = 'arrival_info'
    id = Column(Integer, primary_key=True)
    lunch_count = Column(Integer)
    dietary_restrictions = Column(Text)
    cocktail_count = Column(Integer)
    company_id = Column(Integer, ForeignKey('companies.id'), index=True)

    company = relationship("Company", back_populates="arrival_info")