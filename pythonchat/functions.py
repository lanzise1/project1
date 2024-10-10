functions = [{
    "name": "read_file",
    "description": "Reads the content of a file based on the provided file_id",
    "parameters": {
        "type": "object",
        "properties": {
            "file_id": {
                "type": "string",
                "description": "The unique identifier for the file to read"
            }
        },
        "required": ["file_id"]
    }
}, {
    "name": "get_database",
    "description": "查询特定员工的相关信息，例如考勤记录或其他数据。",
    "parameters": {
        "type": "object",
        "properties": {
            "searchValue": {
                "type":
                "string",
                "description":
                "这是一个 postgresql的SQL 查询语句，用于根据不同条件查询特定员工的信息。例如，查询某员工在特定时间段内的考勤记录：\n\n示例：\n```\nSELECT e.name, a.check_in, a.check_out \nFROM hr_employee AS e \nJOIN hr_attendance AS a ON e.id = a.employee_id \nWHERE e.name = '小罗' AND a.check_in >= '2024-09-01 08:00:00' AND a.check_out <= '2024-09-30 18:00:00';\n```\n请根据实际需求替换示例中的员工姓名和时间范围，请用函数动态获取当前时间，但保留表名和字段名不变，其中check_in和check_out都是完整的datetime类型，都有年月日时分秒。"
            }
        },
        "required": ["searchValue"]
    }
}, {
    "name": "get_order_status",
    "description": "通过订单号查询订单状态",
    "parameters": {
        "type": "object",
        "properties": {
            "order_id": {
                "type": "string",
                "description": "用户提供的订单号"
            }
        },
        "required": ["order_id"]
    }
}]
