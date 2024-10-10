export function extractThemeName(url: string): string | undefined {
    const regex = /\/themes\/([^/]+)\/theme\.css/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return undefined;
  }
  
  // 使用示例