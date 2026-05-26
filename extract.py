import os
import json
import pymupdf4llm
from pypdf import PdfReader

pdf_dir = "src-pdf"
output_dir = "public/data"
images_dir = os.path.join(output_dir, "images")

os.makedirs(output_dir, exist_ok=True)
os.makedirs(images_dir, exist_ok=True)

pdf_files = [
    "Analisis Makroekonomi Indonesia 2026.pdf",
    "Cost Effectiveness Analysis MBG.pdf",
    "PERHITUNGAN REFORMASI SUBSIDI INDONESIA.pdf"
]

for filename in pdf_files:
    pdf_path = os.path.join(pdf_dir, filename)
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        continue
    
    print(f"Processing {filename}...")
    
    # Extract metadata using pypdf
    reader = PdfReader(pdf_path)
    metadata = reader.metadata
    
    title = filename.replace(".pdf", "")
    author = "Ferry Irwandi"
    if metadata:
        if metadata.title:
            title = metadata.title
            
    doc_id = filename.lower().replace(" ", "_").replace(".pdf", "")
    
    # Extract markdown pages
    md_pages = pymupdf4llm.to_markdown(pdf_path, write_images=True, image_path=images_dir, image_format="png", page_chunks=True)
    
    pages_content = []
    full_text = ""
    
    for i, page_data in enumerate(md_pages):
        text = page_data.get("text", "")
        
        # Replace local file paths with web-friendly paths for images
        text = text.replace("](public/data/images/", "](/data/images/")
        
        pages_content.append({
            "page_number": i + 1,
            "text": text
        })
        full_text += text + "\n\n"
        
    doc_data = {
        "id": doc_id,
        "title": title,
        "filename": filename,
        "author": author,
        "page_count": len(md_pages),
        "pages": pages_content,
        "summary": full_text[:400] + "..." if len(full_text) > 400 else full_text
    }
    
    out_path = os.path.join(output_dir, f"{doc_id}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(doc_data, f, ensure_ascii=False, indent=2)
        
    print(f"Saved {out_path} with {len(md_pages)} pages.")

# Generate index.json
index_data = []
for filename in pdf_files:
    doc_id = filename.lower().replace(" ", "_").replace(".pdf", "")
    out_path = os.path.join(output_dir, f"{doc_id}.json")
    if os.path.exists(out_path):
        with open(out_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            index_data.append({
                "id": data["id"],
                "title": data["title"],
                "filename": data["filename"],
                "author": data["author"],
                "page_count": data["page_count"],
                "summary": data["summary"]
            })

index_path = os.path.join(output_dir, "index.json")
with open(index_path, "w", encoding="utf-8") as f:
    json.dump(index_data, f, ensure_ascii=False, indent=2)
print("Saved index.json")
