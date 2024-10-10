import fs from "fs";
import path from "path";
export async function GET() {
  const themesDir = path.join(process.cwd(), "public/themes");
  console.log(themesDir);

  try {
    // 只读取 themes 目录下的直接子文件夹
    const themesFolders = fs
      .readdirSync(themesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    // 主题列表
    const themes = themesFolders.map((folderName) => ({
      name: folderName,
      id: folderName,
    }));

    const repJson = {
      message: "succeed",
      code: 200,
      data: {
        themes,
      },
    };

    return Response.json(repJson);
  } catch (error) {
    console.error("Error reading themes directory:", error);
    return Response.json(
      { message: "failed", code: 500, error: "Internal server error" },
      { status: 500 }
    );
  }

  // const repJson = {
  //   message: "succeed",
  //   code: 200,
  //   data: {
  //     themes: [
  //       { name: "Lara Light Blue", id: "lara-light-blue" },
  //       { name: "Lara Dark Amber", id: "lara-dark-amber" },
  //     ],
  //   },
  // };
}
