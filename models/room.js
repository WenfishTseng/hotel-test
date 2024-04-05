const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      required: [true, '價格必填'],
    },
    rating: Number,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false, // 不會被前台搜尋到
    },
  },

  {
    versionKey: false, // 可放置條件: 移除欄位 __v 方法
    // collection: 'room', // 自訂 collection 名稱 寫死
    // timestamps: true, // 加入時間戳, createdAt updatedAt
  }
);

// collection名稱 開頭強制小寫 自訂model強制加s
const Room = mongoose.model('RoomTest', roomSchema);

module.exports = Room;
