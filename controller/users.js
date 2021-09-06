// const { find } = require("lodash");

// function getUserById(request, response) {
//   const { id } = request.user;
//   const user = find(users, { id });

//   if (!user) {
//     response.send(`No user found. User Id: ${user.id}`);
//     return;
//   }

//   response.json(user);
// }

// function getUserByEmail(email) {
//   const user = find(users, { email });

//   if (!user) {
//     return null;
//   }

//   return user;
// }

// function createUser(email, password, name) {
//   const newUser = { email, password, name };
//   newUser.id = users.length + 1;

//   users.push(newUser);

//   return newUser;
// }

// module.exports = { getUserById, getUserByEmail, createUser };