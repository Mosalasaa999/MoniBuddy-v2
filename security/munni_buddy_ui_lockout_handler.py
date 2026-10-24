import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MunniBuddyLockout")

class MunniBuddyUILockoutHandler:
    """
    Manages security lockout states and UI critical feedback for Munni Buddy.
    """
    
    CRITICAL_RED_COLOR = "#ef4444"
    MAX_ALLOWED_FAILURES = 3
    
    def __init__(self, key_eviction_callback=None):
        self.failed_attempts = 0
        self.is_locked = False
        self.lockout_timestamp = None
        self.key_eviction_callback = key_eviction_callback
        
    def record_auth_failure(self) -> dict:
        """
        Tracks authentication failures and triggers critical state upon threshold breach.
        """
        self.failed_attempts += 1
        logger.warning(f"[SECURITY] Auth failure recorded ({self.failed_attempts}/{self.MAX_ALLOWED_FAILURES}).")
        
        if self.failed_attempts >= self.MAX_ALLOWED_FAILURES:
            return self._trigger_critical_lockout()
            
        return {
            "status": "warning",
            "attempts_remaining": self.MAX_ALLOWED_FAILURES - self.failed_attempts,
            "ui_state_color": "#f59e0b"  # Amber warning state
        }
        
    def _trigger_critical_lockout(self) -> dict:
        """Executes full security lockout and invokes memory key eviction."""
        self.is_locked = True
        self.lockout_timestamp = time.time()
        logger.error("[LOCKOUT] Maximum security failures exceeded. Entering critical lockout state.")
        
        # Purge encryption keys from process RAM if callback configured
        if self.key_eviction_callback:
            self.key_eviction_callback()
            logger.info("[SECURITY] Key eviction callback executed successfully.")
            
        return {
            "status": "CRITICAL_LOCKOUT",
            "ui_state_color": self.CRITICAL_RED_COLOR,  # #ef4444 severe red
            "is_locked": True,
            "message": "Security lockout triggered. High-priority red alert #ef4444 activated."
        }

    def reset_lockout(self):
        """Resets lockout state upon successful primary biometric or hardware-backed recovery."""
        self.failed_attempts = 0
        self.is_locked = False
        self.lockout_timestamp = None
        logger.info("[SECURITY] Lockout reset successfully following hardware authentication.")
