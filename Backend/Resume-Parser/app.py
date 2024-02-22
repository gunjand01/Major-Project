import csv
import json
import os
import re
import warnings
import fitz
import spacy
import pyresparser
from spacy.matcher import Matcher

# Initialize Spacy
nlp = spacy.load("en_core_web_sm")
matcher = Matcher(nlp.vocab)

# Function to read skills from CSV
def read_skills_from_csv(csv_file):
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        skills = [row[0].strip('" \n') for row in reader]
    return skills

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file):
    text = ""
    with fitz.open(pdf_file) as doc:
        text = " ".join(page.get_text() for page in doc)
    return text

# Function to preprocess text
def preprocess_text(text):
    doc = nlp(text)
    return " ".join(token.lemma_ for token in doc if not token.is_stop and token.is_alpha and len(token.text) > 2)

# Function to extract name
def extract_name(resume_text):
    nlp_text = nlp(resume_text)
    pattern = [{'POS': 'PROPN'}, {'POS': 'PROPN'}]
    matcher.add('NAME', [pattern])
    matches = matcher(nlp_text)
    for match_id, start, end in matches:
        span = nlp_text[start:end]
        return span.text

# Function to extract email
def extract_email(doc):
    matcher = spacy.matcher.Matcher(nlp.vocab)
    email_pattern = [{"TEXT": {"REGEX": "[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+"}}]
    matcher.add("Email", [email_pattern])
    matches = matcher(doc)
    return [doc[start:end].text for match_id, start, end in matches if nlp.vocab.strings[match_id] == "Email"]

# Function to extract phone
def extract_phone(doc):
    matcher = spacy.matcher.Matcher(nlp.vocab)
    phone_pattern = [
        {"TEXT": {"REGEX": r"\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}"}}]
    matcher.add("Phone", [phone_pattern])
    matches = matcher(doc)
    return [doc[start:end].text for match_id, start, end in matches if nlp.vocab.strings[match_id] == "Phone"]

# Function to extract links
def extract_links(doc):
    matcher = spacy.matcher.Matcher(nlp.vocab)
    link_pattern = [{"TEXT": {"REGEX": r"https?://[^\s]+"}}]
    matcher.add("Link", [link_pattern])
    matches = matcher(doc)
    return [doc[start:end].text for match_id, start, end in matches if nlp.vocab.strings[match_id] == "Link"]

# Function to parse resume
def parse_resume(filepath, extract_fields=None):
    warnings.filterwarnings("ignore", category=UserWarning)
    try:
        data = pyresparser.ResumeParser(filepath).get_extracted_data()
        if extract_fields is None:
            return data
        else:
            selected_data = {field: data[field] for field in extract_fields if field in data}
            return selected_data
    except Exception as e:
        print(f"Error parsing resume: {e}")
        return None

# Main function
def main():
    # Paths and settings
    skills_csv_file = './skills.csv'
    resume_pdf_file = './resume/harshal.pdf'
    extract_fields = ["name", "email", "skills"]

    # Extract data using Pyresparser
    extracted_data = parse_resume(resume_pdf_file, extract_fields)

    # Extracted skills from CSV
    skills_list = read_skills_from_csv(skills_csv_file)

    # Extracted text from PDF
    resume_text = extract_text_from_pdf(resume_pdf_file)

    # Extract name
    name = extract_name(resume_text)

    # Extract email, phone, links
    email = extract_email(nlp(resume_text))
    phone = extract_phone(nlp(resume_text))
    links = extract_links(nlp(resume_text))

    # Save extracted data to JSON
    filename_without_extension = os.path.splitext(os.path.basename(resume_pdf_file))[0]
    json_filename = f"./json/{filename_without_extension}.json"
    final_data = {
        "Name": name,
        "Email": email,
        "Phone": phone,
        "Links": links,
        "Skills": extracted_data.get("skills", []),
        "Experience": extracted_data.get("experience", [])
    }
    with open(json_filename, "w") as json_file:
        json.dump(final_data, json_file, indent=4)
    print("Extracted data saved to", json_filename)
    # print(json.dumps(final_data, indent=4))

if __name__ == "__main__":
    main()
