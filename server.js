const http = require('http');
const mongoose = require('mongoose');
const Room = require('./models/room');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// 連接資料庫
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功');
  })
  .catch((error) => {
    console.log(error);
  });

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));

  // 使用非同步語法 async
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json',
  };
  if (req.url === '/rooms' && req.method === 'GET') {
    // 查詢 all
    const rooms = await Room.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        rooms,
      })
    );
    res.end();
  } else if (req.url === '/rooms' && req.method == 'POST') {
    req.on('end', async () => {
      try {
        // 新增資料
        const data = JSON.parse(body);
        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            rooms: newRoom,
          })
        );
        res.end();
      } catch (e) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'failed',
            message: '欄位錯誤, 或沒有此ID',
            error: e,
          })
        );
        res.end();
      }
    });
  } else if (req.url.startsWith('/rooms') && req.method == 'POST') {
    // 更新
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        if (id != null) {
          const data = JSON.parse(body);
          const newRoom = await Room.findByIdAndUpdate(id, {
            name: data.name,
            price: data.price,
            rating: data.rating,
          });
          const uptRoom = await Room.findById(id);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              rooms: uptRoom,
            })
          );
          res.end();
        } else {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: 'failed',
              message: '欄位錯誤, 或沒有此ID',
              error: e,
            })
          );
          res.end();
        }
      } catch (e) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'failed',
            message: '欄位錯誤, 或沒有此ID',
            error: e,
          })
        );
        res.end();
      }
    });
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else if (req.url === '/rooms' && req.method == 'DELETE') {
    // 刪除全部
    const rooms = await Room.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        rooms: [],
        // rooms,
        /*
          "rooms": {
            "acknowledged": true,
            "deletedCount": 7
          }
        */
      })
    );
    res.end();
  } else if (req.url.startsWith('/rooms') && req.method == 'DELETE') {
    // 刪除單筆
    // 更新
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        if (id != null) {
          const newRoom = await Room.findByIdAndDelete(id);
          const rooms = await Room.find();
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              rooms,
            })
          );
          res.end();
        } else {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: 'failed',
              message: '欄位錯誤, 或沒有此ID',
              error: e,
            })
          );
          res.end();
        }
      } catch (e) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'failed',
            message: '欄位錯誤, 或沒有此ID',
            error: e,
          })
        );
        res.end();
      }
    });
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'failed',
        message: '無此網址',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
