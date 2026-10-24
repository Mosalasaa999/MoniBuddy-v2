import re
import unicodedata

class MunniBuddySecurityException(Exception):
    """Custom exception raised when security or sanitization validation fails."""
    pass

class MunniBuddyInputSanitizer:
    """
    Input Sanitization and Anti-Injection Suite for Munni Buddy.
    Implements strict allow-list regex validation and structural parameterization.
    """
    
    # Strict allow-list regex patterns for text fields
    PATTERNS = {
        "username": re.compile(r"^[a-zA-Z0-9_\.\-]{3,30}$"),
        "email": re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"),
        "phone": re.compile(r"^\+?[1-9]\d{1,14}$"),
        "full_name": re.compile(r"^[a-zA-Z\s\-\']{2,50}$"),
        # Scam Guard text fields: unicode letters/numbers, whitespace, punctuation (max 1000 chars)
        "scam_guard_text": re.compile(r"^[a-zA-Z0-9\s.,!?'\"\-\n\r]{1,1000}$"),
    }
    
    ALLOWED_SORT_COLUMNS = {"created_at", "report_id", "status", "severity"}
    ALLOWED_TABLES = {"scam_reports", "user_onboarding", "audit_logs"}

    @classmethod
    def sanitize_string(cls, input_text: str, field_type: str) -> str:
        """
        Normalizes, cleans, and validates user input text against allow-list patterns.
        """
        if input_text is None:
            raise MunniBuddySecurityException(f"Input for '{field_type}' cannot be None.")
            
        # 1. Unicode NFC Normalization
        normalized = unicodedata.normalize("NFC", str(input_text))
        
        # 2. Strip control characters (except newline/tab in scam guard text)
        cleaned = "".join(
            ch for ch in normalized 
            if unicodedata.category(ch)[0] != "C" or ch in ("\n", "\r", "\t")
        ).strip()
        
        # 3. Match against field-specific allow-list pattern
        pattern = cls.PATTERNS.get(field_type)
        if not pattern:
            raise MunniBuddySecurityException(f"Unknown field validation type: {field_type}")
            
        if not pattern.match(cleaned):
            raise MunniBuddySecurityException(
                f"Validation failed for field '{field_type}'. Input contains invalid characters or illegal length."
            )
            
        return cleaned

    @classmethod
    def validate_identifier(cls, identifier: str, allowed_set: set) -> str:
        """
        Validates unbindable SQL identifiers (e.g., column/table names) against strict sets.
        """
        if identifier not in allowed_set:
            raise MunniBuddySecurityException(f"Illegal database identifier requested: {identifier}")
        return identifier
 
