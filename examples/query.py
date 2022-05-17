import requests

data = {"q": "扑救火灾最有利的阶段是        。|火灾初起阶段|火灾发展阶段|火灾猛烈燃烧阶段"}

# 正确访问
response = requests.post("https://mondayfirst.top/tiku/query", data)
print(response.status_code, response.text)

# # 错误访问
# response = requests.post("https://mondayfirst.top/tiku/query", {"q": "扑救火灾最有利的阶段是        。"})
# print(response.status_code, response.text)

# response = requests.post("https://mondayfirst.top/tiku/query", {})
# print(response.status_code, response.text)

# response = requests.get("https://mondayfirst.top/tiku/query", data)
# print(response.status_code, response.text)
