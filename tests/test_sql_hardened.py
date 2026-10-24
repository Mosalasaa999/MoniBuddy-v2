import sqlite3
import pytest
from sql_hardened import execute_secure_query  # Adjust function name to match your code

@pytest.fixture
def db_connection():
    """Creates a temporary in-memory database for testing."""
    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()
    
    # Create a dummy users table
    cursor.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            role TEXT
        )
    """)
    
    # Insert test data
    cursor.execute("INSERT INTO users (username, role) VALUES ('alice', 'admin')")
    cursor.execute("INSERT INTO users (username, role) VALUES ('bob', 'user')")
    conn.commit()
    
    yield conn
    
    # Close connection after test
    conn.close()

def test_sql_injection_attempt_is_safely_parameterized(db_connection):
    """
    Ensures that a classic SQL injection payload is treated as a 
    literal string search rather than executable code.
    """
    # Classic SQL injection string that would bypass unparameterized queries
    malicious_input = "alice' OR '1'='1"
    
    # Using parameterized query (safe)
    query = "SELECT * FROM users WHERE username = ?"
    results = execute_secure_query(db_connection, query, (malicious_input,))
    
    # An injection attempt should return 0 results because no user is literally named that string
    assert len(results) == 0

def test_valid_query_returns_correct_data(db_connection):
    """Ensures legitimate queries return expected results successfully."""
    query = "SELECT * FROM users WHERE username = ?"
    results = execute_secure_query(db_connection, query, ("alice",))
    
    assert len(results) == 1
    assert results[0][1] == "alice"
