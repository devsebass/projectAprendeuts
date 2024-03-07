window.addEventListener("DOMContentLoaded", (event) => {
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled")
      );
    });
  }
});

$(".carousel .carousel-item").each(function () {
  var minPerSlide = 4;
  var next = $(this).next();
  if (!next.length) {
    next = $(this).siblings(":first");
  }
  next.children(":first-child").clone().appendTo($(this));

  for (var i = 0; i < minPerSlide; i++) {
    next = next.next();
    if (!next.length) {
      next = $(this).siblings(":first");
    }
    next.children(":first-child").clone().appendTo($(this));
  }
});

$(document).ready(function () {
  var rangoTiempo = document.getElementById("rangoTiempo");
  var valorRango = document.getElementById("valorRango");

  noUiSlider.create(rangoTiempo, {
    start: [360, 1080],
    connect: true,
    range: {
      min: 360,
      max: 1080,
    },
    step: 15,
  });

  rangoTiempo.noUiSlider.on("update", function (values, handle) {
    var horaInicio = formatarHora(values[0]);
    var horaFin = formatarHora(values[1]);

    valorRango.style.fontSize = "20px";
    valorRango.textContent = "Hora: " + horaInicio + " - " + horaFin;
  });

  function formatarHora(minutos) {
    var horas = Math.floor(minutos / 60);
    var minutosRestantes = minutos % 60;

    var ampm = horas >= 12 ? "pm" : "am";
    horas = horas % 12;
    horas = horas ? horas : 12;

    minutosRestantes =
      minutosRestantes < 10 ? "0" + minutosRestantes : minutosRestantes;

    return horas + ":" + minutosRestantes + " " + ampm;
  }
});

function verificarContraseñas() {
  const password = document.getElementById("pass").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const error = document.getElementById("error");

  if (password === confirmPassword) {
    document.getElementById("myForm").submit();
  } else {
    error.innerHTML = "Error: Las contraseñas no coinciden.";
    document.getElementById("pass").value = "";
    document.getElementById("pass").focus();
    document.getElementById("confirmPassword").value = "";
    return false;
  }
}

function limitarCaracteres(input, maxLength) {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
}

function capitalizeEachWord(input) {
  let value = input.value;

  if (value.trim() !== "") {
    let words = value.split(" ");
    words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    value = words.join(" ");
    input.value = value;
  }
}

$(document).ready(function () {
  $(".col-4").hide();
  $(".col-12").hide();
  $(".col-4:lt(4)").show();
  $(".col-12:lt(3)").show();
  const noResultsMessage = document.getElementById("noResultsMessage");
  const noResultsMessage2 = document.getElementById("noResultsMessage2");

  $("#materias").on("click", function () {
    $(".col-4").toggle();
    $(".col-4:lt(4):hidden").show();
    noResultsMessage.style.display = "none";
  });

  $("#profesores").on("click", function () {
    $(".col-12").toggle();
    $(".col-12:lt(3):hidden").show();
    noResultsMessage2.style.display = "none";
  });

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    filterSubjects(query);
    filterTeachers(query);
  });

  function filterSubjects(query) {
    const subjects = document.querySelectorAll("#data-list2 .col-4");
    const verSubjects = document.getElementById("materias");
    let hasResults = false;

    subjects.forEach((subject) => {
      const name = subject.querySelector("#sub-name").textContent.toLowerCase();
      const isVisible = name.includes(query);
      subject.style.display = isVisible ? "block" : "none";

      if (isVisible) {
        hasResults = true;
      }
    });

    if (hasResults) {
      noResultsMessage.style.display = "none";
      verSubjects.style.display = "block";
    } else {
      noResultsMessage.style.display = "block";
      verSubjects.style.display = "none";
    }
  }

  function filterTeachers(query) {
    const teachers = document.querySelectorAll("#data-list .col-12");
    const verTeachers = document.getElementById("profesores");
    let hasResults1 = false;

    teachers.forEach((teacher) => {
      const nameElement = teacher.querySelector("#prof-name");
      if (nameElement) {
        const name = nameElement.textContent.toLowerCase();
        const isVisible = name.includes(query);
        teacher.style.display = isVisible ? "block" : "none";

        if (isVisible) {
          hasResults1 = true;
        }
      }
    });
    if (hasResults1) {
      noResultsMessage2.style.display = "none";
      verTeachers.style.display = "block";
    } else {
      noResultsMessage2.style.display = "block";
      verTeachers.style.display = "none";
    }
  }
});

function validarFecha() {
  const fechaHoraInput = document.getElementById("fechaInput");
  const fechaHoraSeleccionada = new Date(fechaHoraInput.value);
  const fechaMinima = new Date();
  fechaMinima.setHours(6, 0, 0, 0);

  if (fechaHoraSeleccionada <= fechaMinima) {
    alert("Por favor, seleccione una fecha posterior a la actual.");
    fechaHoraInput.value = "";
  }
}

function cerrarModal() {
  var formulario = document.getElementById("miFormulario");
  formulario.reset();

  var radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(function (radio) {
    radio.checked = false;
  });
}

let nombreProfesorElemento;

function verDocente(profId, profNombre, profMateria) {
  var id = profId;
  var profMateria;
  var nombres = profNombre.split(" ");
  var nombre = nombres[0];
  var apellido = nombres.slice(1).join(" ");

  nombreProfesorElemento = document.getElementById("profInput");
  nombreProfesorElemento.style.color = "#505050";
  nombreProfesorElemento.textContent = nombre + " " + apellido;
  nombreProfesorElemento = document.getElementById("materiaInput");
  nombreProfesorElemento.textContent = profMateria;

  document.getElementById("tId").value = id;
  document.getElementById("tSubject").value = profMateria;
  materiaInput = profMateria;
}

function procesarFormulario() {
  var elementosInput = document.querySelectorAll(
    "#miFormulario input, #miFormulario select"
  );
  var camposIncompletos = false;
  elementosInput.forEach(function (elemento) {
    if (elemento.value.trim() === "") {
      camposIncompletos = true;
    }
  });

  if (camposIncompletos) {
    alert("Por favor, completa todos los campos antes de continuar.");
  } else {
    materiaInput = document.getElementById("materiaInput").textContent;
    profInput = document.getElementById("profInput").textContent;
    modalidadInput = document.querySelector(
      'input[name="modality"]:checked'
    ).value;
    tipoInput = document.querySelector('input[name="type"]:checked').value;
    fechaInput = document.getElementById("fechaInput").value;
    horaInput = document.getElementById("horaInput").value;
    lugarInput = document.getElementById("lugarInput").value;
    $("#formSection").addClass("d-none");
    $("#loadingSection").removeClass("d-none");

    setTimeout(() => {
      const resumenFinalHTML = `
      <div id="resumenInputs">
        <div class="row" style="margin-left: 210px">
          <div class="col-3">
            <div class="row">
              <div class="col-4">
                <div id="bol1"></div>
              </div>
              <div class="col-8">
                <p id="modalidadIn">${modalidadInput}</p>
              </div>
            </div>
          </div>
        <div class="col-3">
          <div class="row">
            <div class="col-4">
              <div id="bol1"></div>
            </div>
            <div class="col-8">
              <p id="tipoIn">${tipoInput}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-4 mt-1" style="margin-left: 280px">
        <div class=" col-1 d-flex justify-content-end">
          <img src="/img/phoneg.svg" width="45px">
        </div>
        <div class="col-11">
          <div class="row">
            <div class="col-5">
              <p class="text-wrapp my-3" id="materiaIn">${materiaInput}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-4" style="margin-left: 280px">
        <div class="col-1 d-flex justify-content-end">
          <img src="/img/teachg.svg" width="45px">
        </div>
        <div class="col-11">
          <div class="row">
            <div class="col-12">
              <p class="text-wrapp my-3" id="profIn">${profInput}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-4" style="margin-left: 280px">
        <div class="col-1 d-flex justify-content-end">
          <img src="/img/calendarg.svg" width="45px">
        </div>
        <div class="col-11">
          <div class="row">
            <div class="col-12">
              <p class="text-wrapp my-3" id="fechaIn">${fechaInput}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-4" style="margin-left: 280px">
        <div class="col-1 d-flex justify-content-end">
          <img src="/img/watchg.svg" width="45px">
        </div>
        <div class="col-11">
          <div class="row">
            <div class="col-12">
              <p class="text-wrapp my-3" id="horaIn">${horaInput}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-1" style="margin-left: 280px">
        <div class="col-1 d-flex justify-content-end">
          <img src="/img/ubig.svg" width="45px">
        </div>
        <div class="col-11">
          <div class="row">
            <div class="col-5">
              <p class="text-wrapp my-3" id="lugarIn">${lugarInput}</p>
            </div>
          </div>
        </div>
      </div>  `;

      $("#resumenInputs").html(resumenFinalHTML);
      $("#loadingSection").addClass("d-none");
      $("#resultSection").removeClass("d-none");
    }, 500);
  }
}

function retroceder() {
  $("#resultSection").addClass("d-none");
  $("#formSection").addClass("d-none");
  $("#loadingSection").removeClass("d-none");

  setTimeout(() => {
    $("#loadingSection").addClass("d-none");
    $("#formSection").removeClass("d-none");
  }, 500);
}

function final() {
  $("#resultSection").addClass("d-none");
  $("#loadingSection").removeClass("d-none");

  setTimeout(() => {
    const resumenFinalHTML = `
    <h4 id="text-resb">Detalles de la tutoría</h4>
    <div id="line2b"></div>
    <div class="row" style="margin-left: 230px">
        <div class="col-3">
            <div class="row">
                <div class="col-4">
                    <div id="bol2"></div>
                </div>
                <div class="col-8">
                    <p id="modalidadIn">${modalidadInput}</p>
                </div>
            </div>
        </div>
        <div class="col-3">
            <div class="row">
                <div class="col-4">
                    <div id="bol2"></div>
                </div>
                <div class="col-8">
                    <p id="tipoIn">${tipoInput}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-left: 157px">
        <div class="col-6">
            <div class="row mb-3">
                <div class="col-1 d-flex justify-content-end">
                    <img src="/img/matv.svg" width="45px">
                </div>
                <div class="col-11">
                    <div class="row">
                        <div class="col-10">
                            <p class="text-wrapp my-3" id="materiaIn">${materiaInput}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="row mb-3">
                <div class="col-1 d-flex justify-content-end">
                    <img src="/img/teacv.svg" width="45px">
                </div>
                <div class="col-9">
                    <div class="row">
                        <div class="col-8">
                            <p class="text-wrapp my-3" id="profIn">${profInput}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-left: 157px">
        <div class="col-6">
            <div class="row mb-3">
                <div class="col-1 d-flex justify-content-end">
                    <img src="/img/calv.svg" width="45px">
                </div>
                <div class="col-11">
                    <div class="row">
                        <div class="col-12">
                            <p class="text-wrapp my-3" id="fechaIn">${fechaInput}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="row mb-3">
                <div class="col-1 d-flex justify-content-end">
                    <img src="/img/timev.svg" width="45px">
                </div>
                <div class="col-11">
                    <div class="row">
                        <div class="col-12">
                            <p class="text-wrapp my-3" id="horaIn">${horaInput}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-left: 227px">
        <div class="col-12">
            <div class="row mb-4">
                <div class="col-1 d-flex justify-content-end">
                    <img src="/img/locv.svg" width="45px">
                </div>
                <div class="col-10">
                    <div class="row">
                        <div class="col-9">
                            <p class="text-wrapp my-3" id="lugarIn">${lugarInput}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    $("#resumenInputsFinal").html(resumenFinalHTML);
    $("#loadingSection").addClass("d-none");
    $("#resultFinalSection").removeClass("d-none");
  }, 500);
}

function enviarFormulario() {
  const formulario = document.getElementById("miFormulario");
  formulario.submit();
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.querySelector(".loader-container").style.display = "none";
    // document.querySelector('.layoutSidenav').style.display = 'block';
  }, 700);
});
