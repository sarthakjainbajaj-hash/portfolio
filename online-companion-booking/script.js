let profiles = [];
let currentUser = null;
let authToken = localStorage.getItem("token") || "";

let currentFilter = "All";
let selectedProfile = null;
const API = "http://localhost:4000/api";

const profilesGrid = document.getElementById("profilesGrid");
const selectedSummary = document.getElementById("selectedSummary");
const bookingType = document.getElementById("bookingType");
const hoursInput = document.getElementById("hoursInput");
const typeLine = document.getElementById("typeLine");
const totalLine = document.getElementById("totalLine");
const bookingForm = document.getElementById("bookingForm");
const successMessage = document.getElementById("successMessage");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const profileForm = document.getElementById("profileForm");
const bookingsList = document.getElementById("bookingsList");
const authStatus = document.getElementById("authStatus");
const logoutBtn = document.getElementById("logoutBtn");
const adminSection = document.getElementById("adminSection");
const adminProfilesList = document.getElementById("adminProfilesList");
const adminBookingsList = document.getElementById("adminBookingsList");

function isAdmin() {
  return currentUser?.role === "admin";
}

function getVisibleProfiles() {
  if (currentFilter === "All") return profiles;
  return profiles.filter((profile) => profile.role === currentFilter);
}

async function api(path, options = {}, expectJson = true) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = expectJson ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

async function apiJson(path, method = "GET", payload = null) {
  return api(
    path,
    {
      method,
      headers: { "Content-Type": "application/json" },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    },
    true,
  );
}

async function apiForm(path, formData) {
  return api(path, { method: "POST", body: formData }, true);
}

function setAuthUI() {
  if (currentUser) {
    authStatus.textContent = `Logged in as ${currentUser.name} (${currentUser.role || "user"})`;
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (adminSection) adminSection.classList.toggle("hidden", !isAdmin());
  } else {
    if (authStatus) authStatus.textContent = "Not logged in";
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (adminSection) adminSection.classList.add("hidden");
  }
}

function renderProfiles() {
  if (!profilesGrid) return;
  const visibleProfiles = getVisibleProfiles();

  if (!visibleProfiles.length) {
    profilesGrid.innerHTML = `<p class="muted">No profiles found for this filter.</p>`;
    return;
  }

  profilesGrid.innerHTML = visibleProfiles
    .map(
      (profile) => `
      <article class="card ${selectedProfile?.id === profile.id ? "selected" : ""}">
        ${profile.imageUrl ? `<img class="profile-image" src="${profile.imageUrl}" alt="${profile.name}" />` : ""}
        <div class="row">
          <div>
            <h3>${profile.name}</h3>
            <p class="meta">${profile.role} · ${profile.age} · ${profile.city}</p>
          </div>
          <span class="price">$${profile.pricePerHour}/hr</span>
        </div>
        <p class="tagline">${profile.about}</p>
        <p><strong>Vibe:</strong> ${profile.vibe}</p>
        <p><strong>Language:</strong> ${profile.language}</p>
        <p class="meta">${profile.interests.join(" · ")}</p>
        ${profile.status ? `<p class="meta">Status: ${profile.status}</p>` : ""}
        <button class="select-btn" data-id="${profile.id}">
          Select ${profile.name}
        </button>
      </article>
    `,
    )
    .join("");

  document.querySelectorAll(".select-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      selectedProfile = profiles.find((profile) => profile.id === id);
      renderProfiles();
      renderSummary();
      renderTotal();
    });
  });
}

function renderSummary() {
  if (!selectedSummary) return;
  if (!selectedProfile) {
    selectedSummary.innerHTML = `<p class="muted">No profile selected.</p>`;
    return;
  }

  selectedSummary.innerHTML = `
    <p><strong>Selected Profile</strong></p>
    <p>${selectedProfile.name} (${selectedProfile.role})</p>
    <p class="muted">$${selectedProfile.pricePerHour} per hour</p>
  `;
}

function renderTotal() {
  if (!totalLine || !hoursInput || !bookingType) return;
  if (!selectedProfile) {
    totalLine.textContent = "Estimated Total: $0";
    return;
  }
  const hours = Number(hoursInput.value) || 1;
  typeLine.textContent = bookingType.value;
  totalLine.textContent = `Estimated Total: $${hours * selectedProfile.pricePerHour}`;
}

async function loadProfiles() {
  profiles = await api("/profiles");
  selectedProfile = profiles[0] || null;
  renderProfiles();
  renderSummary();
  renderTotal();
}

function saveAuth(token, user) {
  authToken = token;
  currentUser = user;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  setAuthUI();
}

function clearAuth() {
  authToken = "";
  currentUser = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setAuthUI();
  if (bookingsList) bookingsList.textContent = "Login to see booking history.";
  if (adminProfilesList) adminProfilesList.textContent = "No pending profiles.";
  if (adminBookingsList) adminBookingsList.textContent = "No bookings found.";
}

async function loadBookings() {
  if (!currentUser || !bookingsList) return;
  const bookings = await api("/bookings/mine");
  if (!bookings.length) {
    bookingsList.innerHTML = `<p class="muted">No bookings yet.</p>`;
    return;
  }

  bookingsList.innerHTML = bookings
    .map(
      (item) => `
      <div class="booking-item">
        <p><strong>${item.profileName}</strong> (${item.bookingType})</p>
        <p class="meta">Date: ${item.date} | Hours: ${item.hours} | Total: $${item.total}</p>
        <p class="meta">Booking: ${item.bookingStatus} | Payment: ${item.paymentStatus} (${item.paymentMethod})</p>
      </div>
    `,
    )
    .join("");
}

async function loadAdminData() {
  if (!isAdmin() || !adminProfilesList || !adminBookingsList) return;
  const [pendingProfiles, allBookings] = await Promise.all([
    api("/admin/profiles/pending"),
    api("/admin/bookings"),
  ]);

  if (!pendingProfiles.length) {
    adminProfilesList.innerHTML = `<p class="muted">No pending profiles.</p>`;
  } else {
    adminProfilesList.innerHTML = pendingProfiles
      .map(
        (profile) => `
        <div class="booking-item">
          <p><strong>${profile.name}</strong> (${profile.role})</p>
          <p class="meta">${profile.city} | $${profile.pricePerHour}/hr</p>
          <div class="row-actions">
            <button class="mini-btn" data-profile-action="approved" data-profile-id="${profile.id}">Approve</button>
            <button class="mini-btn danger" data-profile-action="rejected" data-profile-id="${profile.id}">Reject</button>
          </div>
        </div>
      `,
      )
      .join("");
  }

  if (!allBookings.length) {
    adminBookingsList.innerHTML = `<p class="muted">No bookings found.</p>`;
  } else {
    adminBookingsList.innerHTML = allBookings
      .map(
        (booking) => `
        <div class="booking-item">
          <p><strong>#${booking.id}</strong> ${booking.profileName}</p>
          <p class="meta">${booking.date} | ${booking.hours}h | $${booking.total}</p>
          <p class="meta">Booking: ${booking.bookingStatus} | Payment: ${booking.paymentStatus}</p>
          <div class="row-actions">
            <button class="mini-btn" data-booking-id="${booking.id}" data-booking-status="approved">Approve</button>
            <button class="mini-btn danger" data-booking-id="${booking.id}" data-booking-status="rejected">Reject</button>
            <button class="mini-btn" data-booking-id="${booking.id}" data-payment-status="paid">Mark Paid</button>
          </div>
        </div>
      `,
      )
      .join("");
  }

  document.querySelectorAll("[data-profile-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      await apiJson(`/admin/profiles/${button.dataset.profileId}`, "PATCH", {
        status: button.dataset.profileAction,
      });
      await loadAdminData();
      await loadProfiles();
    });
  });

  document.querySelectorAll("[data-booking-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      await apiJson(`/admin/bookings/${button.dataset.bookingId}`, "PATCH", {
        bookingStatus: button.dataset.bookingStatus,
        paymentStatus: button.dataset.paymentStatus,
      });
      await loadAdminData();
      await loadBookings();
    });
  });
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");

    currentFilter = chip.dataset.filter;
    const visible = getVisibleProfiles();
    if (!selectedProfile && visible.length) {
      selectedProfile = visible[0];
    }
    if (selectedProfile && !visible.some((profile) => profile.id === selectedProfile.id)) {
      selectedProfile = visible[0] || profiles[0] || null;
    }

    renderProfiles();
    renderSummary();
    renderTotal();
  });
});

if (bookingType && hoursInput) {
  bookingType.addEventListener("change", renderTotal);
  hoursInput.addEventListener("input", renderTotal);
}

if (bookingForm) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) {
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = "Please login first to confirm booking.";
      }
      return;
    }
    if (!selectedProfile || !bookingType || !hoursInput) return;

    const formData = new FormData(bookingForm);
    try {
      const booking = await apiJson("/bookings", "POST", {
        profileId: selectedProfile.id,
        bookingType: bookingType.value,
        date: formData.get("date"),
        hours: Number(hoursInput.value) || 1,
        note: formData.get("note"),
        paymentMethod: formData.get("paymentMethod"),
      });
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = `Booking confirmed with ${booking.profileName}. Total: $${booking.total}`;
      }
      bookingForm.reset();
      hoursInput.value = 2;
      renderTotal();
      await loadBookings();
    } catch (error) {
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = error.message;
      }
    }
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(signupForm);
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    const acceptedTerms = data.get("termsAccepted");

    if (confirmPassword !== null && password !== confirmPassword) {
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = "Passwords do not match.";
      }
      return;
    }

    if (confirmPassword !== null && !acceptedTerms) {
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = "You must accept the terms and conditions.";
      }
      return;
    }

    try {
      const result = await apiJson("/auth/signup", "POST", {
        name: data.get("name"),
        email: data.get("email"),
        password,
      });
      saveAuth(result.token, result.user);
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = "Signup successful. You are now logged in.";
      }
      signupForm.reset();
      await loadBookings();
      await loadAdminData();
    } catch (error) {
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = error.message;
      }
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    try {
      const result = await apiJson("/auth/login", "POST", {
        email: data.get("email"),
        password: data.get("password"),
      });
      saveAuth(result.token, result.user);
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = "Login successful.";
      }
      loginForm.reset();
      await loadBookings();
      await loadAdminData();
    } catch (error) {
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = error.message;
      }
    }
  });
}

if (profileForm) {
  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) {
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = "Please login to list your profile.";
      }
      return;
    }

    const data = new FormData(profileForm);
    try {
      await apiForm("/profiles", data);
      profileForm.reset();
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = "Profile submitted. It will be visible after admin approval.";
      }
      await loadProfiles();
    } catch (error) {
      if (successMessage) {
        successMessage.classList.remove("hidden");
        successMessage.textContent = error.message;
      }
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", clearAuth);
}

async function initialize() {
  const savedUser = localStorage.getItem("user");
  if (authToken && savedUser) {
    currentUser = JSON.parse(savedUser);
  }
  setAuthUI();
  if (profilesGrid) {
    await loadProfiles();
  }
  if (currentUser) {
    await loadBookings();
    await loadAdminData();
  }
}

initialize();
