
class User:

    __slots__ = ()

    CHECK_ACCOUNT_EXISTS_QUERY = """
SELECT * FROM users WHERE username = %s OR email = %s
    """
    REGISTER_QUERY = """
INSERT INTO users (username, email, password_hash) values (%s, %s, %s)
    """