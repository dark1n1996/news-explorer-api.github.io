const { Router } = require('express');

const router = Router();
const { readUser, createUser, login } = require('../controllers/users');

router.get('/users/me', readUser);
router.post('/signup', createUser);
router.post('/signin', login);

module.exports = router;
