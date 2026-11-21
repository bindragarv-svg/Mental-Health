import joblib
from fastapi import FastAPI
from  pydantic import BaseModel,Field
import pandas as pd
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

BaseDIR = Path(__file__).resolve().parent.parent
modelpath = BaseDIR /"model"/"model.pkl"

model = joblib.load(modelpath)

class Mental(BaseModel):
    Age:int= Field(...,ge=10,le=100)
    Gender:Literal['Male','Female']
    Country:str
    Academic_Level:str = Literal['Undergraduate', 'Graduate', 'High School']
    Most_Used_Platform:str= Literal[ 'Facebook',  'LinkedIn', 'Instagram',  'Snapchat',   'Twitter',   'YouTube','TikTok',      'LINE', 'KakaoTalk', 'VKontakte',  'WhatsApp',    'WeChat']
    Purpose_Of_Use:str = Literal['Networking', 'Education', 'Entertainment', 'News']
    Avg_Daily_Usage_Hours:float = Field(...,ge=6,le=24)
    Daily_Unlocks:int = Field(...,ge=0)
    Study_Hours:float = Field(...,ge=0,le=24)
    Physical_Activity_Hours:float=Field(...,ge=0,le=24)
    Sleep_Hours_Per_Night:float=Field(...,ge=0,le=24)
    Stress_Level:str = Literal['Medium', 'Low', 'Very High', 'High']

class predictedhealth(BaseModel):
    Mental_health_score:float

print(model)
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[" https://mental-healthcondition.onrender.com/"],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get('/')
def greet():
    return{"welcome to the mental health score predictions "}

top_country = ['Other', 'India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'Mexico', 'Turkey','France']
@app.post('/predict',response_model=predictedhealth)
def pedictmental(data:Mental):
    grp_desh = data.Country if data.Country in top_country else 'Other'
    data_col = pd.DataFrame({
    'Age':[data.Age],
    'Gender':[data.Gender],
    'Country':[data.Country],
    'Academic_Level':[data.Academic_Level],
    'Most_Used_Platform':[data.Most_Used_Platform],
    'Purpose_Of_Use':[data.Purpose_Of_Use],
    'Avg_Daily_Usage_Hours':[data.Avg_Daily_Usage_Hours],
    'Daily_Unlocks':[data.Daily_Unlocks],
    'Study_Hours':[data.Study_Hours],
    'Physical_Activity_Hours':[data.Physical_Activity_Hours],
    'Sleep_Hours_Per_Night':[data.Sleep_Hours_Per_Night],
    'Stress_Level':[data.Stress_Level],
    'Group_country':grp_desh
    })

    predictions = model.predict(data_col)
    print(predictions[0])
    return predictedhealth(Mental_health_score = round(float(predictions[0]),4))