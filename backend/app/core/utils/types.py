from enum import Enum


class CompanyStatus(str, Enum):
    RESERVED = "reserved"
    UNRESERVED = "unreserved"
    SIGNED = "signed"
    