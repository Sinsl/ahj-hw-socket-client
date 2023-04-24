export default async function requestServer(options, callback) {
  const url = 'https://ahj-hw-socket-server.onrender.com' + options.url;
  try {
    const response = await fetch(url, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: options.body,
    });
    const data = await response.json();
    await callback(data);
  } catch (error) {
    await callback(error);
  }
}
