# Are They Safe?

AI-powered disaster response platform for identifying missing people by matching them with rescued individuals.

## Features

- Missing person reporting
- Rescued person reporting
- AI-based person matching
- Face similarity analysis
- Text similarity matching
- Human verification workflow

## Architecture

Frontend:
- React
- Vite

Backend:
- FastAPI
- Python
- AI matching pipeline

Database:
- Supabase PostgreSQL

## AI Matching

The system combines:

- Name similarity
- Location similarity
- Age similarity
- Image similarity

to generate possible matches.

## Workflow

Missing Person Report
↓
Rescue Reports
↓
AI Matching
↓
Possible Matches
↓
Human Verification

## Future Improvements

- Government rescue data integration
- SMS notification
- Automated disaster data ingestion