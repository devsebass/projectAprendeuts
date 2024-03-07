const bcrypt = require("bcrypt");

function home(req, res) {
  const title = "Dashboard - Aprende+";
  if (req.session.loggedinTeacher === true) {
    const idUser = req.session.ideTeacher;
    const nameUser = req.session.nameTeacher;
    const lastnameUser = req.session.lastnameTeacher;
    const imageUser = req.session.imageTeacher;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const mentoringsQuery = `
      SELECT mentorings.*, students.name AS studentName, students.lastname AS studentLastname
      FROM mentorings
      JOIN students ON mentorings.studentId = students.id
      WHERE mentorings.teacherId = ?
      `;
      conn.query(mentoringsQuery, [idUser], (err, mentorings) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        res.render("teacher/home", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          mentorings,
        });
      });
    });
  } else {
    res.redirect("/teacher/login");
  }
}

function data(req, res) {
  if (req.session.loggedinTeacher === true) {
    const title = "Mis datos - Aprende+";
    const idUser = req.session.ideTeacher;
    const nameUser = req.session.nameTeacher;
    const lastnameUser = req.session.lastnameTeacher;
    const imageUser = req.session.imageTeacher;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const mentoringsQuery = "SELECT * FROM mentorings WHERE teacherId = ?";
      const teachersQuery = `SELECT teachers.*, subjects.name AS subjectName
      FROM teachers
      JOIN subjects ON teachers.subjectId = subjects.id
      WHERE teachers.id = ?`;

      conn.query(mentoringsQuery, [idUser], (err, mentorings) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        conn.query(teachersQuery, [idUser], (err, teachers) => {
          if (err) {
            return res.status(500).send("Error interno del servidor");
          }

          res.render("teacher/data", {
            title,
            nameUser,
            lastnameUser,
            imageUser,
            mentorings,
            teachers,
            success: req.flash("success"),
          });
        });
      });
    });
  } else {
    res.redirect("/teacher/login");
  }
}

function updatePassword(req, res) {
  const title = "Mis datos - Aprende+";
  const idUser = req.session.ideTeacher;
  const nameUser = req.session.nameTeacher;
  const lastnameUser = req.session.lastnameTeacher;
  const imageUser = req.session.imageTeacher;
  const { oldPassword, newPassword } = req.body;
  const error = "Error: La contraseña anterior es incorrecta.";

  req.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send("Error interno del servidor");
    }

    const mentoringsQuery = "SELECT * FROM mentorings WHERE teacherId = ?";
    const teachersQuery = `SELECT teachers.*, subjects.name AS subjectName
    FROM teachers
    JOIN subjects ON teachers.subjectId = subjects.id
    WHERE teachers.id = ?`;
    const getPasswordQuery = "SELECT password FROM teachers WHERE id = ?";

    conn.query(mentoringsQuery, [idUser], (err, mentorings) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      conn.query(teachersQuery, [idUser], (err, teachers) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        conn.query(getPasswordQuery, [idUser], (err, results) => {
          if (err) {
            return res.status(500).send("Error interno del servidor");
          }

          if (results.length === 0) {
            return res.status(404).send("Usuario no encontrado");
          }

          const hashedPassword = results[0].password;

          bcrypt.compare(oldPassword, hashedPassword, (err, passwordMatch) => {
            if (err) {
              return res.status(500).send("Error interno del servidor");
            }

            if (!passwordMatch) {
              console.log("Valor de error:", error);
              res.render("teacher/data", {
                title,
                nameUser,
                lastnameUser,
                imageUser,
                teachers,
                mentorings,
                error,
              });
            } else {
              const saltRounds = 12;
              bcrypt.hash(newPassword, saltRounds, (err, hashedNewPassword) => {
                if (err) {
                  return res.status(500).send("Error interno del servidor");
                }

                const updatePasswordQuery =
                  "UPDATE teachers SET password = ? WHERE id = ?";
                conn.query(
                  updatePasswordQuery,
                  [hashedNewPassword, idUser],
                  (err) => {
                    if (err) {
                      return res.status(500).send("Error interno del servidor");
                    }
                    req.flash(
                      "success",
                      "Contraseña actualizada correctamente."
                    );
                    res.redirect("/teacher/data");
                  }
                );
              });
            }
          });
        });
      });
    });
  });
}

function rating(req, res) {
  if (req.session.loggedinTeacher === true) {
    const title = "Puntuaciones y opiniones - Aprende+";
    const idUser = req.session.ideTeacher;
    const nameUser = req.session.nameTeacher;
    const lastnameUser = req.session.lastnameTeacher;
    const imageUser = req.session.imageTeacher;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const mentoringsQuery = "SELECT * FROM mentorings WHERE teacherId = ?";
      const ratingsQuery =
        "SELECT ratings.*, students.image AS studentImage FROM students JOIN ratings ON ratings.studentId = students.id WHERE teacherId = ?";
      const countQuery =
        "SELECT COUNT(*) AS count FROM ratings WHERE teacherId = ?";
      const averageQuery =
        "SELECT AVG(rating) AS average FROM ratings WHERE teacherId = ?";

      conn.query(mentoringsQuery, [idUser], (err, mentorings) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        conn.query(ratingsQuery, [idUser], (err, ratings) => {
          if (err) {
            return res.status(500).send("Error interno del servidor");
          }

          conn.query(countQuery, [idUser], (err, countResult) => {
            if (err) {
              return res.status(500).send("Error interno del servidor");
            }

            const count = countResult[0].count;

            conn.query(averageQuery, [idUser], (err, averageResult) => {
              if (err) {
                return res.status(500).send("Error interno del servidor");
              }

              const average = averageResult[0].average;

              res.render("teacher/ratings", {
                title,
                nameUser,
                lastnameUser,
                imageUser,
                ratings,
                count,
                average,
                mentorings,
              });
            });
          });
        });
      });
    });
  } else {
    res.redirect("/teacher/login");
  }
}

module.exports = {
  home,
  data,
  updatePassword,
  rating,
};
