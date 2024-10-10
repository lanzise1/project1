from flask import Flask, request, jsonify
import json
from openai import OpenAI
from flask_cors import CORS
import os
# sk-CFh6CR1hquiMottq7bBd77AbC5Ef4a5b99DaEd8eE7C45c05
API_SECRET_KEY = "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";   #你在智增增获取的key
# BASE_URL = "https://api.xi-ai.cn/v1/"  #智增增的base_url
BASE_URL = "https://api.groq.com/openai/v1"  #智增增的base_url

model = 'llama3-groq-70b-8192-tool-use-preview'
app = Flask(__name__)
CORS(app)
client = OpenAI(api_key=API_SECRET_KEY,base_url=BASE_URL)
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

    # 保存文件到指定目录
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    return jsonify({"message": f"File {file.filename} uploaded successfully", "file_path": file_path}), 200



# 模拟天气函数
def get_current_weather(location, unit="celsius"):
    print('被调用')
    # 这里应该是真实的天气API调用，现在只是返回模拟数据
    return f"The current weather in {location} is 22 degrees {unit}."
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    if not data or 'msg' not in data:
        return jsonify({"error": "No message provided"}), 400

    user_message = data['msg']
    messages = [{"role": "user", "content": user_message}]

    functions = [
        {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        }
    ]

    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            functions=functions,
            function_call={"name": "get_current_weather"}
        )

        response_message = response.choices[0].message

        if response_message.function_call:
            function_name = response_message.function_call.name
            function_args = json.loads(response_message.function_call.arguments)

            if function_name == "get_current_weather":
                function_response = get_current_weather(
                    location=function_args.get("location"),
                    unit=function_args.get("unit", "celsius")
                )

                messages.append(response_message.model_dump())
                messages.append({
                    "role": "function",
                    "name": function_name,
                    "content": function_response,
                })

                second_response = client.chat.completions.create(
                    model=model,
                    messages=messages,
                )
                return jsonify({"response": second_response.choices[0].message.content}), 200

        return jsonify({"response": response_message.content or "No response generated."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

