from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from database import get_db, Note, Base, engine
from typing import List
from pydantic import BaseModel

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NoteResponse(BaseModel):
    id: int
    text: str
    
    class Config:
        from_attributes = True

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI backend!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/notes", response_model=List[NoteResponse])
def get_notes(db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    return notes

@app.post("/notes", response_model=NoteResponse)
def create_note(text: str, db: Session = Depends(get_db)):
    if not text.strip():
        raise HTTPException(status_code=400, detail="Note text cannot be empty")
    
    note = Note(text=text.strip())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}

@app.get("/db-viewer")
def view_database(db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    return {
        "total_notes": len(notes),
        "notes": [
            {
                "id": note.id,
                "text": note.text,
                "created_at": note.created_at.isoformat() if note.created_at else None
            }
            for note in notes
        ]
    }

@app.get("/db-table", response_class=HTMLResponse)
def view_database_table(request: Request, db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    return templates.TemplateResponse("db_viewer.html", {
        "request": request,
        "notes": notes,
        "total_notes": len(notes)
    })