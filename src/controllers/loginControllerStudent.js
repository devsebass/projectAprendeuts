const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

function login(req, res) {
  if (req.session.loggedinStudent !== true) {
    const title = "Inicio de Sesión - Aprende+";
    res.render("student/login", { title, success: req.flash("success") });
  } else {
    res.redirect("/student/home");
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

    const query = "SELECT * FROM students WHERE email = ?";
    conn.query(query, [data.email], (err, userdata) => {
      if (err) {
        return handleError(res, "Error al realizar la consulta:", err);
      }

      if (userdata.length > 0) {
        const student = userdata[0];
        bcrypt.compare(data.password, student.password, (err, isMatch) => {
          if (err) {
            return handleError(res, "Error al comparar contraseñas:", err);
          }

          if (isMatch) {
            setSessionVariables(req, student);
            res.redirect("/student/home");
          } else {
            res.render("student/login", {
              error: "Error: Contraseña incorrecta.",
            });
          }
        });
      } else {
        res.render("student/login", {
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

function setSessionVariables(req, student) {
  req.session.loggedinStudent = true;
  req.session.ide = student.id;
  req.session.name = student.name;
  req.session.lastname = student.lastname;
  req.session.email = student.email;
  req.session.doc_number = student.doc_number;
  req.session.doc_type = student.doc_type;
  req.session.image = student.image;
}

function register(req, res) {
  if (req.session.loggedinStudent !== true) {
    const title = "Registro de Usuario - Aprende+";
    res.render("student/register", { title });
  } else {
    res.redirect("/student/home");
  }
}

function user(req, res) {
  const data = req.body;
  const defaultImageForGender = determineDefaultImageForGender(data.gender);

  if (!data.image) {
    data.image = defaultImageForGender;
  }

  req.getConnection((err, conn) => {
    if (err) {
      return handleDatabaseError(
        res,
        "Error al realizar la conexión con la base de datos:",
        err
      );
    }

    conn.query(
      "SELECT * FROM students WHERE email = ?",
      [data.email],
      (err, userdata) => {
        if (err) {
          return handleDatabaseError(
            res,
            "Error al ejecutar la consulta:",
            err
          );
        }

        if (userdata.length > 0) {
          res.render("student/register", {
            error: "Error: El usuario ya se encuentra registrado.",
          });
        } else {
          bcrypt.hash(data.password, 12).then((hash) => {
            data.password = hash;

            req.getConnection((err, conn) => {
              if (err) {
                return handleDatabaseError(
                  res,
                  "Error al realizar la conexión con la base de datos:",
                  err
                );
              }

              conn.query("INSERT INTO students SET ?", [data], (err) => {
                if (err) {
                  console.error(
                    "Error al insertar datos en la base de datos:",
                    err
                  );
                  res.status(500).send("Error interno del servidor");
                } else {
                  req.flash(
                    "success",
                    "Te has registrado exitosamente, ahora puedes iniciar sesión."
                  );
                  res.redirect("/student/login");
                }
              });
            });
          });
        }
      }
    );
  });
}

function handleDatabaseError(res, message, err) {
  console.error(message, err);
  res.status(500).send("Error interno del servidor");
}

function determineDefaultImageForGender(gender) {
  const defaultImageForFemale = "/image-1707015452747.svg";
  const defaultImageForMale = "/image-1707015468443.svg";
  const defaultImageForOther = "/image-1707015482024.svg";

  // Determina la imagen predeterminada según el género
  switch (gender) {
    case "Masculino":
      return defaultImageForMale;
    case "Femenino":
      return defaultImageForFemale;
    default:
      return defaultImageForOther;
  }
}

function logout(req, res) {
  if (req.session.loggedinStudent) {
    req.session.destroy();
  }

  res.redirect("/student/login");
}

function formResetPassword(req, res) {
  const title = "Restablecimiento de la contraseña - Aprende+";
  res.render("student/resetForm", { title });
}

function sentToken(req, res) {
  const email = req.body.email;
  const title = "Restablecimiento de la contraseña - Aprende+";

  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM students WHERE email = ?",
      [email],
      (err, userdata) => {
        if (err) {
          console.error("Error al ejecutar la consulta:", err);
          return res.status(500).send("Error interno del servidor");
        }

        if (userdata.length === 0) {
          return res.render("student/resetForm", {
            error: "Error: El usuario no se encuentra registrado.",
            title,
          });
        }

        const name = userdata[0].name;
        const lastname = userdata[0].lastname;

        const token = crypto.randomBytes(20).toString("hex");
        const expired = Date.now() + 5 * 60 * 1000;

        conn.query(
          "UPDATE students SET token=?, expired=? WHERE email=?",
          [token, expired, email],
          (err, rows) => {
            if (err) {
              console.error(
                "Error al insertar datos en la base de datos:",
                err
              );
            } else {
              console.log("Datos guardados correctamente");
            }
          }
        );

        res.render("student/resetFormConfirm", { title });

        const resetUrl = `http://${req.headers.host}/student/resetPassword/${token}`;
        sentMailPassword(resetUrl, name, lastname, email);
        console.log(resetUrl);
      }
    );
  });
}

function validationToken(req, res) {
  const token = req.params.Token;
  const title = "Cambio de la contraseña - Aprende+";

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al realizar la conexión con la base de datos:", err);
      return res.status(500).send("Error interno del servidor");
    }

    conn.query("SELECT * FROM students WHERE token = ?", [token], (err) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        return res.status(500).send("Error interno del servidor");
      }

      res.render("student/resetPassword", { title });
    });
  });
}

function updatePassword(req, res) {
  const token = req.params.Token;
  const newPassword = req.body.password;
  const title = "Cambio de la contraseña - Aprende+";

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al realizar la conexión con la base de datos:", err);
      return res.status(500).send("Error interno del servidor");
    }

    conn.query(
      "SELECT * FROM students WHERE token = ?",
      [token],
      (err, results) => {
        if (err) {
          console.error("Error al ejecutar la consulta:", err);
          return res.status(500).send("Error interno del servidor");
        }

        if (results.length === 0) {
          return res.render("student/resetPassword", {
            error:
              "Error: El token es inválido, no es posible cambiar la contraseña.",
            title,
          });
        }

        const usuario = results[0];

        if (usuario.expired === undefined || usuario.expired < Date.now()) {
          return res.render("student/resetPassword", {
            error:
              "Error: El token es inválido o ha expirado, no es posible cambiar la contraseña.",
            title,
          });
        }

        const email = usuario.email;
        const expired = null;
        const newToken = null;

        if (!newPassword) {
          return res.render("student/resetPassword", {
            error: "Error: La nueva contraseña no puede ser nula o indefinida.",
            title,
          });
        }

        bcrypt.hash(newPassword, 12, (err, newHash) => {
          if (err) {
            console.error(
              "Error al generar el hash de la nueva contraseña:",
              err
            );
            return res.status(500).send("Error interno del servidor");
          }

          conn.query(
            "UPDATE students SET token=?, expired=?, password=? WHERE email=?",
            [newToken, expired, newHash, email],
            (err) => {
              if (err) {
                console.error("Error al actualizar la base de datos:", err);
                return res.status(500).send("Error interno del servidor");
              }

              req.flash(
                "success",
                "Contraseña actualizada correctamente, ahora puedes iniciar sesión."
              );
              req.session.passwordChanged = true;
              res.redirect("/student/login");
            }
          );
        });
      }
    );
  });
}

//Nodemailer configuration
sentMailPassword = async (token, name, lastname, email) => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "utscorreo@gmail.com",
      pass: "zazn yugr gxtg ixki",
    },
  };

  const message = {
    from: "Tutorias Uts<utscorreo@gmail.com>",
    to: `${email}`,
    subject: "Restablecimiento de la contraseña",
    html: `
          <html>
          <head>
              <style>
                  body {
                      font-family: 'Arial', sans-serif;
                      background-color: #EEEEEE;
                      color: #333;
                      margin: 0;
                      padding: 20px;
                  }
              
                  .container {
                      max-width: 630px;
                      margin: 0 auto;
                      margin-top: 20px;
                      background-color: #fafafa;
                      border-radius: 5px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
          
                  .container-header {
                      background: #B5BF00;
                      padding: 15px 30px 15px 30px;
                      margin-bottom: 15px;
                      border-top-left-radius:  5px;
                      border-top-right-radius:  5px;
                  }
          
                  .container-header h1 {
                      color: #fafafa;
                      text-align: center;
                  }
                  
                  .container-data {
                      padding: 20px 40px 20px 40px;
                  }
                  
                  .text-final {
                      margin-top: 50px;
                      text-align: center;
                      font-size: 14px;
                      font-weight: normal;
                  }
                  
                  .text-finalc {
                      margin-top: 30px;
                      text-align: center;
                      font-size: 14px;
                      font-weight: bold;
                  }
                  
                  .span {
                      font-weight: bold;
                  }
                  
                  .container-footer {
                      background: #B5BF00;
                      padding: 5px 30px 15px 5px;
                      border-bottom-left-radius:  5px;
                      border-bottom-right-radius:  5px;
                  }
                  
                  .by {
                      text-align: center;
                      font-size: 12px;
                      margin: 0;
                      color: #fafafa;
                  }
                  
                  .spanby {
                      font-weight: bold;
                  }
                  
                  .container-data p {
                      color: #505050;
                  }
                  
                  .text-data {
                      font-size: 17px;
                      text-wrap: wrap;
                  }

                  .text-info {
                      font-size: 15px;
                      color: #505050;
                      text-align: center;
                      margin-top: 45px
                  }

                  .a {
                    font-size: 16px;
                    text-decoration: none;
                    color: #B5BF00;
                  }

                  .spanb {
                    font-weight: bold;
                  }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="container-header">
                  <h1 class="text-header">Restablecimiento de la contraseña</h1>
              </div>
              <div class="container-data">
                  <p class="text-data">Hola, ${name} ${lastname}</p>
                  <p class="text-data">Si recibiste este correo es porque solicitaste un restablecimiento de contraseña; en caso contrario, por favor, omite este correo.</p>
                  <p class="text-info"><a href="${token}" class="a">Restablecer contraseña</a></p>
                  <p class="text-final">Este correo fue enviado automáticamente, agradecemos <span class="span">no responder</span> este mensaje.</p>
                  <p class="text-finalc"><span class="spanb">Nota. </span>Recuerda que cuentas con 5 minutos para cambiarla.</p>
              </div>
              <div class="container-footer">
                  <p class="by"><span class="spanby">Developed by:</span> devsebass</p>
              </div>
          </div>
      </body>
      </html> `,
  };

  try {
    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(message);

    console.log(info);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
  }
};

module.exports = {
  login,
  register,
  user,
  auth,
  logout,
  formResetPassword,
  sentToken,
  validationToken,
  updatePassword,
};
