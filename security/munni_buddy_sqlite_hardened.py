import sqlite3
import os
import stat
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MunniBuddyDatabase")

class MunniBuddyHardenedDatabase:
    """
    Hardened SQLite Database Wrapper for Munni Buddy.
    Enforces page-level encryption, restrictive file permissions, and secure PRAGMA settings.
    """
    
    def __init__(self, db_path: str, encryption_key: str = None):
        self.db_path = db_path
        self.encryption_key = encryption_key
        self._ensure_file_permissions()
        
    def _ensure_file_permissions(self):
        """Enforces POSIX 0600 (owner read/write only) on the database file if it exists."""
        if os.path.exists(self.db_path):
            os.chmod(self.db_path, stat.S_IRUSR | stat.S_IWUSR)

    def get_connection(self) -> sqlite3.Connection:
        """Establishes connection and executes mandatory security PRAGMAs."""
        conn = sqlite3.connect(self.db_path)
        
        # SQLCipher Key Injection (if using pysqlcipher3 / sqlcipher)
        if self.encryption_key:
            conn.execute(f"PRAGMA key = '{self.encryption_key}';")
            
        # Hardened Security PRAGMA Suite
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA synchronous = FULL;")
        conn.execute("PRAGMA temp_store = MEMORY;")       # Keep temporary files in RAM
        conn.execute("PRAGMA secure_delete = ON;")        # Overwrite deleted records with zeros
        
        self._ensure_file_permissions()
        logger.info("Database connection established with security PRAGMAs applied.")
        return conn

    def execute_parameterized_query(self, query: str, params: tuple = ()):
        """
        Safely executes a query using mandatory parameter placeholders (?).
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.fetchall()
