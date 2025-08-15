#!/usr/bin/env node

/**
 * 脚本管理器 - 统一的脚本运行入口
 * 使用方法: node scripts/run.js <script-name> [args...]
 */

const { spawn } = require('child_process');
const path = require('path');

// 可用的脚本列表
const scripts = {
  'cleanup': { 
    file: 'cleanup-database.js', 
    description: '数据库清理脚本', 
    usage: 'node scripts/run.js cleanup [all|users|ingredients|user <username>]'
  },
  'test-api': { 
    file: 'test-ingredient-api.js', 
    description: '食材API测试脚本', 
    usage: 'node scripts/run.js test-api'
  },
  'test-nutrition': { 
    file: 'test-nutrition-api.js', 
    description: '营养API测试脚本', 
    usage: 'node scripts/run.js test-nutrition'
  },
  'test-extended': { 
    file: 'test-extended-nutrition.js', 
    description: '扩展营养数据库测试脚本', 
    usage: 'node scripts/run.js test-extended'
  },
  'test-frontend': { 
    file: 'test-frontend-integration.js', 
    description: '前端集成测试脚本', 
    usage: 'node scripts/run.js test-frontend'
  },
  'demo': { 
    file: 'demo-ingredient-features.js', 
    description: '食材功能演示脚本', 
    usage: 'node scripts/run.js demo'
  }
};

function showHelp() {
  console.log('🛠️  Backend Scripts Manager\n');
  console.log('使用方法:');
  console.log('  node scripts/run.js <script-name> [args...]\n');
  console.log('可用脚本:');
  
  Object.entries(scripts).forEach(([name, info]) => {
    console.log(`  📄 ${name.padEnd(12)} - ${info.description}`);
    console.log(`     ${info.usage}\n`);
  });
  
  console.log('示例:');
  console.log('  node scripts/run.js cleanup stats     # 查看数据库统计');
  console.log('  node scripts/run.js test-api          # 运行API测试');
  console.log('  node scripts/run.js demo              # 运行功能演示');
  console.log('  node scripts/run.js cleanup users     # 清理所有用户');
}

function runScript(scriptName, args) {
  const script = scripts[scriptName];
  if (!script) {
    console.error(`❌ 未知脚本: ${scriptName}`);
    console.error('运行 "node scripts/run.js help" 查看可用脚本');
    process.exit(1);
  }
  
  const scriptPath = path.join(__dirname, script.file);
  console.log(`🚀 运行脚本: ${script.description}\n`);
  
  const child = spawn('node', [scriptPath, ...args], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log(`\n✅ 脚本 "${scriptName}" 执行完成`);
    } else {
      console.log(`\n❌ 脚本 "${scriptName}" 执行失败 (退出码: ${code})`);
    }
    process.exit(code);
  });
  
  child.on('error', (error) => {
    console.error(`❌ 执行脚本时发生错误: ${error.message}`);
    process.exit(1);
  });
}

// 主逻辑
const [,, scriptName, ...args] = process.argv;

if (!scriptName || scriptName === 'help' || scriptName === '--help' || scriptName === '-h') {
  showHelp();
  process.exit(0);
}

runScript(scriptName, args); 