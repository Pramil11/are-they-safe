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


missing_people = []
rescue_report = []

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
        shutil.copyfileobj(photo.file, buffer)


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

    print(response)


    return {
        "message":"Missing person report submitted",
        "data":person
    }



@app.get("/missing-person")
def get_missing_people(
    name: str = "",
    location: str = "",
    district: str = ""
):

    results = []

    for person in missing_people:

        if name.lower() in person["name"].lower() \
        and location.lower() in person["location"].lower() \
        and district.lower() in person["district"].lower():

            results.append(person)


    return results

@app.post("/rescue-report")
async def create_rescue_report(

    source_type: str = Form(""),
    organization: str = Form(""),
    person_name: str = Form(""),
    age: int = Form(None),
    location: str = Form(...),
    district: str = Form(""),
    status: str = Form(""),
    contact: str = Form(...),
    post_url: str = Form(""),
    description: str = Form(""),
    photo: UploadFile = File(None)

):

    photo_path = None

    if photo:

        photo_path = f"{UPLOAD_FOLDER}/{photo.filename}"

        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

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


    supabase.table(
        "rescue_reports"
    ).insert(report).execute()


    return {
        "message": "Rescue information submitted",
        "data": report
    }

@app.get("/rescue-report")
def get_rescue_reports(
    name: str = "",
    location: str = "",
    district: str = ""
):

    results=[]


    for report in rescue_report:

        if name.lower() in report["person_name"].lower() \
        and location.lower() in report["location"].lower() \
        and district.lower() in report["district"].lower():

            results.append(report)


    return results

@app.get("/match")
def find_matches():

    matches=[]


    for missing in missing_people:

        for found in rescue_report:


            score = 0


            # Name matching
            if missing["name"].lower() in found["person_name"].lower() \
            or found["person_name"].lower() in missing["name"].lower():

                score += 40


            # Location matching
            if missing["location"].lower() == found["location"].lower():

                score += 30


            # District matching
            if missing["district"].lower() == found["district"].lower():

                score += 20


            # Age matching
            if missing["age"] and found["age"]:

                difference = abs(
                    missing["age"] - found["age"]
                )

                if difference <= 2:
                    score += 10



            if score >= 50:

                matches.append({

                    "missing_person": missing["name"],

                    "found_person": found["person_name"],

                    "confidence": score,

                    "missing_location": missing["location"],

                    "found_location": found["location"]

                })


    return matches

@app.get("/all-reports")
def get_all_reports():

    results=[]


    for person in missing_people:

        results.append({

            "name": person.get("name","N/A"),
            "age": person.get("age","N/A"),
            "location": person.get("location","N/A"),
            "district": person.get("district","N/A"),
            "description": person.get("description","N/A"),
            "photo_url": person.get("photo","N/A"),
            "status":"Missing",
            "phone":person.get("phone","N/A")

        })


    for report in rescue_report:

        results.append({

            "name": report.get("person_name","N/A"),
            "age": report.get("age","N/A"),
            "location": report.get("location","N/A"),
            "district": report.get("district","N/A"),
            "description": report.get("description","N/A"),
            "photo_url": report.get("photo","N/A"),
            "status":report.get("status","Found"),
            "phone":report.get("contact","N/A")

        })


    return results