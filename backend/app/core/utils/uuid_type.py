from sqlalchemy.types import TypeDecorator
from sqlalchemy.dialects.mysql import BINARY
import uuid

# Define the GUID type for SQLAlchemy
class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses BINARY(16) to store UUIDs.
    """
    impl = BINARY(16)
    cache_ok = True

    def load_dialect_impl(self, dialect):
        return dialect.type_descriptor(BINARY(16))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if not isinstance(value, uuid.UUID):
            value = uuid.UUID(value)
        return value.bytes

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return uuid.UUID(bytes=value)
    