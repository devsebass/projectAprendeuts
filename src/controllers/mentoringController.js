const nodemailer = require("nodemailer");

function createMentoring(req, res) {
  const title = "Agendar tutoría - Aprende+";
  if (req.session.loggedinStudent === true) {
    const idUser = req.session.ide;
    const nameUser = req.session.name;
    const lastnameUser = req.session.lastname;
    const imageUser = req.session.image;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const teachersQuery = `
          SELECT
            teachers.*,
            subjects.id AS subjectId,
            subjects.name AS subjectName,
            subjects.disponibility AS subjectDisponibility,
            subjects.modality AS subjectModality,
            AVG(ratings.rating) AS avgRating,
            COUNT(ratings.rating) AS ratingCount
          FROM teachers
          JOIN subjects ON teachers.subjectId = subjects.id
          LEFT JOIN ratings ON teachers.id = ratings.teacherId
          GROUP BY teachers.id
        `;

      conn.query(teachersQuery, (err, teachers) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        const mentoringsQuery = "SELECT * FROM mentorings WHERE studentId = ?";
        conn.query(mentoringsQuery, [idUser], (err, mentorings) => {
          if (err) {
            return res.status(500).send("Error interno del servidor");
          }

          res.render("mentoring/newMentoring", {
            title,
            nameUser,
            lastnameUser,
            imageUser,
            idUser,
            teachers,
            mentorings,
          });
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function insertMentoring(req, res) {
  if (req.session.loggedinStudent === true) {
    const data = req.body;
    const studentId = data.studentId;
    const teacherId = data.teacherId;

    req.getConnection((err, conn) => {
      if (err) {
        console.error("Error de conexión a la base de datos:", err);
        return res.status(500).send("Error interno del servidor");
      }

      conn.query("INSERT INTO mentorings SET ?", [data], (err) => {
        if (err) {
          console.error("Error al ejecutar la consulta:", err);
          return res.status(500).send("Error interno del servidor");
        }

        const mentoringsQuery = `
            SELECT mentorings.*, teachers.name AS teacherName, teachers.lastname AS teacherLastname, teachers.email AS teacherEmail,
            students.name AS studentName, students.lastname AS studentLastname, students.email AS studentEmail
            FROM mentorings
            JOIN teachers ON mentorings.teacherId = teachers.id 
            JOIN students ON mentorings.studentId = students.id
            WHERE mentorings.studentId = ? AND mentorings.teacherId = ?
          `;

        conn.query(mentoringsQuery, [studentId, teacherId], (err, result) => {
          if (err) {
            return res.status(500).send("Error interno del servidor");
          }

          const mentoringsData = result[0];

          sentMail(
            mentoringsData.studentName,
            mentoringsData.studentLastname,
            mentoringsData.studentEmail,
            mentoringsData.teacherName,
            mentoringsData.teacherLastname,
            mentoringsData.teacherEmail,
            data.modality,
            data.time,
            data.date,
            data.type,
            data.subject,
            data.location
          );

          req.flash(
            "warning",
            "Recuerda calificar al docente una vez finalizada la tutoría."
          );
          res.redirect("/student/mentoring/list");
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function listMentoring(req, res) {
  const title = "Listado de tutorías - Aprende+";
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
          SELECT mentorings.*, teachers.id AS teacherId, teachers.name AS teacherName, teachers.lastname AS teacherLastname
          FROM mentorings
          JOIN teachers ON mentorings.teacherId = teachers.id
          WHERE mentorings.studentId = ?
        `;

      conn.query(subjectsQuery, [idUser], (err, mentorings) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        const ratedTeachersQuery = `
            SELECT DISTINCT teacherId
            FROM ratings
            WHERE studentId = ?
          `;

        conn.query(ratedTeachersQuery, [idUser], (err, ratedTeachers) => {
          if (err) {
            return res.status(500).send("Error interno del servidor");
          }

          mentorings.forEach((mentoring) => {
            mentoring.hasRated = ratedTeachers.some(
              (ratedTeacher) => ratedTeacher.teacherId === mentoring.teacherId
            );
          });

          res.render("mentoring/listMentoring", {
            title,
            nameUser,
            lastnameUser,
            imageUser,
            mentorings,
            success: req.flash("success"),
            warning: req.flash("warning"),
          });
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function saveRating(req, res) {
  const rating = req.body.rating;
  const comment = req.body.comment || "N/A";
  const teacherId = req.body.teacherId;
  const idUser = req.session.ide;

  req.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send("Error interno del servidor");
    }

    const insertRatingQuery =
      "INSERT INTO ratings (studentId, teacherId, rating, comment) VALUES (?, ?, ?, ?)";

    conn.query(
      insertRatingQuery,
      [idUser, teacherId, rating, comment],
      (err) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        req.flash("success", "Docente calificado exitosamente.");
        res.redirect("/student/mentoring/list");
      }
    );
  });
}

//Nodemailer configuration
sentMail = async (
  studentName,
  studentLastname,
  studentEmail,
  teacherName,
  teacherLastname,
  teacherEmail,
  modality,
  time,
  date,
  type,
  subject,
  location
) => {
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
    to: "joansdelgado@uts.edu.co",
    // to: `${teacherEmail}`,
    subject: "Nueva tutoría agendada",
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
                
                    .hr {
                        margin-left: 20px;
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
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="container-header">
                        <h1 class="text-header">Datos de la tutoría</h1>
                    </div>
                    <div class="container-data">
                        <p class="text-data">Estimado(a) docente: ${teacherName} ${teacherLastname}</p>
                        <p class="text-data">Le informamos que el estudiante ${studentName} ${studentLastname} ha agendado una tutoría con usted. A continuación encontrará
                            toda la información pertinente:
                        </p>
                        <p class="text-info"><strong>Asignatura:</strong> ${subject}</p>
                        <p class="text-info"><strong>Modalidad:</strong> ${modality}</p>
                        <p class="text-info"><strong>Tipo:</strong> ${type}</p>
                        <p class="text-info"><strong>Fecha:</strong> ${date}</p>
                        <p class="text-info"><strong>Hora:</strong> ${time}</p>
                        <p class="text-info"><strong>Lugar:</strong> ${location}</p>
                        <p class="text-info"><strong>Correo del estudiante:</strong> ${studentEmail}</p>
                        <p class="text-final">Este correo fue enviado automáticamente, agradecemos <span class="span">no responder</span> este mensaje.</p>
                        <p class="text-finalc">Gracias por su atención.</p>
                    </div>
                    <div class="container-footer">
                        <p class="by"><span class="spanby">Developed by:</span> devsebass</p>
                    </div>
                </div>
            </body>
            </html>
               `,
  };

  try {
    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(message);
    console.log(info);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

function listMentoringTeacher(req, res) {
  const title = "Tutorías agendadas - Aprende+";
  if (req.session.loggedinTeacher === true) {
    const idUser = req.session.ideTeacher;
    const nameUser = req.session.nameTeacher;
    const lastnameUser = req.session.lastnameTeacher;
    const imageUser = req.session.imageTeacher;

    req.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }

      const subjectsQuery = `
      SELECT mentorings.*, students.id AS studentId, students.name AS studentName, students.lastname AS studentLastname, students.email AS studentEmail
      FROM mentorings
      JOIN students ON mentorings.studentId = students.id
      WHERE mentorings.teacherId = ?;
      `;

      conn.query(subjectsQuery, [idUser], (err, mentorings) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error interno del servidor");
        }

        res.render("mentoring/listMentoringTeacher", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          mentorings,
          success: req.flash("success"),
        });
      });
    });
  } else {
    res.redirect("/teacher/login");
  }
}

function deleteMentoringTeacher(req, res) {
  const idMentoring = req.params.id;
  const idUser = req.session.ideTeacher;
  if (req.session.loggedinTeacher === true) {
    req.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }

      const subjectsQuery = `
      SELECT mentorings.*, students.name AS studentName, students.lastname AS studentLastname, students.email AS studentEmail,
      teachers.name AS teacherName, teachers.lastname AS teacherLastname
      FROM mentorings
      JOIN students ON mentorings.studentId = students.id
      JOIN teachers ON mentorings.teacherId = teachers.id
      WHERE mentorings.teacherId = ?;
      `;

      conn.query(subjectsQuery, [idUser], (err, mentorings) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error interno del servidor");
        }

        const MentoringsQuery = `DELETE FROM mentorings WHERE id = ?;`;

        conn.query(MentoringsQuery, [idMentoring], (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
          const mentoringsData = mentorings[0];

          const formattedDate = mentoringsData.date.toLocaleDateString(
            "es-ES",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );

          sentMail(
            mentoringsData.studentName,
            mentoringsData.studentLastname,
            mentoringsData.studentEmail,
            mentoringsData.teacherName,
            mentoringsData.teacherLastname,
            formattedDate
          );
          req.flash("success", "Tutoría cancelada correctamente.");
          res.redirect("/teacher/mentoring/list");
        });
      });
    });
  } else {
    res.redirect("/teacher/login");
  }
}

//Nodemailer configuration
sentMail = async (
  studentName,
  studentLastname,
  studentEmail,
  teacherName,
  teacherLastname,
  formattedDate
) => {
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
    to: "joansdelgado@uts.edu.co",
    // to: `${studentEmail}`,
    subject: "Tutoría cancelada",
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
                
                    .hr {
                        margin-left: 20px;
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
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="container-header">
                        <h1 class="text-header">Tutoría cancelada.</h1>
                    </div>
                    <div class="container-data">
                        <p class="text-data">Hola, ${studentName} ${studentLastname}.</p>
                        <p class="text-data">Queremos informarte que el docente tutor ${teacherName} ${teacherLastname} ha cancelado la tutoría
                        programada para el día ${formattedDate}. Por favor reagenda la tutoría o elige otro docente.
                        </p>
                        <p class="text-final">Este correo fue enviado automáticamente, agradecemos <span class="span">no responder</span> este mensaje.</p>
                        <p class="text-finalc">Gracias por su atención.</p>
                    </div>
                    <div class="container-footer">
                        <p class="by"><span class="spanby">Developed by:</span> devsebass</p>
                    </div>
                </div>
            </body>
            </html>
               `,
  };

  try {
    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(message);
    console.log(info);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

module.exports = {
  createMentoring,
  insertMentoring,
  listMentoring,
  saveRating,
  listMentoringTeacher,
  deleteMentoringTeacher,
};
