from datetime import datetime, date
import re
from typing import Dict, Any
import psycopg2
import os
from dotenv import load_dotenv
import pandas as pd
import json
import mysql.connector
from mysql.connector import Error
from urllib.parse import urlparse
# 加载 .env 文件
load_dotenv()
# 获取数据库地址
DB_PATH = os.getenv('DATABASE_URL')
MYSQL_DB_PATH = os.getenv('MYSQL_DATABASE_URL')


def get_order_status(order_id: str) -> Dict[str, Any]:
    print(order_id, 'order_id,调用了订单查询')
    conn = None
    try:
        # 连接到 MySQL 数据库
        print(MYSQL_DB_PATH, 'MYSQL_DB_PATH')
        db_url = urlparse(MYSQL_DB_PATH)
        conn = mysql.connector.connect(
            host=db_url.hostname,
            port=db_url.port,
            user=db_url.username,
            password=db_url.password,
            database=db_url.path[1:]  # 去掉前导的 '/'
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM orders WHERE order_id = %s"
            cursor.execute(query, (order_id, ))
            result = cursor.fetchall()

            if result:
                return json.dumps({
                    "order_id": order_id,
                    "record": result
                },
                                  default=lambda o: o.isoformat()
                                  if isinstance(o, date) else o)
            else:
                return json.dumps({"order_id": order_id, "status": "未找到订单"})

    except Error as e:
        return json.dumps({
            "order_id": order_id,
            "status": f"数据库查询错误: {str(e)}"
        })

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


def get_database(search_value: str) -> Dict[str, Any]:
    # 验证输入格式
    print(search_value, 'sssss')

    # 分割法律名称和条款

    # 连接到 PostgreSQL 数据库
    try:
        # 使用 psycopg2 连接到数据库
        conn = psycopg2.connect(DB_PATH)
        cursor = conn.cursor()
        # hr_attendance
        # 查询数据库
        # cursor.execute("""
        #     SELECT e.name, a.check_in, a.check_out
        #     FROM hr_employee AS e
        #     JOIN hr_attendance AS a ON e.id = a.employee_id
        #     WHERE e.name = %s
        # """, (search_value,))
        cursor.execute(search_value)

        result = cursor.fetchall()
        print(result, 'res')
        if result:
            return json.dumps({
                "status": "success",
                "content": result
            },
                              default=lambda o: o.isoformat(' ')
                              if isinstance(o, datetime) else o)
        else:
            print(11111)
            return f"未找到 {search_value} "

    except psycopg2.Error as e:
        print(f"数据库错误: {e}")
        return f"数据库查询错误: {str(e)}"

    except Exception as ex:
        print(f"其他错误: {ex}")
        return f"发生未知错误: {str(ex)}"

    finally:
        if conn:
            conn.close()


def read_file(file_id):
    print('被调用', file_id)
    file_path = f"./uploads/{file_id}"
    # 获取文件的扩展名
    file_extension = os.path.splitext(file_path)[1].lower()

    try:
        # 根据文件扩展名选择不同的读取方式
        if file_extension == '.txt':
            # 读取文本文件
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        elif file_extension in ['.xls', '.xlsx']:
            # 读取 Excel 文件
            df = pd.read_excel(file_path)
            return df.to_string()
        else:
            return "不支持的文件格式"
    except FileNotFoundError:
        return None
    except Exception as e:
        return f"读取文件时出错: {e}"
