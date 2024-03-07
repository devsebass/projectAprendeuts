const express = require("express");
const { engine } = require("express-handlebars");
const { join } = require("path");
const myconnection = require("express-myconnection");
const morgan = require("morgan");
const session = require("express-session");
const moment = require("moment");
const flash = require("connect-flash");
const multer = require("multer");
const mysql = require("mysql2");
const path = require("path");
const adminRoutes = require("./routes/admin.routes");
const studentRoutes = require("./routes/student.routes");
const mentoringRoutes = require("./routes/mentoring.routes");
const teacherRoutes = require("./routes/teacher.routes");

//Initialization
const app = express();
app.set("port", 2024);

//Settings
app.set("views", __dirname + "/views");
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    helpers: {
      formatDate: function (date) {
        return moment(date).format("YYYY-MM-DD");
      },
    },
  })
);
app.set("view engine", "hbs");

// Conection with database
const dbUrl =
  "mysql://root:F5ce6ffBbHE-GFdfEeaB-DCaagc4aa4a@roundhouse.proxy.rlwy.net:51977/railway";

app.use(myconnection(mysql, dbUrl, "single"));

// app.use(
//   myconnection(mysql, {
//     host: "localhost",
//     user: "root",
//     password: "",
//     port: 3306,
//     database: "utsmentoring",
//   })
// );

//Initialization of sessions
// Configuración de sesión para estudiantes
app.use(
  "/student",
  session({
    secret: "secreto-para-estudiantes",
    resave: false,
    saveUninitialized: true,
    cookie: { path: "/student" },
  })
);

// Configuración de sesión para profesores
app.use(
  "/teacher",
  session({
    secret: "secreto-para-profesores",
    resave: false,
    saveUninitialized: true,
    cookie: { path: "/teacher" },
  })
);

// Configuración de sesión para administradores
app.use(
  "/admin",
  session({
    secret: "secreto-para-administradores",
    resave: false,
    saveUninitialized: true,
    cookie: { path: "/admin" },
  })
);

//Initialization of messages flash
app.use(flash());

//Run server
app.listen(app.get("port"), () => {
  console.log("Server running on port " + app.get("port"));
});

//Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Public files
app.use(express.static(join(__dirname, "public")));

//Routes
app.use(adminRoutes, studentRoutes, mentoringRoutes, teacherRoutes);

//Multer configuration
app.use("/uploads", express.static("uploads"));

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

// Multer's routes
app.get("/exp", (req, res) => {
  res.render("multer/home.hbs");
});

app.post("/exp/:studentId", upload.single("image"), (req, res) => {
  const { file } = req;
  const { filename } = file;

  req.getConnection((err, conn) => {
    if (err) {
      console.error(
        "Error al realizar la conexión con la base de datos: " + err
      );
      res.status(500).send("Error interno del servidor");
      return;
    }

    const teacherQuery = "UPDATE admin SET image = ? WHERE id = ?";
    const teacherId = 1; // Define tu ID de profesor aquí
    conn.query(teacherQuery, [filename, teacherId], (err) => {
      if (err) {
        console.error("Error al actualizar la base de datos: " + err);
        res.status(500).send("Error interno del servidor");
        return;
      }

      console.log("Admin actualizado con éxito.");
      res.redirect("/list");
    });
  });
});

app.get("/list", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.error(
        "Error al realizar la conexión con la base de datos: " + err
      );
      res.status(500).send("Error interno del servidor");
      return;
    }

    const teacherQuery = "SELECT * FROM admin";
    conn.query(teacherQuery, (err, teachers) => {
      if (err) {
        console.error("Error al obtener la lista de profesores: " + err);
        res.status(500).send("Error interno del servidor");
        return;
      }

      res.render("multer/tabla", { teachers });
    });
  });
});
