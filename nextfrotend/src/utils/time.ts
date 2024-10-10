type DatePart = 'year' | 'mon' | 'day' | 'hour' | 'min' | 'sec';

export function getCurrentDate(part: DatePart): string {
  const date = new Date();
  
  const year = String(date.getFullYear());
  const mon = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要+1
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const sec = String(date.getSeconds()).padStart(2, '0');

  // 根据不同的输入参数返回相应的日期字符串
  switch (part) {
    case 'year':
      return `${year}`;
    case 'mon':
      return `${year}/${mon}`;
    case 'day':
      return `${year}/${mon}/${day}`;
    case 'hour':
      return `${year}/${mon}/${day} ${hour}`;
    case 'min':
      return `${year}/${mon}/${day} ${hour}:${min}`;
    case 'sec':
      return `${year}/${mon}/${day} ${hour}:${min}:${sec}`;
    default:
      return `${year}/${mon}/${day}`; // 默认返回完整日期
  }
}
