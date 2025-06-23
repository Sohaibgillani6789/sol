async function askLlama(message) {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt: `You are Sol, a kind AI friend who gives emotionally supportive life advice. Reply kindly.\nUser: ${message}`,
      stream: false
    })
  });

  const data = await response.json();
  return data.response;
}

module.exports = { askLlama }; 