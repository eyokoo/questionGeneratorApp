const connection = require("../sql/connection");
const { handleSQLError } = require("../sql/error");

const getUserById = (req, res) => {
  let sql = "SELECT * FROM users WHERE id = ? ";
  sql = mysql.format(sql, [req.params.id]);

  connection.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err);
    return res.json(rows);
  });
}

const getUserByEmail = (req, res) => {
  let sql = "SELECT * FROM users WHERE email = ? ";
  sql = mysql.format(sql, [req.params.email]);

  connection.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err);
    return res.json(rows);
  });
}

const createUser = (req,res) => {
  let sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  sql = mysql.format(sql, [req.body]);

  connection.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err);
    return res.json(rows);
  });
}

const updateUserById = (req, res) => {
  let sql = "UPDATE users SET email = ?, password = ? WHERE id =?";
  sql = mysql.format(sql, [req.body.email, req.body.password, req.params.id]);

  connection.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err);
    return res.status(204).json();
  });
};

const deleteUserById = (req, res) => {
  let sql = "DELETE FROM users WHERE id = ?";
  sql = mysql.format(sql, [req.params.id]);

  connection.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err);
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  });
};

module.exports = { getUserById, getUserByEmail, createUser, updateUserById, deleteUserById };