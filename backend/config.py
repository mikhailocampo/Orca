import json

def load_config():
    with open('config.json', 'r') as config_file:
        return json.load(config_file)

config = load_config()

def validate_appointment_type_code(code: str):
    valid_codes = [item['code'] for item in config['appointment_types']]
    if code not in valid_codes:
        raise ValueError(f"Invalid appointment type code: {code}")
    return code
def validate_appointment_type_description(description: str):
    valid_descriptions = [item['description'] for item in config['appointment_types']]
    if description not in valid_descriptions:
        raise ValueError(f"Invalid appointment type description: {description}")
    return description

def validate_staff_type_code(code: str):
    valid_codes = [item['code'] for item in config['staff_types']]
    if code not in valid_codes:
        raise ValueError(f"Invalid staff type code: {code}")
    return code
def validate_staff_type_name(name: str):
    valid_names = [item['name'] for item in config['staff_types']]
    if name not in valid_names:
        raise ValueError(f"Invalid staff type name: {name}")
    return name

def validate_status_type_code(code: str):
    valid_codes = [item['code'] for item in config['status_types']]
    if code not in valid_codes:
        raise ValueError(f"Invalid status type code: {code}")
    return code
def validate_status_type_name(name: str):
    valid_names = [item['name'] for item in config['status_types']]
    if name not in valid_names:
        raise ValueError(f"Invalid status type name: {name}")
    return name