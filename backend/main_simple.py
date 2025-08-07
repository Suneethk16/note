from fastapi import FastAPI
from typing import List
from pydantic import BaseModel

app = FastAPI()

# In-memory storage for demo
notes_storage = []
next_id = 1

class NoteResponse(BaseModel):
    id: int
    text: str

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI backend!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/notes", response_model=List[NoteResponse])
def get_notes():
    return notes_storage

@app.post("/notes", response_model=NoteResponse)
def create_note(text: str):
    global next_id
    note = {"id": next_id, "text": text.strip()}
    notes_storage.append(note)
    next_id += 1
    return note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    global notes_storage
    notes_storage = [note for note in notes_storage if note["id"] != note_id]
    return {"message": "Note deleted successfully"}