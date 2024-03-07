const bcrypt = require("bcrypt");

function login(req, res) {
  if (req.session.loggedinTeacher !== true) {
    const title = "Inicio de Sesión - Aprende+";
    res.render("teacher/login", { title });
  } else {
    res.redirect("/teacher/home");
  }
}

function auth(req, res) {
  const data = req.body;

  req.getConnection((err, conn) => {
    if (err) {
      return handleError(
        res,
        "Error al realizar la conexión con la base de datos:",
        err
      );
    }

    const query = "SELECT * FROM teachers WHERE email = ?";
    conn.query(query, [data.email], (err, userdata) => {
      if (err) {
        return handleError(res, "Error al realizar la consulta:", err);
      }

      if (userdata.length > 0) {
        const teacher = userdata[0];
        bcrypt.compare(data.password, teacher.password, (err, isMatch) => {
          if (err) {
            return handleError(res, "Error al comparar contraseñas:", err);
          }

          if (isMatch) {
            setSessionVariables(req, teacher);
            res.redirect("/teacher/home");
          } else {
            res.render("teacher/login", {
              error: "Error: Contraseña incorrecta.",
            });
          }
        });
      } else {
        res.render("teacher/login", {
          error: "Error: El usuario no se encuentra registrado.",
        });
      }
    });
  });
}

function handleError(res, message, err) {
  console.error(message, err);
  res.status(500).send("Error interno del servidor");
}

function setSessionVariables(req, teacher) {
  req.session.loggedinTeacher = true;
  req.session.ideTeacher = teacher.id;
  req.session.nameTeacher = teacher.name;
  req.session.lastnameTeacher = teacher.lastname;
  req.session.imageTeacher = teacher.image;
}

function logout(req, res) {
  if (req.session.loggedinTeacher) {
    req.session.destroy();
  }

  res.redirect("/teacher/login");
}

module.exports = { login, auth, logout };
