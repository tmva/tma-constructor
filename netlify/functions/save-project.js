const Airtable = require('airtable');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { initData, project } = JSON.parse(event.body);
    // TODO: Парсим initData, получаем user_id
    const user_id = 123456; // временно

    const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(process.env.AIRTABLE_BASE);
    
    // Ищем существующий проект или создаём новый
    const existing = await base('Projects')
      .select({ filterByFormula: `{owner_tg_id} = ${user_id}`, maxRecords: 1 })
      .firstPage();

    if (existing.length > 0) {
      // Обновляем
      await base('Projects').update(existing[0].id, {
        'name': project.name,
        'template_type': project.template,
        'settings': JSON.stringify(project)
      });
    } else {
      // Создаём
      await base('Projects').create({
        'owner_tg_id': user_id,
        'name': project.name,
        'template_type': project.template,
        'settings': JSON.stringify(project),
        'created_at': new Date().toISOString()
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};