/*
 * Job Triangle — application tracker
 * Data is saved after every add, edit, status change, note update, and delete.
 * The storage key is intentionally kept compatible with the earlier V1 build.
 */
const STORAGE_KEY = "jobTriangleApplications_v1";
const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Closed"];
const $ = (id) => document.getElementById(id);
let applications = loadApplications();

function loadApplications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed))
      throw new Error("Saved application data is not a list.");
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id: String(item.id || makeId()),
        company: String(item.company || ""),
        role: String(item.role || ""),
        category: String(item.category || "AWS Cloud"),
        dateApplied: String(item.dateApplied || ""),
        source: String(item.source || "Other"),
        status: STATUSES.includes(item.status) ? item.status : "Applied",
        notes: String(item.notes || ""),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
      }));
  } catch (error) {
    console.error("Job Triangle could not read saved data:", error);
    window.addEventListener(
      "DOMContentLoaded",
      () =>
        showToast(
          "Saved data could not be read. Please check browser storage.",
        ),
      { once: true },
    );
    return [];
  }
}

function saveApplications() {
  try {
    // Save the complete list after every change, not only when the page closes.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    // Confirm that the browser accepted the write before showing success.
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!Array.isArray(saved) || saved.length !== applications.length) {
      throw new Error(
        "The browser did not confirm the saved application list.",
      );
    }
    return true;
  } catch (error) {
    console.error("Job Triangle could not save data:", error);
    showToast(
      "Save failed. Your browser storage may be full or disabled. Export a backup if possible.",
    );
    return false;
  }
}

function todayLocal() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function makeId() {
  return (
    window.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
}

let toastTimer;
function showToast(message) {
  const toast = $("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function count(status) {
  return applications.filter((app) => app.status === status).length;
}

function updateDashboard() {
  $("totalCount").textContent = applications.length;
  $("navTotal").textContent = applications.length;
  $("screeningCount").textContent = count("Screening");
  $("interviewCount").textContent = count("Interview");
  $("offerCount").textContent = count("Offer");

  const total = applications.length;
  const applied = count("Applied");
  const screening = count("Screening");
  const interviews = count("Interview");
  const offers = count("Offer");
  $("responseRate").textContent =
    `${total ? Math.round((screening / total) * 100) : 0}%`;
  $("conversionRate").textContent =
    `${interviews ? Math.round((offers / interviews) * 100) : 0}%`;

  const max = Math.max(total, 1);
  const pipeline = [
    ["Applied", applied],
    ["Screening", screening],
    ["Interview", interviews],
    ["Offer", offers],
    ["Closed", count("Closed")],
  ];
  pipeline.forEach(([name, value]) => {
    $(`pipe${name}`).textContent = value;
    $(`bar${name}`).style.width = `${(value / max) * 100}%`;
  });
}

function render() {
  const query = $("search").value.trim().toLowerCase();
  const statusFilter = $("filterStatus").value;
  const sortBy = $("sortBy").value;

  const visible = applications.filter((app) => {
    const haystack =
      `${app.company} ${app.role} ${app.category} ${app.source} ${app.notes}`.toLowerCase();
    return (
      haystack.includes(query) &&
      (statusFilter === "All" || app.status === statusFilter)
    );
  });

  visible.sort((a, b) => {
    if (sortBy === "oldest") return a.dateApplied.localeCompare(b.dateApplied);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    if (sortBy === "company") return a.company.localeCompare(b.company);
    return b.dateApplied.localeCompare(a.dateApplied);
  });

  $("resultCount").textContent =
    `${visible.length} of ${applications.length} applications shown`;
  $("emptyState").hidden = visible.length > 0;
  $("applicationRows").innerHTML = visible
    .map(
      (app) => `
    <tr>
      <td><div class="company-name">${escapeHTML(app.company)}</div>
          <div class="role-name">${escapeHTML(app.role)}</div>
          <div class="source-name">${escapeHTML(app.source)}</div></td>
      <td><span class="category-tag">${escapeHTML(app.category)}</span></td>
      <td>${escapeHTML(app.dateApplied)}</td>
      <td><select class="status-select status-${escapeHTML(app.status)}" data-status-id="${escapeHTML(app.id)}" aria-label="Status for ${escapeHTML(app.company)}">
        ${STATUSES.map((status) => `<option value="${status}" ${app.status === status ? "selected" : ""}>${status}</option>`).join("")}
      </select></td>
      <td><button class="note-button" data-note-id="${escapeHTML(app.id)}">${app.notes ? "View / edit" : "+ Add note"}</button></td>
      <td><div class="table-actions">
        <button type="button" data-edit-id="${escapeHTML(app.id)}">Edit</button>
        <button type="button" class="delete-button" data-delete-id="${escapeHTML(app.id)}">Delete</button>
      </div></td>
    </tr>`,
    )
    .join("");
  updateDashboard();
}

function resetForm() {
  $("applicationForm").reset();
  $("editId").value = "";
  $("dateApplied").value = todayLocal();
  $("formTitle").textContent = "Add an application";
  $("submitBtn").innerHTML = "Save application <span>→</span>";
  $("cancelEdit").hidden = true;
}

$("applicationForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const editId = $("editId").value;
  const existing = applications.find((app) => app.id === editId);
  const record = {
    id: editId || makeId(),
    company: $("company").value.trim(),
    role: $("role").value.trim(),
    category: $("category").value,
    dateApplied: $("dateApplied").value,
    source: $("source").value,
    status: $("status").value,
    notes: $("notes").value.trim(),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!record.company || !record.role || !record.dateApplied) return;
  if (existing)
    applications = applications.map((app) =>
      app.id === editId ? record : app,
    );
  else applications.push(record);

  const saved = saveApplications();
  render();
  resetForm();
  showToast(
    saved
      ? existing
        ? "Application changes saved."
        : "Application added and saved."
      : "Application updated on screen, but could not be saved.",
  );
});

$("applicationRows").addEventListener("change", (event) => {
  const id = event.target.dataset.statusId;
  if (!id) return;
  applications = applications.map((app) =>
    app.id === id
      ? {
          ...app,
          status: event.target.value,
          updatedAt: new Date().toISOString(),
        }
      : app,
  );
  const saved = saveApplications();
  render();
  showToast(
    saved
      ? "Application status saved."
      : "Status changed, but could not be saved.",
  );
});

$("applicationRows").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const editId = button.dataset.editId;
  const deleteId = button.dataset.deleteId;
  const noteId = button.dataset.noteId;

  if (editId) {
    const app = applications.find((item) => item.id === editId);
    if (!app) return;
    $("editId").value = app.id;
    $("company").value = app.company;
    $("role").value = app.role;
    $("category").value = app.category;
    $("dateApplied").value = app.dateApplied;
    $("source").value = app.source;
    $("status").value = app.status;
    $("notes").value = app.notes || "";
    $("formTitle").textContent = "Edit application details";
    $("submitBtn").innerHTML = "Save changes <span>→</span>";
    $("cancelEdit").hidden = false;
    $("addApplication").scrollIntoView({ behavior: "smooth" });
    $("company").focus({ preventScroll: true });
  }

  if (deleteId) {
    const app = applications.find((item) => item.id === deleteId);
    if (
      app &&
      confirm(
        `Delete the ${app.company} application for ${app.role}? This action cannot be undone.`,
      )
    ) {
      applications = applications.filter((item) => item.id !== deleteId);
      const saved = saveApplications();
      render();
      showToast(
        saved
          ? "Application deleted."
          : "Deleted on screen, but storage could not be updated.",
      );
    }
  }

  if (noteId) {
    const app = applications.find((item) => item.id === noteId);
    if (!app) return;
    const updated = prompt(
      `Notes for ${app.company} — ${app.role}`,
      app.notes || "",
    );
    if (updated !== null) {
      applications = applications.map((item) =>
        item.id === noteId
          ? {
              ...item,
              notes: updated.trim(),
              updatedAt: new Date().toISOString(),
            }
          : item,
      );
      const saved = saveApplications();
      render();
      showToast(
        saved
          ? "Application notes saved."
          : "Notes changed, but could not be saved.",
      );
    }
  }
});

$("cancelEdit").addEventListener("click", resetForm);
["search", "filterStatus", "sortBy"].forEach((id) => {
  $(id).addEventListener(id === "search" ? "input" : "change", render);
});

function exportCSV() {
  if (!applications.length)
    return showToast("There are no applications to export yet.");
  const columns = [
    "company",
    "role",
    "category",
    "dateApplied",
    "source",
    "status",
    "notes",
  ];
  const cell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    columns.join(","),
    ...applications.map((app) =>
      columns.map((key) => cell(app[key])).join(","),
    ),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "job-triangle-applications.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Your application backup has been exported as CSV.");
}

["exportBtn", "exportTop", "exportSide"].forEach((id) =>
  $(id).addEventListener("click", exportCSV),
);
$("mobileMenu").addEventListener("click", () =>
  $("sidebar").classList.toggle("open"),
);
document.querySelectorAll(".nav-link[href]").forEach((link) => {
  link.addEventListener("click", () => $("sidebar").classList.remove("open"));
});

// If the same tracker is open in another tab, reflect its latest saved data.
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY && event.newValue) {
    try {
      const otherTabData = JSON.parse(event.newValue);
      if (Array.isArray(otherTabData)) {
        applications = otherTabData;
        render();
        showToast("Application list refreshed from another tab.");
      }
    } catch (error) {
      console.error("Could not sync application data from another tab:", error);
    }
  }
});

$("dateApplied").value = todayLocal();
render();
