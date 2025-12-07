const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const { projectId, settings } = JSON.parse(event.body);
  
  // 1. Копируем шаблон
  const templateDir = path.join(__dirname, '../../src/templates/shop');
  const deployDir = path.join(__dirname, `../../deployed/${projectId}`);
  fs.cpSync(templateDir, deployDir, { recursive: true });
  
  // 2. Подставляем настройки в config.js
  const configPath = path.join(deployDir, 'config.js');
  let config = fs.readFileSync(configPath, 'utf8');
  config = config.replace('%%PROJECT_ID%%', projectId);
  fs.writeFileSync(configPath, config);
  
  // 3. Коммитим и пушим в GitHub (через git)
  execSync(`cd ${deployDir} && git add . && git commit -m "Deploy ${projectId}" && git push`, { stdio: 'inherit' });
  
  // 4. Возвращаем ссылку на деплой
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      url: `https://your-netlify-url.netlify.app/deployed/${projectId}/`
    })
  };
};