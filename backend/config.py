import json

def load_config():
    with open('config.json', 'r') as config_file:
        return json.load(config_file)

config = load_config()

# APPOINTMENT
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

# STAFF
def validate_staff_type_code(code: str):
    valid_codes = [item['code'] for item in config['staff_types']]
    if code not in valid_codes:
        raise ValueError(f"Invalid staff type code: {code}")
    return code
def validate_staff_description(description: str):
    valid_desc = [item['description'] for item in config['staff_types']]
    if description not in valid_desc:
        raise ValueError(f"Invalid staff type name: {description}")
    return description

# STATUS
def validate_status_type_code(code: str):
    valid_codes = [item['code'] for item in config['appointment_statuses']]
    if code not in valid_codes:
        raise ValueError(f"Invalid status type code: {code}")
    return code
def validate_status_type_name(name: str):
    valid_names = [item['name'] for item in config['appointment_statuses']]
    if name not in valid_names:
        raise ValueError(f"Invalid status type name: {name}")
    return name