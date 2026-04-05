import logging
import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("sojha_pinecone")

app = FastAPI()

@app.middleware("http")
async def log_http_requests(request: Request, call_next):
    logger.debug(
        "Incoming request: method=%s path=%s query=%s",
        request.method,
        request.url.path,
        request.query_params,
    )
    response = await call_next(request)
    logger.debug(
        "Outgoing response: status_code=%s path=%s",
        response.status_code,
        request.url.path,
    )
    return response

# Allow your frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change "*" to your actual frontend domain(the URL of your deployed frontend)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SECURE CONFIGURATION ---
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", )
RESEND_FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")
RESEND_RECIPIENT_EMAILS = [
    email.strip()
    for email in os.environ.get(
        "RESEND_RECIPIENT_EMAILS",
        "initindogra@gmail.com",
    ).split(",")
    if email.strip()
]

# --- DATA MODELS ---
class ContactForm(BaseModel):
    name: str
    email: str
    phone: str
    checkin: str
    checkout: str
    message: str

# --- MOCK DATABASE FOR GALLERY ---
# To update photos, you simply change these URLs. 
# Later, you can connect this to a real database (like PostgreSQL or SQLite).
gallery_db = [
    {"id": 1, "url": "https://images.unsplash.com/photo-1546944641-55db293b6667?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Mountain Mist"},
    {"id": 2, "url": "https://images.unsplash.com/photo-1627885435985-78096f2e82b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Forest Trail"},
    {"id": 3, "url": "https://images.unsplash.com/photo-1588615419958-37daebfc7e0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Cozy Interior"},
    {"id": 4, "url": "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", "alt": "Valley View"},
    {"id": 5, "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Sunset Glow"},
    {"id": 6, "url": "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Lakeside Cabin"}, 
    {"id": 7, "url": "https://images.unsplash.com/photo-1500534623283-312aade485b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Snowy Peaks"},
    {"id": 8, "url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Starry Night"},
    {"id": 9, "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Sunset Glow"},
    {"id": 10, "url": "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", "alt": "Lakeside Cabin"},  
]#Add more photos as needed by simply appending to this list with new URLs and alt text.

# --- ENDPOINTS ---

@app.on_event("startup")
async def on_startup():
    logger.info("Starting Sojha Pinecone backend")
    logger.debug("CORS middleware configured with allow_origins=%s", ["*"])

@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Shutting down Sojha Pinecone backend")

@app.get("/api/gallery")
async def get_gallery():
    """Returns the dynamic list of photos for the frontend."""
    logger.debug("GET /api/gallery called. Returning %d gallery items", len(gallery_db))
    return {"images": gallery_db}

@app.post("/api/contact")
async def send_contact_email(form: ContactForm):
    """Securely handles the email sending process."""
    if not RESEND_API_KEY:
        logger.error("RESEND_API_KEY environment variable is not set")
        raise HTTPException(status_code=500, detail="Email service not configured.")
    form_data = form.dict()
    logger.debug("POST /api/contact called with form data: %s", form_data)

    html_content = f"""
        <h3>New Booking Request - Sojha Pinecone</h3>
        <p><strong>Name:</strong> {form.name}</p>
        <p><strong>Email:</strong> {form.email}</p>
        <p><strong>Phone:</strong> {form.phone}</p>
        <p><strong>Dates:</strong> {form.checkin} to {form.checkout}</p>
        <p><strong>Message:</strong><br>{form.message}</p>
    """
    logger.debug("Constructed HTML content for email, length=%d", len(html_content))

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    logger.debug("Prepared request headers for Resend API (Authorization redacted)")

    payload = {
        "from": RESEND_FROM_EMAIL,
        "to": RESEND_RECIPIENT_EMAILS,
        "subject": f"New Booking Query from {form.name}",
        "html": html_content
    }
    logger.debug(
        "Prepared payload for Resend API: from=%s to=%s subject=%s html_length=%d",
        payload["from"],
        payload["to"],
        payload["subject"],
        len(payload["html"]),
    )

    try:
        response = requests.post("https://api.resend.com/emails", json=payload, headers=headers, timeout=30)
        logger.debug(
            "Resend API response status=%s; headers=%s; body=%s",
            response.status_code,
            dict(response.headers),
            response.text,
        )
    except requests.RequestException as exc:
        logger.exception("Failed to call Resend API: %s", exc)
        raise HTTPException(status_code=502, detail="Unable to contact email provider.")

    if response.status_code == 200:
        logger.info("Email request accepted by Resend API for %s", form.email)
        return {"status": "success", "message": "Email sent securely."}

    logger.error(
        "Resend API returned non-200 status. status=%s detail=%s",
        response.status_code,
        response.text,
    )
    raise HTTPException(status_code=500, detail="Failed to send email.")

# To run this server: uvicorn main:app --reload