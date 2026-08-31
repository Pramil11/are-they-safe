from database import supabase
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import secrets
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Are They Safe API"
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
    last_seen_date: str = Form(None),
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
    manage_token = secrets.token_urlsafe(8)

    person = {

        "name": name,
        "age": age,
        "phone": phone,
        "location": location,
        "district": district,
        "last_seen_date": last_seen_date if last_seen_date else None,
        "description": description,
        "photo_url": photo_path,
        "manage_token": manage_token,
        "status": "Missing"

    }
    response = supabase.table(
        "missing_people"
    ).insert(person).execute()
    return {
        "message": "Missing person report submitted",
        "manage_token": manage_token,
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
    manage_token = secrets.token_urlsafe(8)
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
        "manage_token": manage_token,
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
            "status":person.get("status","Missing"),
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

@app.get("/manage/missing/{token}")
def get_missing_report_by_token(token: str):
    response = (
        supabase
        .table("missing_people")
        .select("*")
        .eq("manage_token", token)
        .execute()
    )

    if not response.data:
        return {
            "success": False,
            "message": "Report not found"
        }

    return {
        "success": True,
        "data": response.data[0]
    }


@app.put("/manage/missing/{token}")
async def update_missing_report(
    token: str,
    name: str = Form(""),
    age: int = Form(None),
    phone: str = Form(""),
    location: str = Form(""),
    district: str = Form(""),
    last_seen_date: str = Form(None),
    description: str = Form("")
):
    existing = (
        supabase
        .table("missing_people")
        .select("*")
        .eq("manage_token", token)
        .execute()
    )

    if not existing.data:
        return {
            "success": False,
            "message": "Invalid management code"
        }

    update_data = {
        "name": name,
        "age": age,
        "phone": phone,
        "location": location,
        "district": district,
        "last_seen_date": last_seen_date if last_seen_date else None,
        "description": description
    }

    response = (
        supabase
        .table("missing_people")
        .update(update_data)
        .eq("manage_token", token)
        .execute()
    )

    return {
        "success": True,
        "message": "Missing person report updated",
        "data": response.data
    }


@app.delete("/manage/missing/{token}")
def delete_missing_report(token: str):
    existing = (
        supabase
        .table("missing_people")
        .select("*")
        .eq("manage_token", token)
        .execute()
    )

    if not existing.data:
        return {
            "success": False,
            "message": "Invalid management code"
        }

    supabase \
        .table("missing_people") \
        .delete() \
        .eq("manage_token", token) \
        .execute()

    return {
        "success": True,
        "message": "Missing person report deleted"
    }

@app.get("/manage/rescue/{token}")
def get_rescue_report_by_token(token: str):
    response = (
        supabase
        .table("rescue_reports")
        .select("*")
        .eq("manage_token", token)
        .execute()
    )

    if not response.data:
        return {
            "success": False,
            "message": "Report not found"
        }

    return {
        "success": True,
        "data": response.data[0]
    }


@app.put("/manage/rescue/{token}")
async def update_rescue_report(
    token: str,
    source_type: str = Form(""),
    organization: str = Form(""),
    person_name: str = Form(""),
    age: int = Form(None),
    location: str = Form(""),
    district: str = Form(""),
    status: str = Form(""),
    contact: str = Form(""),
    post_url: str = Form(""),
    description: str = Form("")
):
    existing = (
        supabase
        .table("rescue_reports")
        .select("*")
        .eq("manage_token", token)
        .execute()
    )

    if not existing.data:
        return {
            "success": False,
            "message": "Invalid management code"
        }

    update_data = {
        "source_type": source_type,
        "organization": organization,
        "person_name": person_name,
        "age": age,
        "location": location,
        "district": district,
        "status": status,
        "contact": contact,
        "post_url": post_url,
        "description": description
    }

    response = (
        supabase
        .table("rescue_reports")
        .update(update_data)
        .eq("manage_token", token)
        .execute()
    )

    return {
        "success": True,
        "message": "Rescue report updated",
        "data": response.data
    }


@app.delete("/manage/rescue/{token}")
def delete_rescue_report(token: str):
    existing = (
        supabase
        .table("rescue_reports")
        .select("*")
        .eq("manage_token", token)
        .execute()
    )

    if not existing.data:
        return {
            "success": False,
            "message": "Invalid management code"
        }

    supabase \
        .table("rescue_reports") \
        .delete() \
        .eq("manage_token", token) \
        .execute()

    return {
        "success": True,
        "message": "Rescue report deleted"
    }

@app.put("/manage/missing/{token}/found")
def mark_missing_found(token:str):

    report = supabase.table(
        "missing_people"
    ).select("*").eq(
        "manage_token",
        token
    ).execute()

    if not report.data:
        return {
            "success":False,
            "message":"Invalid token"
        }

    person = report.data[0]

    rescue_report = {
        "source_type": "Recovered Missing Person",
        "organization": "",
        "person_name": person.get("name"),
        "age": person.get("age"),
        "location": person.get("location"),
        "district": person.get("district"),
        "status": "Found",
        "contact": person.get("phone"),
        "post_url": "",
        "description": person.get("description"),
        "photo_url": person.get("photo_url"),
        "manage_token": token
    }

    supabase.table(
        "rescue_reports"
    ).insert(
        rescue_report
    ).execute()


    supabase.table(
        "missing_people"
    ).delete().eq(
        "manage_token",
        token
    ).execute()


    return {
        "success":True,
        "message":"Person moved to found records"
    }