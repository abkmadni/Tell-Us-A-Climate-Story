import json

with open('co2_mm_mlo.txt', 'r') as file:
    lines = file.readlines()

data = []
for line in lines[57:]:  # Skip the header lines
    parts = line.split()
    entry = {
        "year": int(parts[0]),
        "month": int(parts[1]),
        "decimal_date": float(parts[2]),
        "average": float(parts[3]),
        "de_seasonalized": float(parts[4]),
        "days": int(parts[5]),
        "st_dev": float(parts[6]),
        "uncertainty": float(parts[7])
    }
    data.append(entry)

with open('co2_data.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

print("Data has been converted to JSON format and saved as co2_data.json")