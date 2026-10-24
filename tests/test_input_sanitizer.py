import pytest
from input_sanitizer import sanitize_input  # Adjust function name if needed

def test_sanitize_removes_script_tags():
    """Ensure malicious script tags are stripped out or neutralized."""
    raw_input = "<script>alert('hack')</script>John Doe"
    clean_input = sanitize_input(raw_input)
    assert "<script>" not in clean_input
    assert "John Doe" in clean_input

def test_sanitize_handles_empty_input():
    """Ensure empty strings return safely without throwing errors."""
    assert sanitize_input("") == ""

def test_sanitize_trims_whitespace():
    """Ensure leading and trailing whitespace is properly handled."""
    raw_input = "   test_user   "
    clean_input = sanitize_input(raw_input)
    assert clean_input.strip() == clean_input
