// Import required modules
const ToDoModel = require('../models/ToDoModel');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Display To Do
module.exports.getTodo = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const options = {
      page,
      limit
  };

  const { docs, totalDocs, totalPages } = await ToDoModel.paginate({ userId: req.user._id }, options);

  res.send({
      data: docs,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalDocs,
      links: {
          next: `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page + 1}&limit=${limit}`,
          prev: `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page - 1}&limit=${limit}`
      }
  });
};


// Search To Do
module.exports.searchToDo = async (req, res) => {
  const { word } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const options = {
    page,
    limit
  };

  const { docs, totalDocs, totalPages } = await ToDoModel.paginate({userId: req.user._id, $or:[{title: {$regex: word, $options: 'i'}},{task: {$regex: word, $options: 'i'}}]}, options);

  res.send({
    data: docs,
    currentPage: page,
    totalPages: totalPages,
    totalItems: totalDocs,
    links: {
      next: `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page + 1}&limit=${limit}`,
      prev: `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page - 1}&limit=${limit}`
    }
  });
};

// Create To Do
module.exports.saveTodo = async (req, res) => {
  const { title, task, startDate, endDate } = req.body;
  
  const newTodo = {
    title,
    task,
    startDate: startDate ? startDate : null,
    endDate: endDate ? endDate : null,
    userId: req.user._id // add the userId field from the currently logged-in user
  };

  ToDoModel.create(newTodo)
    .then((data) => {
      console.log("Added Successfully");
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.error("Data cannot be added");
      console.error(err);
      res.status(500).send("Data cannot be added");
    });
};


// Update To Do
module.exports.updateToDo = async (req, res) => {
  const { title, task, startDate, endDate } = req.body;
  const { id } = req.params;
  
  ToDoModel.findOneAndUpdate({_id: id, userId: req.user._id}, {title, task, startDate, endDate})
  .then((data) => {
      if(data){
          res.status(201).send("Updated Successfully");
      } else {
          res.status(404).send("Data not found");
      }
  })
  .catch((err) => res.status(500).send("Data cannot be updated"));
}


// Delete To Do
module.exports.deleteToDo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await ToDoModel.findById(id);
    if (!todo) {
      return res.status(404).send("To-Do item not found");
    }
    if (todo.userId.toString() !== req.user._id.toString()) {
      return res.status(401).send("Unauthorized access");
    }
    await ToDoModel.findByIdAndDelete(id);
    res.send("Deleted Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Data cannot be deleted");
  }
};
