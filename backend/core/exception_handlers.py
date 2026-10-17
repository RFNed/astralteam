
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


VALIDATION_MESSAGES = {
    ("email", "value_error"): (
        "INVALID_EMAIL",
        "INVALID EMAIL",
    ),
    ("username", "string_too_short"): (
        "USERNAME_TOO_SHORT",
        "USERNAME TOO SHORT",
    ),
    ("password", "string_too_short"): (
        "PASSWORD_TOO_SHORT",
        "PASSWORD TOO SHORT",
    ),
}


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    error = exc.errors()[0]
    location = error.get("loc", ())
    field = location[-1] if location else ""
    error_type = error["type"]

    code, message = VALIDATION_MESSAGES.get(
        (field, error_type),
        (
            "INVALID_REQUEST",
            "Check your request!",
        ),
    )

    return JSONResponse(
        status_code=422,
        content={
            "detail": {
                "code": code,
                "message": message,
            }
        },
    )
