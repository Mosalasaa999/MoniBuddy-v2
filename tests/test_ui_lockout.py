import pytest
from ui_lockout_handler import UILockoutHandler  # Adjust import to match your class name

def test_initial_state_not_locked():
    """Ensure a fresh instance is not locked and has zero failed attempts."""
    lockout = UILockoutHandler(max_attempts=3)
    assert lockout.is_locked() == False
    assert lockout.get_failed_attempts() == 0

def test_account_locks_after_maximum_failed_attempts():
    """Ensure the UI locks out after reaching the maximum allowed failed attempts."""
    lockout = UILockoutHandler(max_attempts=3)
    
    lockout.register_failed_attempt()
    lockout.register_failed_attempt()
    assert lockout.is_locked() == False  # Still under threshold
    
    lockout.register_failed_attempt()  # 3rd attempt reaches limit
    assert lockout.is_locked() == True

def test_reset_clears_failed_attempts():
    """Ensure a successful login or reset clears the failure counter."""
    lockout = UILockoutHandler(max_attempts=3)
    lockout.register_failed_attempt()
    lockout.register_failed_attempt()
    
    # Simulate successful login / reset
    lockout.reset()
    
    assert lockout.get_failed_attempts() == 0
    assert lockout.is_locked() == False
