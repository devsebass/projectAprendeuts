const bcrypt = require("bcrypt");

function home(req, res) {
  const title = "Dashboard - Aprende+";
  if (req.session.loggedinStudent === true) {
    const idUser = req.session.ide;
    const nameUser = req.session.name;
    const lastnameUser = req.session.lastname;
    const imageUser = req.session.image;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const subjectsQuery = `
        SELECT mentorings.*, teachers.name AS teacherName, teachers.lastname AS teacherLastname
        FROM mentorings
        JOIN teachers ON mentorings.teacherId = teachers.id
        WHERE mentorings.studentId = ?
      `;
      conn.query(subjectsQuery, [idUser], (err, mentorings) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        res.render("student/home", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          mentorings,
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function data(req, res) {
  if (req.session.loggedinStudent === true) {
    const title = "Mis datos - Aprende+";
    const idUser = req.session.ide;
    const nameUser = req.session.name;
    const lastnameUser = req.session.lastname;
    const emailUser = req.session.email;
    const tpo_docUser = req.session.doc_type;
    const num_docUser = req.session.doc_number;
    const imageUser = req.session.image;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const mentoringsQuery = "SELECT * FROM mentorings WHERE studentId = ?";
      conn.query(mentoringsQuery, [idUser], (err, mentorings) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        res.render("student/data", {
          title,
          nameUser,
          lastnameUser,
          emailUser,
          tpo_docUser,
          num_docUser,
          imageUser,
          mentorings,
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function updatePassword(req, res) {
  const title = "Mis datos - UTS";
  const idUser = req.session.ide;
  const nameUser = req.session.name;
  const lastnameUser = req.session.lastname;
  const emailUser = req.session.email;
  const tpo_docUser = req.session.doc_type;
  const num_docUser = req.session.doc_number;
  const imageUser = req.session.image;
  const { oldPassword, newPassword } = req.body;
  const error = "Error: La contraseña anterior es incorrecta.";

  req.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send("Error interno del servidor");
    }

    const studentQuery = "SELECT * FROM students WHERE email = ?";
    conn.query(studentQuery, [emailUser], (err, userData) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const storedHash = userData[0].password;
      bcrypt.compare(oldPassword, storedHash, (err, passwordMatch) => {
        if (!passwordMatch) {
          const mentoringsQuery =
            "SELECT * FROM mentorings WHERE studentId = ?";
          conn.query(mentoringsQuery, [idUser], (err, mentorings) => {
            if (err) {
              return res.status(500).send("Error interno del servidor");
            }
            return res.render("student/data", {
              title,
              mentorings,
              nameUser,
              lastnameUser,
              emailUser,
              tpo_docUser,
              num_docUser,
              imageUser,
              error,
            });
          });
        } else {
          bcrypt.hash(newPassword, 12, (err, newHash) => {
            conn.query(
              "UPDATE students SET password = ? WHERE email = ?",
              [newHash, emailUser],
              (err) => {
                if (err) {
                  return res.status(500).send("Error interno del servidor");
                }

                const mentoringsQuery =
                  "SELECT * FROM mentorings WHERE studentId = ?";
                conn.query(mentoringsQuery, [idUser], (err, mentorings) => {
                  if (err) {
                    return res.status(500).send("Error interno del servidor");
                  }
                  req.flash("success", "Contraseña actualizada correctamente.");
                  return res.render("student/data", {
                    title,
                    mentorings,
                    nameUser,
                    lastnameUser,
                    emailUser,
                    tpo_docUser,
                    num_docUser,
                    imageUser,
                    success: req.flash("success"),
                  });
                });
              }
            );
          });
        }
      });
    });
  });
}

module.exports = { home, data, updatePassword };
