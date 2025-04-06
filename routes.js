import router from './index.js'; // مع التأكد من كتابة الامتداد .js
import express from 'express';
const router = express.Router();

// تعريف الروابط هنا
router.get('/', (req, res) => {
  res.send('مرحباً بك!');
});

export default router;