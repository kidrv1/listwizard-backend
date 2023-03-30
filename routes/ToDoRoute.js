const { Router } = require("express");
const { getTodo, saveTodo, updateToDo, deleteToDo, searchToDo } = require("../controllers/ToDoController");
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = Router();

router.get('/', isAuthenticated, getTodo);
router.post('/save', isAuthenticated, saveTodo);
router.get('/search/:word', isAuthenticated, searchToDo);
router.put('/update/:id', isAuthenticated, updateToDo);
router.delete('/delete/:id', isAuthenticated, deleteToDo);

module.exports = router;
