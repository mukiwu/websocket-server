const fastify = require('fastify')({ logger: true });
const path = require('path');

// 配置 Fastify 靜態文件服務
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});

// 設定 HTTP 路由（如果需要，可以顯示首頁）
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

// 啟動 HTTP 伺服器
const start = async () => {
  try {
    fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })
      .then((address) => {
        console.log(`Server listening on ${address}`);
      })
      .catch((err) => {
        fastify.log.error(err);
        process.exit(1);
      });

    // 啟動 WebSocket 伺服器
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ server: fastify.server });

    wss.on('connection', (ws) => {
      console.log('New client connected!');

      const interval = setInterval(() => {
        ws.send('Hello from the server!');
      }, 1000);

      ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`You sent: ${message}`);
      });

      ws.on('close', () => {
        clearInterval(interval);
        console.log('Client has disconnected.');
      });
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
