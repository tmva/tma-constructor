exports.handler = async (event) => {
  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No body' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { projectId } = data;

  const shopUrl = `https://beamish-cocada-b76084.netlify.app/templates/shop/?projectId=${projectId}`;

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      url: shopUrl,
      message: 'Магазин создан. В будущем здесь будет кастомный деплой.'
    })
  };
};