import requests

url = "GET /api/v1/companies/search?query=MAHATHI%20SOFTWARE%20PRIVATE%20LIMITED"

payload = {}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
print("\n"*5)

print(response.text)
print("\n"*3)

