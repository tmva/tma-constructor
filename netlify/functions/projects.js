const Airtable = require('airtable');

exports.handler = async (event) => {
  const tgData = event.queryStringParameters.initData || '{}';
  // Парсим initData (заглушка, потом реализуем)
  let user_id = null;
  try {
    const params = new URLSearchParams(tgData);
    user_id = params.get('user') || 123456; // временная заглушка
  } catch(e) {
    user_id = 123456;
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(process.env.AIRTABLE_BASE);
  
  try {
    const records = await base('Projects')
      .select({ filterByFormula: `{owner_tg_id} = ${user_id}` })
      .firstPage();
    
    const projects = records.map(record => ({
      id: record.id,
      name: record.get('name') || 'Без названия',
      type: record.get('template_type') || 'shop',
      created: record.get('created_at') || new Date().toISOString()
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projects)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};