import json
import os

def expand_legal_data(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # List of language codes (21 + English/Tamil/Hindi already mostly done)
    # We'll support all from the config
    lang_codes = [
        'hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'ml', 'or', 'pa', 
        'as', 'mai', 'sat', 'ks', 'ne', 'kok', 'sd', 'doi', 'mni', 'brx', 'sa'
    ]

    for cat in data.get('categories', []):
        # Add titles for categories
        for lang in lang_codes:
            field = f'title_{lang}'
            if field not in cat:
                cat[field] = "TODO"

        for sit in cat.get('situations', []):
            # Fields to expand
            string_fields = ['title', 'summary', 'legal_basis', 'authority']
            array_fields = ['steps', 'documents_required']

            for field_base in string_fields:
                for lang in lang_codes:
                    field = f'{field_base}_{lang}'
                    if field not in sit:
                        sit[field] = "TODO"
            
            for field_base in array_fields:
                for lang in lang_codes:
                    field = f'{field_base}_{lang}'
                    if field not in sit:
                        sit[field] = ["TODO"]

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    input_path = '/Users/sureshkumar/Downloads/nyayasetu_-simplified-legal-awareness/src/legal_data_v2.json'
    output_path = '/Users/sureshkumar/Downloads/nyayasetu_-simplified-legal-awareness/src/legal_data_v2.json'
    expand_legal_data(input_path, output_path)
    print("Expansion complete.")
