const fs = require('fs');
const path = require('path');

// 主 schema 文件路径
const mainSchemaPath = path.join(__dirname,  'schema.prisma');

// 模型文件夹路径
const modelsDir = path.join(__dirname,  'models');

// Prisma schema 文件的头部内容（包括生成器和数据源的配置）
const schemaHeader = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
`;

// 读取 models 文件夹中的所有 .prisma 文件
const modelFiles = fs.readdirSync(modelsDir).filter((file:any) => file.endsWith('.prisma'));
console.log(`Models directory not found at: ${modelsDir}`);
// 合并所有模型内容
let mergedSchema = schemaHeader;

modelFiles.forEach((file:any) => {
  const filePath = path.join(modelsDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  console.log(`Merging file: ${filePath}`);  // 输出正在合并的文件路径
  mergedSchema += '\n' + fileContent; // 逐个添加模型内容
});

// 将合并后的内容写入主 schema 文件
fs.writeFileSync(mainSchemaPath, mergedSchema.trim());
console.log('Prisma schema files have been merged successfully!');
