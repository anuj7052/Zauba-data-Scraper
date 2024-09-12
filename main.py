# import requests
# import json

# url = "https://postman-rest-api-learner.glitch.me//info"

# payload = json.dumps({
#   "name": "codewithfun45"
# })
# headers = {
#   'Content-Type': 'application/json'
# }

# response = requests.request("POST", url, headers=headers, data=payload)
# print("\n"*5)
# print(response.text)

# print("\n"*5)


# import requests
# from bs4 import BeautifulSoup
# url ="https://www.zaubacorp.com/"
# r = requests.get(url)
# htmlContent = r.content
# # print(htmlContent)

# soup = BeautifulSoup(htmlContent, 'html.parser')
# # print(soup.prettify)

# title = soup.title
# # 

# paras = soup.find_all("p")



# print(soup.find("p"))
# # print(soup.find("p")["class"])


# # # find all the elements  wuth class lead

# print(soup.find_all("p", class_ ="lead"))

# # print(soup.find("p").get_text())

# # print(soup.get_text())

# anchors = soup.find_all("a")
# all_links = set()
# for link in anchors:
#     if(link.get('href') != "#"):
#         linkText = "https://www.zaubacorp.com/"+link.get("href")
#         all_links.add("https://www.zaubacorp.com/"+link.get("href"))
#         print(linkText)

import pandas as pd
import requests
from bs4 import BeautifulSoup
import re
from googlesearch import search

# Read the CSV file
file_path = r'C:\Users\AnujSingh\OneDrive - Foetron Consultancy Services Pvt Ltd\Documents\Foetron\Coding\D365AccountsETL\Destination\anuj_100_fs_to_d365_transformed v1.csv'
df = pd.read_csv(file_path)

# Function to search company name on Zauba Corp
def search_zauba(name):
    url = f"https://www.zaubacorp.com/companysearchresults/{name}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    results = soup.find_all('div', class_='company_name')
    for result in results:
        company_name = result.text.strip()
        if match_percentage(name, company_name) >= 50:
            return company_name
    return name

# Function to calculate match percentage
def match_percentage(name, company_name):
    name_parts = name.split()
    company_name_parts = company_name.split()
    matches = sum(1 for part in name_parts if part in company_name_parts)
    return (matches / len(name_parts)) * 100

# Update names in the DataFrame
df['Name'] = df['Name'].apply(search_zauba)

# Function to search website on Google
def search_website(name):
    query = f"{name} site:.com"
    for url in search(query, num=1, stop=1):
        return re.sub(r'^www\.|/.*$', '', url)
    return None

# Update website column in the DataFrame
df['Website'] = df['Name'].apply(search_website)

# Save the updated DataFrame to a new CSV file
output_file_path = r'C:\Users\AnujSingh\OneDrive - Foetron Consultancy Services Pvt Ltd\Documents\Foetron\Coding\D365AccountsETL\Destination\anuj_100_fs_to_d365_transformed_v2.csv'
df.to_csv(output_file_path, index=False)

print("CSV file updated successfully!")
