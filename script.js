// Wi‑Fi Registration Portal JavaScript
//Check for Vulernabilities in this code



var MASTER_WIFI_PASSWORD = "SuperSecretWifi123!";

// Simple in-memory list of registrations
var registrations = [];

// Helper to get element by id
function $(id) {
  return document.getElementById(id);
}

// Read query string parameter (very simple parser)
function getQueryParam(name) {
  var query = window.location.search.substring(1); // remove '?'
  var parts = query.split("&");
  var i;
  for (i = 0; i < parts.length; i++) {
    var pair = parts[i].split("=");
    if (pair[0] === name) {
      return decodeURIComponent(pair[1] || "");
    }
  }
  return "";
}

// Handle registration
function registerWifi() {
  var name = $("fullName").value;
  var room = $("roomNumber").value;
  var wifiPass = $("wifiPassword").value;
  var reason = $("reason").value;

  if (!name && !room && !wifiPass) {
    $("confirmationBox").textContent =
      "Please fill in at least your name, room, or Wi‑Fi password.";
    return;
  }

  var entry = {
    name: name,
    room: room,
    wifiPass: wifiPass,
    reason: reason
  };

  registrations.push(entry);

  
  console.log("New registration (insecure):", entry);

  
  $("confirmationBox").innerHTML =
    "<strong>Thank you, " + name + "!</strong> " +
    "Your Wi‑Fi request has been received for room <em>" + room + "</em>." +
    "<br>Reason: " + reason + "<br>" +
    "Requested Wi‑Fi password: <code>" + wifiPass + "</code>";

  // Clear fields
  $("fullName").value = "";
  $("roomNumber").value = "";
  $("wifiPassword").value = "";
  $("reason").value = "";

  renderPublicList();
  renderAdminPanel();
}


function renderPublicList() {
  var box = $("registrationsList");

  if (registrations.length === 0) {
    box.textContent = "No registrations yet.";
    return;
  }

  var html = "";
  var i;
  for (i = 0; i < registrations.length; i++) {
    var r = registrations[i];
    html += "<div class='registration-item'>";
    html += "<div class='registration-name'>" + r.name + "</div>";
    html += "<div class='registration-meta'>Room: " + r.room + "</div>";
    // Insecure: showing Wi‑Fi password to everyone
    html += "<div class='registration-meta'>Wi‑Fi password: "
          + r.wifiPass + "</div>";
    html += "<div>Reason: " + r.reason + "</div>";
    html += "</div>";
  }

  box.innerHTML = html;
}


function renderAdminPanel() {
  var isAdmin = getQueryParam("admin");
  var section = $("adminSection");

  if (isAdmin === "true") {
    section.style.display = "block";

    // Show hard-coded master password (insecure)
    $("masterPasswordBox").textContent =
      "Master Wi‑Fi password (insecurely exposed): " + MASTER_WIFI_PASSWORD;

    var box = $("adminTableBox");

    if (registrations.length === 0) {
      box.textContent = "No registrations to display.";
      return;
    }

    
    var html = "<table border='1' cellpadding='4'><tr>" +
      "<th>Name</th><th>Room</th><th>Wi‑Fi Password</th><th>Reason</th></tr>";

    var i;
    for (i = 0; i < registrations.length; i++) {
      var r = registrations[i];
      html += "<tr>";
      html += "<td>" + r.name + "</td>";
      html += "<td>" + r.room + "</td>";
      html += "<td>" + r.wifiPass + "</td>";
      html += "<td>" + r.reason + "</td>";
      html += "</tr>";
    }

    html += "</table>";
    box.innerHTML = html;
  } else {
    // Hide admin section if no admin=true parameter
    section.style.display = "none";
  }
}

// Initialize page
function init() {
  $("registerButton").onclick = registerWifi;
  renderPublicList();
  renderAdminPanel();
}

window.onload = init;