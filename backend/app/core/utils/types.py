from enum import Enum

class CompanyStatus(str, Enum):
    UNRESERVED = "unreserved"   # Ei vielä jaettu koordinaattorille
    RESERVED = "reserved"       # Jaettu koordinaattorille, ei vielä tilannut
    ORDERED = "ordered"         # Yritys on tilannut (esim. ilmoittautunut tapahtumaan)
    CHARGED = "charged"         # Yritykselle on lähetetty lasku
    PAID = "paid"               # Yritys on maksanut laskun
    DECLINED = "declined"       # Ei lähde tänä vuonna mukaan

class UserRole(str, Enum):
    AK = "AK"
    PP = "PP"
    IT = "IT"
    FINANCE = "FINANCE"

class OrderStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    COMPLETED = "COMPLETED"

class OrderType(str, Enum):
    STAND = "STAND"
    OTHER = "OTHER"

class MaterialType(str, Enum):
    LOGO = "LOGO"
    AD = "AD"
    OTHER = "OTHER"
    
class ContactStatusEnum(str, Enum):
    NO = "no"
    NO_TRIED = "no_tried"
    YES_GOING = "yes_going"
    YES_NOT_GOING = "yes_not_going"
    CALL_AGAIN = "call_again"
