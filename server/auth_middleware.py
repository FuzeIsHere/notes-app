from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
import logging

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    Decodes and cryptographically verifies incoming Firebase JWT tokens.
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)

        real_uid = decoded_token['uid']
        return real_uid
    except Exception as e:
        logging.error(f"JWT Verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token")
