const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

function home(req, res) {
  const title = "Dashboard - Aprende+";

  if (req.session.loggedinAdmin === true) {
    const idUser = req.session.ideAdmin;
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const countAdminQuery = `SELECT COUNT(*) AS adminCount FROM admin`;
      const countMentoringsQuery = `SELECT COUNT(*) AS mentoringsCount FROM mentorings`;
      const countRatingsQuery = `SELECT COUNT(*) AS ratingsCount FROM ratings`;
      const countStudentsQuery = `SELECT COUNT(*) AS studentsCount FROM students`;
      const countSubjectsQuery = `SELECT COUNT(*) AS subjectsCount FROM subjects`;
      const countTeachersQuery = `SELECT COUNT(*) AS teachersCount FROM teachers`;

      const adminQuery = `SELECT * FROM admin WHERE id = ?`;

      conn.query(countAdminQuery, (err, adminCountResult) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        const adminCount = adminCountResult[0].adminCount;

        conn.query(adminQuery, [idUser], (err, adminResult) => {
          if (err) {
            return res.status(500).send("Error interno del servidor");
          }

          const admin = adminResult[0];

          conn.query(countMentoringsQuery, (err, mentoringsCountResult) => {
            if (err) {
              return res.status(500).send("Error interno del servidor");
            }

            const mentoringsCount = mentoringsCountResult[0].mentoringsCount;

            conn.query(countRatingsQuery, (err, ratingsCountResult) => {
              if (err) {
                return res.status(500).send("Error interno del servidor");
              }

              const ratingsCount = ratingsCountResult[0].ratingsCount;

              conn.query(countStudentsQuery, (err, studentsCountResult) => {
                if (err) {
                  return res.status(500).send("Error interno del servidor");
                }

                const studentsCount = studentsCountResult[0].studentsCount;

                conn.query(countSubjectsQuery, (err, subjectsCountResult) => {
                  if (err) {
                    return res.status(500).send("Error interno del servidor");
                  }

                  const subjectsCount = subjectsCountResult[0].subjectsCount;

                  conn.query(countTeachersQuery, (err, teachersCountResult) => {
                    if (err) {
                      return res.status(500).send("Error interno del servidor");
                    }

                    const teachersCount = teachersCountResult[0].teachersCount;

                    res.render("admin/home", {
                      title,
                      nameUser,
                      lastnameUser,
                      imageUser,
                      admin,
                      adminCount,
                      mentoringsCount,
                      ratingsCount,
                      studentsCount,
                      subjectsCount,
                      teachersCount,
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function studentList(req, res) {
  const title = "Listado de estudiantes - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const studentsQuery = `SELECT * FROM students`;
      conn.query(studentsQuery, (err, students) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/studentList", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          students,
          success: req.flash("success"),
          warning: req.flash("warning"),
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function studentDelete(req, res) {
  const studentId = req.params.id;
  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const studentsQuery = `DELETE FROM students WHERE id = ?`;
      conn.query(studentsQuery, [studentId], (err) => {
        if (err) {
          return res.status(500).send("Error interno del servidor2");
        }
        req.flash("warning", "Estudiante eliminado correctamente.");
        res.redirect("/admin/student/list");
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function studentEdit(req, res) {
  const studentId = req.params.id;
  const title = "Datos del estudiante - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const studentsQuery = `SELECT * FROM students WHERE id = ?`;
      conn.query(studentsQuery, [studentId], (err, students) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/studentData", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          students,
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function studentEditSave(req, res) {
  const studentId = req.params.id;
  const studentData = req.body;

  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      if (studentData.password) {
        bcrypt.genSalt(12, (err, salt) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
          }

          bcrypt.hash(studentData.password, salt, (err, hashedPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Error interno del servidor");
            }

            studentData.password = hashedPassword;
            const studentsQuery = `UPDATE students SET ? WHERE id = ?`;
            conn.query(studentsQuery, [studentData, studentId], (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Error interno del servidor");
              }

              req.flash("success", "Estudiante actualizado correctamente.");
              res.redirect("/admin/student/list");
            });
          });
        });
      } else {
        delete studentData.password;
        const studentsQuery = `UPDATE students SET ? WHERE id = ?`;
        conn.query(studentsQuery, [studentData, studentId], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
          }
          req.flash("success", "Estudiante actualizado correctamente.");
          res.redirect("/admin/student/list");
        });
      }
    });
  } else {
    res.redirect("/student/login");
  }
}

function mentoringList(req, res) {
  const title = "Listado de tutorias - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const mentoringsQuery = `SELECT mentorings.*, teachers.id AS teacherId, teachers.name AS teacherName, teachers.lastname AS teacherLastname,
      students.id AS studentId, students.name AS studentName, students.lastname AS studentLastname
      FROM mentorings
      JOIN teachers ON mentorings.teacherId = teachers.id
      JOIN students ON mentorings.studentId = students.id`;
      conn.query(mentoringsQuery, (err, mentorings) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/mentoringList", {
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
  } else {
    res.redirect("/student/login");
  }
}

function mentoringEdit(req, res) {
  const mentoringId = req.params.id;
  const title = "Datos de la tutoría - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const mentoringsQuery = `SELECT mentorings.*, teachers.id AS teacherId, teachers.name AS teacherName, teachers.lastname AS teacherLastname,
      students.id AS studentId, students.name AS studentName, students.lastname AS studentLastname
      FROM mentorings
      JOIN teachers ON mentorings.teacherId = teachers.id
      JOIN students ON mentorings.studentId = students.id
      WHERE mentorings.id = ?`;
      conn.query(mentoringsQuery, [mentoringId], (err, mentorings) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/mentoringData", {
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

function mentoringEditSave(req, res) {
  const mentoringId = req.params.id;
  const mentoringData = req.body;

  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const mentoringsQuery = `UPDATE mentorings SET ? WHERE id = ?`;
      conn.query(mentoringsQuery, [mentoringData, mentoringId], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error interno del servidor");
        }
        req.flash("success", "Tutoría actualizada correctamente.");
        res.redirect("/admin/mentoring/list");
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function mentoringDelete(req, res) {
  const mentoringId = req.params.id;
  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const mentoringsQuery = `DELETE FROM mentorings WHERE id = ?`;
      conn.query(mentoringsQuery, [mentoringId], (err) => {
        if (err) {
          return res.status(500).send("Error interno del servidor2");
        }
        req.flash("warning", "Tutoría eliminada correctamente.");
        res.redirect("/admin/mentoring/list");
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function teacherList(req, res) {
  const title = "Listado de docentes - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const teachersQuery = `SELECT teachers.*, subjects.name AS subjectName
      FROM teachers
      JOIN subjects ON teachers.subjectId = subjects.id`;
      conn.query(teachersQuery, (err, teachers) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/teacherList", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          teachers,
          success: req.flash("success"),
          warning: req.flash("warning"),
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function teacherNew(req, res) {
  const title = "Nuevo docente - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const subjectsQuery = `SELECT * FROM subjects`;
      conn.query(subjectsQuery, (err, subjects) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/teacherNew", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          subjects,
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

function uploadImage(req, res, next) {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error interno del servidor");
    }
    next();
  });
}

function teacherCreate(req, res) {
  if (req.file) {
    const { filename } = req.file;
    const { name, lastname, email, description, password, subjectId } =
      req.body;

    if (!subjectId) {
      return res.status(400).send("El campo subjectId es obligatorio.");
    }

    // Generar un salt con coste 12
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error interno del servidor");
      }

      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error interno del servidor");
        }

        req.getConnection((err, conn) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
          }

          const teachersQuery = `
            INSERT INTO teachers (name, lastname, email, password, description, image, subjectId)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;

          conn.query(
            teachersQuery,
            [
              name,
              lastname,
              email,
              hashedPassword,
              description,
              filename,
              subjectId,
            ],
            (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Error interno del servidor");
              }

              req.flash("success", "Docente creado correctamente.");
              res.redirect("/admin/teacher/list");
            }
          );
        });
      });
    });
  } else {
    res.status(400).send("Se esperaba un archivo de imagen.");
  }
}

function teacherEdit(req, res) {
  const teacherId = req.params.id;
  const title = "Datos del docente - Aprende+";

  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const teachersQuery = `
        SELECT teachers.*, subjects.id AS subjectId, subjects.name AS subjectName
        FROM teachers
        JOIN subjects ON teachers.subjectId = subjects.id
        WHERE teachers.id = ?`;

      conn.query(teachersQuery, [teacherId], (err, teachers) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }

        const subjectsQuery = `SELECT * FROM subjects`;

        conn.query(subjectsQuery, (err, subjects) => {
          if (err) {
            return res.status(500).send("Error interno del servidor");
          }

          res.render("admin/teacherData", {
            title,
            nameUser,
            lastnameUser,
            imageUser,
            teachers,
            subjects,
          });
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function teacherEditSave(req, res) {
  const teacherId = req.params.id;
  const teacherData = req.body;

  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      if (teacherData.password) {
        bcrypt.genSalt(12, (err, salt) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
          }
          bcrypt.hash(teacherData.password, salt, (err, hashedPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Error interno del servidor");
            }

            teacherData.password = hashedPassword;

            const mentoringsQuery = `UPDATE teachers SET ? WHERE id = ?`;
            conn.query(mentoringsQuery, [teacherData, teacherId], (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Error interno del servidor");
              }

              req.flash("success", "Docente actualizado correctamente.");
              res.redirect("/admin/teacher/list");
            });
          });
        });
      } else {
        delete teacherData.password;
        const mentoringsQuery = `UPDATE teachers SET ? WHERE id = ?`;
        conn.query(mentoringsQuery, [teacherData, teacherId], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
          }

          req.flash("success", "Docente actualizado correctamente.");
          res.redirect("/admin/teacher/list");
        });
      }
    });
  } else {
    res.redirect("/student/login");
  }
}

function teacherDelete(req, res) {
  const teacherId = req.params.id;
  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const studentsQuery = `DELETE FROM teachers WHERE id = ?`;
      conn.query(studentsQuery, [teacherId], (err) => {
        if (err) {
          return res.status(500).send("Error interno del servidor2");
        }
        req.flash("warning", "Docente eliminado correctamente.");
        res.redirect("/admin/teacher/list");
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function subjectList(req, res) {
  const title = "Listado de materias - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const subjectsQuery = `SELECT * FROM subjects`;
      conn.query(subjectsQuery, (err, subjects) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/subjectList", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          subjects,
          success: req.flash("success"),
          warning: req.flash("warning"),
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function subjectEdit(req, res) {
  const subjectId = req.params.id;
  const title = "Datos de la materia - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const subjectsQuery = `SELECT * FROM subjects WHERE subjects.id = ?`;
      conn.query(subjectsQuery, [subjectId], (err, subjects) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/subjectData", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          subjects,
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function subjectEditSave(req, res) {
  const subjectId = req.params.id;
  const subjectData = req.body;

  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }
      const subjectQuery = `UPDATE subjects SET ? WHERE id = ?`;
      conn.query(subjectQuery, [subjectData, subjectId], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error interno del servidor");
        }
        req.flash("success", "Materia actualizada correctamente.");
        res.redirect("/admin/subject/list");
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function subjectNew(req, res) {
  const title = "Datos de la materia - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;
    res.render("admin/subjectNew", {
      title,
      nameUser,
      lastnameUser,
      imageUser,
    });
  }
}

function subjectCreate(req, res) {
  const nameUser = req.session.nameAdmin;
  const lastnameUser = req.session.lastnameAdmin;
  const imageUser = req.session.imageAdmin;
  const subjectData = req.body;
  const title = "Datos de la materia - Aprende+";
  const error = "Error: La materia ya se encuentra registrada.";

  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const checkSubjectQuery = `SELECT * FROM subjects WHERE id = ?`;
      conn.query(checkSubjectQuery, [subjectData.id], (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error interno del servidor");
        }

        if (rows.length > 0) {
          return res.render("admin/subjectNew", {
            title,
            nameUser,
            lastnameUser,
            imageUser,
            error,
          });
        }

        const insertSubjectQuery = `INSERT INTO subjects SET ?`;
        conn.query(insertSubjectQuery, [subjectData], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
          }

          req.flash("success", "Materia registrada correctamente.");
          res.redirect("/admin/subject/list");
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function subjectDelete(req, res) {
  const subjectId = req.params.id;

  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const subjectQuery = `DELETE FROM subjects WHERE id = ?`;
      conn.query(subjectQuery, [subjectId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error interno del servidor");
        }

        req.flash("success", "Materia eliminada correctamente.");
        res.redirect("/admin/subject/list");
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function ratingList(req, res) {
  const title = "Listado de puntuaciones - Aprende+";
  if (req.session.loggedinAdmin === true) {
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const subjectsQuery = `SELECT ratings.*, students.id AS studentId, students.name AS studentName, students.lastname AS studentLastname,
      teachers.id AS teacherId, teachers.name AS teacherName, teachers.lastname AS teacherLastname
      FROM ratings
      JOIN students ON ratings.studentId = students.id
      JOIN teachers ON ratings.teacherId = teachers.id;
      `;
      conn.query(subjectsQuery, (err, ratings) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/ratingList", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          ratings,
          success: req.flash("success"),
          warning: req.flash("warning"),
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function ratingDelete(req, res) {
  const ratingId = req.params.id;

  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const subjectQuery = `DELETE FROM ratings WHERE id = ?`;
      conn.query(subjectQuery, [ratingId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error interno del servidor");
        }

        req.flash("success", "Puntuación eliminada correctamente.");
        res.redirect("/admin/rating/list");
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function adminData(req, res) {
  const title = "Datos del administrador - Aprende+";

  if (req.session.loggedinAdmin === true) {
    const adminId = req.session.ideAdmin;
    const nameUser = req.session.nameAdmin;
    const lastnameUser = req.session.lastnameAdmin;
    const imageUser = req.session.imageAdmin;

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      const adminQuery = `SELECT * FROM admin WHERE id = ?`;
      conn.query(adminQuery, [adminId], (err, admin) => {
        if (err) {
          return res.status(500).send("Error interno del servidor");
        }
        res.render("admin/adminData", {
          title,
          nameUser,
          lastnameUser,
          imageUser,
          admin,
          success: req.flash("success"),
        });
      });
    });
  } else {
    res.redirect("/student/login");
  }
}

function adminDataSave(req, res) {
  const adminId = req.params.id;
  const adminData = req.body;

  if (req.session.loggedinAdmin === true) {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      if (adminData.password) {
        bcrypt.genSalt(12, (err, salt) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
          }

          bcrypt.hash(adminData.password, salt, (err, hashedPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Error interno del servidor");
            }

            adminData.password = hashedPassword;

            const adminQuery = `UPDATE admin SET ? WHERE id = ?`;
            conn.query(adminQuery, [adminData, adminId], (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Error interno del servidor");
              }

              req.session.nameAdmin = adminData.name;
              req.session.lastnameAdmin = adminData.lastname;

              req.flash(
                "success",
                "Tu información ha sido actualizada correctamente."
              );
              res.redirect("/admin/data");
            });
          });
        });
      } else {
        delete adminData.password;
        const adminQuery = `UPDATE admin SET ? WHERE id = ?`;
        conn.query(adminQuery, [adminData, adminId], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
          }

          req.session.nameAdmin = adminData.name;
          req.session.lastnameAdmin = adminData.lastname;

          req.flash(
            "success",
            "Tu información ha sido actualizada correctamente."
          );
          res.redirect("/admin/data");
        });
      }
    });
  } else {
    res.redirect("/student/login");
  }
}

module.exports = {
  home,
  studentList,
  studentDelete,
  studentEdit,
  studentEditSave,
  mentoringList,
  mentoringEdit,
  mentoringEditSave,
  mentoringDelete,
  teacherList,
  teacherNew,
  uploadImage,
  teacherCreate,
  teacherEdit,
  teacherEditSave,
  teacherDelete,
  subjectList,
  subjectNew,
  subjectCreate,
  subjectEdit,
  subjectEditSave,
  subjectDelete,
  ratingList,
  ratingDelete,
  adminData,
  adminDataSave,
};
