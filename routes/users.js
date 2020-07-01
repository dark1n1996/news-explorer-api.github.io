const { Router } = require('express');

const router = Router();
const { readUser, createUser, login } = require('../controllers/users');
const auth = require('../middlewars/auth');

router.get('/users/me', auth, readUser);
router.post('/signup', createUser);
router.post('/signin', login);

module.exports = router;
