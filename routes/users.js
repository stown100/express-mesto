const router = require('express').Router();
const { getUsers, getUser, createUser, updeteProfile, updateAvatar } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.patch('/users/me', updeteProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;

// const router = require('express').Router();
// const userRouter = require('./users.js')

// router.use('/users', userRouter); //localhost:PORT/users + usersRouter

// module.exports = router;