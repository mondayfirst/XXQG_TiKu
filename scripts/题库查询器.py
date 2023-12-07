import json
import requests
import tkinter as tk
from tkinter import messagebox, font

# 如果题库加载过慢，请更换其他CDN
TIKU_JSON_URL = "https://fastly.jsdelivr.net/gh/mondayfirst/XXQG_TiKu@main/%E9%A2%98%E5%BA%93_%E6%8E%92%E5%BA%8F%E7%89%88.json"

def load_questions():
    url = TIKU_JSON_URL
    response = requests.get(url)
    questions = json.loads(response.text)
    return questions

def search_questions(event=None):
    keywords = entry.get().strip().split()
    result_text.delete("1.0", tk.END)
    found_questions = []

    for question, answer in questions.items():
        question_lower = question.lower()
        if all(keyword.lower() in question_lower for keyword in keywords):
            found_questions.append((question, answer))
    
    if found_questions:
        for i, (question, answer) in enumerate(found_questions):
            result_text.insert(tk.END, f"Q{i + 1}: \n")
            options = question.split("|")
            for option in options:
                result_text.insert(tk.END, f"{option}\n")
            result_text.insert(tk.END, f"Answer:  {answer}\n")
            result_text.insert(tk.END, "\n")
    else:
        messagebox.showinfo("结果", "未找到匹配的问题")

def clear_entry(event):
    entry.delete(0, tk.END)

root = tk.Tk()

root.title("学习强国挑战答题题库")

print("正在加载题库，请稍后")
questions = load_questions()

title_font = font.Font(family="SimSun", size=16, weight="bold")

label = tk.Label(root, text="请输入关键词进行查询（关键词之间使用空格分开）", font=title_font)
label.grid(row=0, column=0, columnspan=2)

entry_font = font.Font(family="SimSun", size=16)
entry = tk.Entry(root, width=30, font=entry_font)
entry.grid(row=1, column=0, padx=10, pady=5, sticky="e")
entry.bind("<Button-1>", clear_entry)  # 点击输入框清空内容
entry.bind("<Return>", search_questions)  # 回车键触发查询
entry.focus_set()  # 焦点位于输入框

button_font = font.Font(family="SimSun", size=16, weight="bold")
search_button = tk.Button(root, text="查询", command=search_questions, font=button_font)
search_button.grid(row=1, column=1, padx=10, pady=5, sticky="w")

result_text_font = font.Font(family="SimSun", size=16)
result_text = tk.Text(root, width=100, font=result_text_font, wrap=tk.WORD)
result_text.grid(row=2, column=0, columnspan=2, padx=10, pady=5, sticky="nsew")

result_scrollbar = tk.Scrollbar(root)
result_scrollbar.grid(row=2, column=2, padx=5, pady=5, sticky="ns")
result_scrollbar.configure(command=result_text.yview)
result_text.configure(yscrollcommand=result_scrollbar.set)

root.grid_rowconfigure(2, weight=1)
root.grid_columnconfigure((0, 1), weight=1)

root.mainloop()