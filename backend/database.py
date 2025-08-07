import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/notes_app")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class LovePrediction(Base):
    __tablename__ = "love_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    boy_name = Column(String, nullable=False)
    boy_age = Column(Integer, nullable=False)
    boy_dob = Column(String, nullable=False)
    girl_name = Column(String, nullable=False)
    girl_age = Column(Integer, nullable=False)
    girl_dob = Column(String, nullable=False)
    prediction_score = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()