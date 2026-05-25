import * as fs from "fs";
import * as path from "path";
import { generateConfig, addConfigHistory } from "./queries";

export async function writeConfigFiles(projectPath: string): Promise<{
  success: boolean;
  files: string[];
  errors: string[];
}> {
  const files: string[] = [];
  const errors: string[] = [];

  try {
    const config = generateConfig(projectPath);

    if (Object.keys(config).length === 0) {
      return { success: false, files: [], errors: ["No configuration found"] };
    }

    // Write each config file
    for (const [filePath, content] of Object.entries(config)) {
      const fullPath = path.join(projectPath, filePath);
      const dir = path.dirname(fullPath);

      try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Write file
        fs.writeFileSync(fullPath, content, "utf-8");
        files.push(filePath);

        // Add to history
        addConfigHistory(projectPath, filePath, content);
      } catch (error) {
        errors.push(`Failed to write ${filePath}: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      files,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      files,
      errors: [`Failed to generate config: ${error}`],
    };
  }
}

export function previewConfig(projectPath: string): Record<string, string> {
  return generateConfig(projectPath);
}
