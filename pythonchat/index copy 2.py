from flask import Flask, request, jsonify
import json
import uuid
from groq import Groq
from flask_cors import CORS
import os
# sk-CFh6CR1hquiMottq7bBd77AbC5Ef4a5b99DaEd8eE7C45c05
API_SECRET_KEY = "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";   #你在智增增获取的key
# BASE_URL = "https://api.xi-ai.cn/v1/"  #智增增的base_url
BASE_URL = "https://api.groq.com/openai/v1"  #智增增的base_url

MODEL  = 'llama3-groq-70b-8192-tool-use-preview'
app = Flask(__name__)
CORS(app)
client = Groq(api_key=API_SECRET_KEY)
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
        "file_path": file_path
    }), 200



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

    tools = [
        {
            "type": "function",
            "function": {
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
            },
        }
    ]
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=tools,
            tool_choice="auto",
            max_tokens=4096
        )

        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        if tool_calls:
            available_functions = {
                "get_current_weather": get_current_weather,
            }
            messages.append(response_message)
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_to_call = available_functions[function_name]
                function_args = json.loads(tool_call.function.arguments)
                function_response = function_to_call(
                    expression=function_args.get("expression")
                )
                messages.append(
                    {
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": function_response,
                    }
                )
            second_response = client.chat.completions.create(
                model=MODEL,
                messages=messages
            )
            return jsonify({"response": second_response.choices[0].message.content}), 200

        return jsonify({"response": response_message.content or "No response generated."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

