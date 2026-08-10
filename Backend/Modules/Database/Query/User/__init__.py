class User:
    __slots__ = ()

    REGISTER_QUERY = """
INSERT INTO users (username, email, password_hash) values (%s, %s, %s)
    """
