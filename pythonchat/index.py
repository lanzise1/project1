from flask import Flask, request, jsonify
import json
import uuid
import pandas as pd
from openai import OpenAI
from flask_cors import CORS
import os
from tools import get_database, read_file,get_order_status
from functions import functions
import re

API_SECRET_KEY = "sk-CFh6CR1hquiMottq7bBd77AbC5Ef4a5b99DaEd8eE7C45c05"
BASE_URL = "https://api.xi-ai.cn/v1/"
# BASE_URL = "https://api.groq.com/openai/v1"

MODEL = 'gpt-4o'
app = Flask(__name__)
CORS(app)
client = OpenAI(api_key=API_SECRET_KEY, base_url=BASE_URL)
# 设置上传文件的目录
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/upload', methods=['POST'])
def upload_file():
    # 检查请求中是否有文件
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    # 如果文件名为空
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # 生成唯一文件名
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    # 保存文件到指定目录
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)

    return jsonify({
        "message": f"File {unique_filename} uploaded successfully",
        "file_path": file_path,
        "file_id": unique_filename
    }), 200


# 创建一个全局变量来保存对话历史
conversation_history = []
MAX_TOKENS = 128000  # 假设模型的最大token限制为4096

def count_tokens(messages):
    total_tokens = 0
    for message in messages:
        if 'content' in message and isinstance(message['content'], str):
            total_tokens += len(message['content'])
    return total_tokens

def trim_conversation_history():
    while count_tokens(conversation_history) > MAX_TOKENS:
        if len(conversation_history) > 1:
            # 删除第二条消息，保留第一条（假设是系统消息）
            conversation_history.pop(1)
        else:
            break

def extract_order_id(user_input):
    pattern = r'\b\d{6,12}\b'
    matches = re.findall(pattern, user_input)
    if matches:
        return matches
    return []

@app.route('/chat', methods=['POST'])
def chat():
    global conversation_history

    data = request.json
    if not data or 'msg' not in data:
        return jsonify({"error": "No message provided"}), 400

    user_message = data['msg']
    file_id = data.get('fileId')

    conversation_history.append({"role": "user", "content": user_message})

    if file_id:
        file_content = read_file(file_id)
        if file_content:
            conversation_history.append({"role": "system", "content": file_content})
        else:
            return jsonify({"error": "File not found or could not be read"}), 404

    order_id = extract_order_id(user_message)
    print(order_id, 'order_id')
    if order_id:
        # 将订单号信息添加到对话历史中，作为系统消息，提示GPT可能需要调用函数
        conversation_history.append({"role": "system", "content": f"订单号已提取: {order_id},如果有多个订单号，请你依次查询"})
    print(conversation_history, 'conversation_history')
    trim_conversation_history()

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=conversation_history,
            functions=functions,
            function_call="auto"
        )

        response_message = response.choices[0].message

        if hasattr(response_message, 'function_call')and response_message.function_call:
            # 如果有函数调用，请执行相应的函数
            function_name = response_message.function_call.name
            function_args = json.loads(response_message.function_call.arguments)

            # 根据函数名调用相应函数
            if function_name == "read_file":

                function_response = read_file(function_args.get('file_id'))
            elif function_name == "get_database":
                function_response = get_database(function_args.get("searchValue"))
            elif function_name == "get_order_status":
                function_response = get_order_status(function_args.get("order_id"))
            else:
                function_response = "未知的函数调用"

            # 打印函数调用结果以进行调试
            print(f"函数调用结果: {function_response}")

            # 记录函数调用结果并更新对话历史
            conversation_history.append(response_message)
            conversation_history.append({
                "role": "function",
                "name": function_name,
                "content": function_response,
            })

            # 重新请求模型，让它生成最终回复
            second_response = client.chat.completions.create(
                model=MODEL,
                messages=conversation_history,
            )
            second_response_message = second_response.choices[0].message

            # 检查生成的第二次回复是否为空
            if not second_response_message.content:
                print("警告: 第二次回复为空")
                return jsonify({"response": "No response generated."}), 200

            conversation_history.append(second_response_message)
            return jsonify({"response": second_response_message.content}), 200

        else:
            # 如果没有函数调用，则直接返回GPT的回复
            if not response_message.content:
                print("警告: 回复内容为空")
                return jsonify({"response": "No response generated."}), 200

            conversation_history.append(response_message)
            return jsonify({"response": response_message.content}), 200

    except Exception as e:
        print(f"异常发生: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
