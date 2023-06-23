
import csv
import json


def csv_to_json(csv_file_path, json_file_path):
    data_list = []

    with open(csv_file_path, encoding='utf-8') as csv_file_handler:
        csv_reader = csv.DictReader(csv_file_handler)
        id_counter = 0

        for rows in csv_reader:
            rows['ID'] = str(id_counter)  # Add a new 'ID' field to each row
            print(rows);
            data_list.append(rows)
            id_counter += 1

    with open(json_file_path, 'w', encoding='utf-8') as json_file_handler:
        json_file_handler.write(json.dumps(data_list, indent=4))

    # open a json file handler and use json.dumps
    # method to dump the data
    # Step 3
    with open(json_file_path, 'w', encoding='utf-8') as json_file_handler:
        # Step 4
        json_file_handler.write(json.dumps(data_list, indent=4))


# driver code
# be careful while providing the path of the csv file
# provide the file path relative to your machine

# Step 1
csv_file_path = 'F:/CODES/INF8808-PROJECT/project-inf8808/src/assets/data/debatsCommunes.csv'
json_file_path = 'F:/CODES/INF8808-PROJECT/project-inf8808/src/assets/data/debats.json'

with open(json_file_path, 'w', encoding='utf-8') as json_file_handler:
    json_file_handler.write('')

csv_to_json(csv_file_path, json_file_path)