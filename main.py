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

