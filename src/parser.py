from bs4 import BeautifulSoup as bs 
import requests
import json
from functools import reduce

page = requests.get('https://en.wikipedia.org/wiki/List_of_artificial_objects_on_Mars').text
soup = bs(page, 'html.parser')

table = soup.find("table", { "border" : "2" })
rows = (table.find_all("tr"))

def getrow(row):
    cols = row.find_all('td')
    arr = []
    for col in cols:
        arr.append(col.text)
    return arr

def red(acc, cur):
    arr = getrow(cur)
    acc.append(arr)
    return acc

acc = []

data = reduce(red, rows, acc) 

f = open('objects.json', 'w')
for d in data:
    f.write(json.dumps(d, separators=(',', ':'),  indent=4) + '\n')

f.close()
