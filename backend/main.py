from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from database import get_db, LovePrediction, Base, engine
from typing import List
from pydantic import BaseModel
import random

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

class LovePredictionRequest(BaseModel):
    boy_name: str
    boy_age: int
    boy_dob: str
    girl_name: str
    girl_age: int
    girl_dob: str

class LovePredictionResponse(BaseModel):
    id: int
    boy_name: str
    boy_age: int
    boy_dob: str
    girl_name: str
    girl_age: int
    girl_dob: str
    prediction_score: int
    
    class Config:
        from_attributes = True

@app.get("/")
def read_root():
    return {"message": "Love Predictor API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/predictions", response_model=List[LovePredictionResponse])
def get_predictions(db: Session = Depends(get_db)):
    predictions = db.query(LovePrediction).all()
    return predictions

@app.post("/predict", response_model=LovePredictionResponse)
def create_prediction(prediction: LovePredictionRequest, db: Session = Depends(get_db)):
    # Enhanced love prediction algorithm
    name_compatibility = (len(prediction.boy_name) + len(prediction.girl_name)) * 3
    age_compatibility = abs(prediction.boy_age - prediction.girl_age) * 2
    random_factor = random.randint(1, 30)
    
    score = (name_compatibility + random_factor - age_compatibility) % 100
    if score < 20:
        score += 30
    elif score > 95:
        score = random.randint(85, 95)
    
    love_prediction = LovePrediction(
        boy_name=prediction.boy_name,
        boy_age=prediction.boy_age,
        boy_dob=prediction.boy_dob,
        girl_name=prediction.girl_name,
        girl_age=prediction.girl_age,
        girl_dob=prediction.girl_dob,
        prediction_score=score
    )
    db.add(love_prediction)
    db.commit()
    db.refresh(love_prediction)
    return love_prediction

@app.delete("/predictions/{prediction_id}")
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    prediction = db.query(LovePrediction).filter(LovePrediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    db.delete(prediction)
    db.commit()
    return {"message": "Prediction deleted successfully"}

@app.get("/db-viewer")
def view_database(db: Session = Depends(get_db)):
    predictions = db.query(LovePrediction).all()
    return {
        "total_predictions": len(predictions),
        "predictions": [
            {
                "id": prediction.id,
                "boy_name": prediction.boy_name,
                "boy_age": prediction.boy_age,
                "boy_dob": prediction.boy_dob,
                "girl_name": prediction.girl_name,
                "girl_age": prediction.girl_age,
                "girl_dob": prediction.girl_dob,
                "prediction_score": prediction.prediction_score,
                "created_at": prediction.created_at.isoformat() if prediction.created_at else None
            }
            for prediction in predictions
        ]
    }

@app.get("/db-table", response_class=HTMLResponse)
def view_database_table(request: Request, db: Session = Depends(get_db)):
    predictions = db.query(LovePrediction).all()
    return templates.TemplateResponse("db_viewer.html", {
        "request": request,
        "predictions": predictions,
        "total_predictions": len(predictions)
    })