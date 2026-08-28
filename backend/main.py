from database import supabase
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

app = FastAPI(
    title="Are They Safe API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.get("/")
def home():

    return {
        "message": "Are They Safe API is running"
    }

@app.post("/missing-person")
async def create_missing_person(

    name: str = Form(""),
    age: int = Form(None),
    phone: str = Form(""),
    location: str = Form(""),
    district: str = Form(""),
    last_seen_date: str = Form(""),
    description: str = Form(""),
    photo: UploadFile = File(None)

):


    photo_path = None


    if photo:

        photo_path = f"{UPLOAD_FOLDER}/{photo.filename}"


        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(
                photo.file,
                buffer
            )



    person = {

        "name": name,
        "age": age,
        "phone": phone,
        "location": location,
        "district": district,
        "last_seen_date": last_seen_date,
        "description": description,
        "photo_url": photo_path

    }
    response = supabase.table(
        "missing_people"
    ).insert(person).execute()
    return {

        "message": "Missing person report submitted",

        "data": response.data

    }

@app.get("/missing-person")
def get_missing_people():


    response = supabase.table(
        "missing_people"
    ).select("*").execute()
    return response.data

@app.post("/rescue-report")
async def create_rescue_report(

    source_type: str = Form(""),
    organization: str = Form(""),
    person_name: str = Form(""),
    age: int = Form(None),
    location: str = Form(""),
    district: str = Form(""),
    status: str = Form("Found"),
    contact: str = Form(""),
    post_url: str = Form(""),
    description: str = Form(""),
    photo: UploadFile = File(None)

):
    photo_path = None
    if photo:
        photo_path = f"{UPLOAD_FOLDER}/{photo.filename}"
        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(
                photo.file,
                buffer
            )

    report = {
        "source_type": source_type,
        "organization": organization,
        "person_name": person_name,
        "age": age,
        "location": location,
        "district": district,
        "status": status,
        "contact": contact,
        "post_url": post_url,
        "description": description,
        "photo_url": photo_path

    }
    response = supabase.table(
        "rescue_reports"
    ).insert(report).execute()

    return {
        "message": "Rescue information submitted",
        "data": response.data
    }

@app.get("/rescue-report")
def get_rescue_reports():
    response = supabase.table(
        "rescue_reports"
    ).select("*").execute()
    return response.data

@app.get("/match")
def find_matches():
    matches = []
    missing = supabase.table(
        "missing_people"
    ).select("*").execute().data
    rescue = supabase.table(
        "rescue_reports"
    ).select("*").execute().data

    for person in missing:
        for found in rescue:
            score = 0

            if person["name"] and found["person_name"]:
                if (
                    person["name"].lower() in found["person_name"].lower()
                    or
                    found["person_name"].lower() in person["name"].lower()
                ):
                    score += 40

            if person["location"] and found["location"]:
                if person["location"].lower() == found["location"].lower():
                    score += 30

            if person["district"] and found["district"]:
                if person["district"].lower() == found["district"].lower():
                    score += 20

            if person["age"] and found["age"]:
                difference = abs(
                    person["age"] - found["age"]
                )


                if difference <= 2:

                    score += 10
            if score >= 50:
                matches.append({
                    "missing_person":
                        person["name"],
                    "found_person":
                        found["person_name"],
                    "confidence":
                        score,
                    "missing_location":
                        person["location"],
                    "found_location":
                        found["location"]

                })
    return matches

@app.get("/all-reports")
def get_all_reports():
    results = []
    missing = supabase.table(
        "missing_people"
    ).select("*").execute().data

    rescue = supabase.table(
        "rescue_reports"
    ).select("*").execute().data

    for person in missing:
        results.append({
            "name":
                person.get("name","N/A"),
            "age":
                person.get("age","N/A"),
            "location":
                person.get("location","N/A"),
            "district":
                person.get("district","N/A"),
            "description":
                person.get("description","N/A"),
            "photo_url":
                person.get("photo_url","N/A"),
            "status":
                "Missing",
            "phone":
                person.get("phone","N/A")
        })

    for report in rescue:
        results.append({
            "name":
                report.get("person_name","N/A"),
            "age":
                report.get("age","N/A"),
            "location":
                report.get("location","N/A"),
            "district":
                report.get("district","N/A"),
            "description":
                report.get("description","N/A"),
            "photo_url":
                report.get("photo_url","N/A"),
            "status":
                report.get("status","Found"),
            "phone":
                report.get("contact","N/A")
        })
    return results