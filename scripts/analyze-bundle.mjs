#!/usr/bin/env node

/**
 * Bundle Size Analysis Script
 * Analyzes and reports on bundle size and provides optimization suggestions
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

/**
 * Get file size in KB
 */
function getFileSizeInKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch (error) {
    return 0;
  }
}

/**
 * Analyze directory recursively
 */
function analyzeDirectory(dirPath, extensions = [".js", ".css"]) {
  const files = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
          walk(fullPath);
        }
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        const size = getFileSizeInKB(fullPath);
        files.push({
          name: entry.name,
          path: fullPath,
          size: parseFloat(size),
        });
      }
    }
  }

  walk(dirPath);
  return files;
}

/**
 * Analyze bundle
 */
function analyzeBundle() {
  console.log("\n📦 Bundle Size Analysis\n");
  console.log("=".repeat(60));

  // Analyze client build
  const clientBuildPath = path.join(projectRoot, "client", "dist");
  if (fs.existsSync(clientBuildPath)) {
    console.log("\n📱 Client Build:");
    const clientFiles = analyzeDirectory(clientBuildPath, [".js", ".css", ".woff2"]);

    let totalSize = 0;
    const largeFiles = clientFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    largeFiles.forEach((file) => {
      totalSize += file.size;
      console.log(`  ${file.name.padEnd(40)} ${file.size.toString().padStart(8)} KB`);
    });

    console.log(`\n  Total (top 10): ${totalSize.toFixed(2)} KB`);
  }

  // Analyze node_modules
  const nodeModulesPath = path.join(projectRoot, "node_modules");
  if (fs.existsSync(nodeModulesPath)) {
    console.log("\n📚 Node Modules Size:");

    const dirs = fs.readdirSync(nodeModulesPath, { withFileTypes: true });
    const moduleSizes = dirs
      .filter((d) => d.isDirectory() && !d.name.startsWith("."))
      .map((d) => {
        const modulePath = path.join(nodeModulesPath, d.name);
        let size = 0;

        function calculateSize(dir) {
          try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name);
              if (entry.isDirectory()) {
                calculateSize(fullPath);
              } else {
                size += fs.statSync(fullPath).size;
              }
            }
          } catch (error) {
            // Ignore errors
          }
        }

        calculateSize(modulePath);
        return {
          name: d.name,
          size: size / 1024,
        };
      })
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    let totalModuleSize = 0;
    moduleSizes.forEach((mod) => {
      totalModuleSize += mod.size;
      console.log(`  ${mod.name.padEnd(40)} ${mod.size.toFixed(2).toString().padStart(8)} KB`);
    });

    console.log(`\n  Total (top 10): ${totalModuleSize.toFixed(2)} KB`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 Optimization Suggestions:\n");
  console.log("  1. Use code splitting to reduce initial bundle size");
  console.log("  2. Enable gzip compression in production");
  console.log("  3. Use tree-shaking to remove unused code");
  console.log("  4. Lazy load non-critical components");
  console.log("  5. Minify CSS and JavaScript");
  console.log("  6. Remove unused dependencies from package.json");
  console.log("  7. Use dynamic imports for large libraries");
  console.log("  8. Consider using CDN for external libraries\n");
}

// Run analysis
analyzeBundle();
