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