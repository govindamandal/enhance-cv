const STORAGE_KEY = "resume-studio-suite-v2";

const starterResume = {
  id: "resume-1",
  title: "My Resume",
  profile: {
    name: "Ava Morgan",
    role: "Senior Product Designer",
    email: "ava.morgan@example.com",
    phone: "+1 415 555 0189",
    location: "San Francisco, CA",
    website: "avamorgan.design",
    summary:
      "Product designer with 8 years of experience turning complex workflows into clear, accessible tools. Led design systems, hiring flows, and analytics products used by global teams."
  },
  experience: [
    {
      company: "Northstar Labs",
      title: "Senior Product Designer",
      start: "2022",
      end: "Present",
      bullets:
        "Redesigned onboarding and increased activated accounts by 31%.\nBuilt a component library adopted by 9 product squads.\nPartnered with research and data science to prioritize high-value user journeys."
    },
    {
      company: "Luma Health",
      title: "Product Designer",
      start: "2018",
      end: "2022",
      bullets:
        "Shipped scheduling tools that reduced support tickets by 24%.\nFacilitated weekly design critiques and mentored 4 junior designers.\nCreated prototypes for executive demos and enterprise pilots."
    }
  ],
  education: [
    {
      school: "California College of the Arts",
      degree: "BFA, Interaction Design",
      dates: "2014 - 2018",
      location: "San Francisco, CA"
    }
  ],
  skills: "Product strategy, UX research, Prototyping, Design systems, Figma, Accessibility, Analytics, Workshop facilitation",
  highlights: "2025 Design Systems Lead\nSpeaker at ProductCraft SF\nCertified Accessibility Specialist",
  design: {
    template: "modern",
    color: "#5b4dff"
  }
};

const starterState = {
  activeView: "dashboard",
  activeResumeId: "resume-1",
  resumes: [starterResume],
  jobs: [
    {
      id: "job-1",
      position: "Senior Test Role",
      company: "TechFlow",
      url: "https://jobs.example.com/senior-test-role",
      status: "Bookmarked",
      dateSaved: "Jun 8, 2026",
      dateApplied: "",
      type: "Full-time",
      resumeId: "resume-1",
      coverLetter: "",
      notes: "Suggested for interview practice",
      details:
        "Own product quality workflows, collaborate with design and engineering, and present insights to senior stakeholders."
    }
  ],
  interview: {
    selectedJobId: "",
    selectedResumeId: "",
    prepCount: 0
  }
};

let appState = loadState();
let resume = getActiveResume();
let dirty = false;
let selectedResumeCard = false;

const form = document.querySelector("#resumeForm");
const preview = document.querySelector("#resumePreview");
const statusEl = document.querySelector("#savedStatus");
const globalSaveStatus = document.querySelector("#globalSaveStatus");

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(starterState);
    const parsed = JSON.parse(saved);
    if (!parsed.resumes || !parsed.jobs) return structuredClone(starterState);
    return parsed;
  } catch {
    return structuredClone(starterState);
  }
}

function persist(isAuto = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState, null, 2));
  dirty = false;
  updateStatus(isAuto ? "Saved ✓" : "Saved locally");
}

function updateStatus(text) {
  const label = dirty ? "Unsaved changes" : text || "Saved ✓";
  statusEl.textContent = label;
  globalSaveStatus.textContent = dirty ? "Saving..." : "Saved ✓";
}

function markDirty() {
  dirty = true;
  updateStatus();
}

function autoSave() {
  persist(true);
}

function getActiveResume() {
  return appState.resumes.find((item) => item.id === appState.activeResumeId) || appState.resumes[0];
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function lines(value = "") {
  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function todayLabel() {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date());
}

function bindProfileFields() {
  resume = getActiveResume();
  Object.entries(resume.profile).forEach(([key, value]) => {
    const input = form.elements[key];
    if (input) input.value = value;
  });
  form.elements.skills.value = resume.skills;
  form.elements.highlights.value = resume.highlights;
}

function createListItem(kind, item, index) {
  const template = document.querySelector(`#${kind}Template`);
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector("strong").textContent = kind === "experience" ? item.title || "Experience item" : item.degree || "Education item";
  node.querySelectorAll("[data-field]").forEach((input) => {
    input.value = item[input.dataset.field] || "";
    input.addEventListener("input", () => {
      resume[kind][index][input.dataset.field] = input.value;
      markDirty();
      renderPreview();
      updateScore();
      renderDashboard();
    });
  });
  node.querySelector(".remove-btn").addEventListener("click", () => {
    resume[kind].splice(index, 1);
    markDirty();
    renderResumeEditor();
  });
  return node;
}

function renderEditors() {
  document
    .querySelector("#experienceEditor")
    .replaceChildren(...resume.experience.map((item, index) => createListItem("experience", item, index)));
  document
    .querySelector("#educationEditor")
    .replaceChildren(...resume.education.map((item, index) => createListItem("education", item, index)));
}

function renderPreview() {
  document.documentElement.style.setProperty("--accent", resume.design.color);
  preview.className = `resume-page template-${resume.design.template}${preview.classList.contains("is-fit") ? " is-fit" : ""}`;
  document.querySelector("#resumeTitle").textContent = `${resume.profile.role || "Untitled"} Resume`;

  const contact = [resume.profile.email, resume.profile.phone, resume.profile.location, resume.profile.website]
    .filter(Boolean)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");

  const experienceHtml = resume.experience
    .map(
      (item) => `
        <div class="resume-item">
          <h4>${escapeHtml(item.title)}${item.company ? ` · ${escapeHtml(item.company)}` : ""}</h4>
          <div class="item-meta">${escapeHtml([item.start, item.end].filter(Boolean).join(" - "))}</div>
          <ul>${lines(item.bullets).map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
        </div>
      `
    )
    .join("");

  const educationHtml = resume.education
    .map(
      (item) => `
        <div class="resume-item">
          <h4>${escapeHtml(item.degree)}</h4>
          <div class="item-meta">${escapeHtml(item.school)}${item.location ? ` · ${escapeHtml(item.location)}` : ""}</div>
          <p>${escapeHtml(item.dates)}</p>
        </div>
      `
    )
    .join("");

  preview.innerHTML = `
    <div class="resume-inner">
      <header class="resume-header">
        <div>
          <h2>${escapeHtml(resume.profile.name)}</h2>
          <div class="resume-role">${escapeHtml(resume.profile.role)}</div>
        </div>
        <div class="contact-list">${contact}</div>
      </header>
      <div class="resume-body">
        <main>
          <section class="resume-section">
            <h3>Summary</h3>
            <p>${escapeHtml(resume.profile.summary)}</p>
          </section>
          <section class="resume-section">
            <h3>Experience</h3>
            ${experienceHtml || "<p>Add experience to complete this section.</p>"}
          </section>
        </main>
        <aside>
          <section class="resume-section">
            <h3>Skills</h3>
            <div class="skill-cloud">${lines(resume.skills).map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div>
          </section>
          <section class="resume-section">
            <h3>Education</h3>
            ${educationHtml || "<p>Add education to complete this section.</p>"}
          </section>
          <section class="resume-section">
            <h3>Highlights</h3>
            <ul>${lines(resume.highlights).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>
        </aside>
      </div>
    </div>
  `;
}

function updateScore() {
  const checks = [
    resume.profile.name,
    resume.profile.role,
    resume.profile.email,
    resume.profile.summary.length > 80,
    resume.experience.length > 0,
    resume.experience.some((item) => /\d|%/.test(item.bullets)),
    resume.education.length > 0,
    lines(resume.skills).length >= 6,
    lines(resume.highlights).length >= 2
  ];
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  document.querySelector("#scoreValue").textContent = `${score}%`;
  document.querySelector("#scoreMeter").style.width = `${score}%`;
  document.querySelector("#scoreTip").textContent =
    score >= 90 ? "Strong profile. Fine-tune wording for each application." : "Add measurable impact to make this sharper.";
}

function renderResumeEditor() {
  resume = getActiveResume();
  renderEditors();
  renderPreview();
  updateScore();
  updateStatus();
  document.querySelectorAll(".template-card").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.template === resume.design.template);
  });
}

function setView(view) {
  appState.activeView = view;
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.viewPanel === view);
  });
  document.querySelectorAll(".top-link").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  if (view === "jobs") renderJobs();
  if (view === "interview") renderInterview();
  if (view === "documents") renderResumeEditor();
  renderDashboard();
  history.replaceState(null, "", `#${view}`);
}

function statusClass(status) {
  return `status-pill status-${status.toLowerCase().replaceAll(" ", "-")}`;
}

function renderJobs() {
  const query = document.querySelector("#jobSearch").value.trim().toLowerCase();
  const jobs = appState.jobs.filter((job) => `${job.position} ${job.company} ${job.status}`.toLowerCase().includes(query));
  const rows = jobs.map(
    (job) => `
      <tr>
        <td><input type="checkbox" aria-label="Select ${escapeHtml(job.position)}" /></td>
        <td><strong>${escapeHtml(job.position)}</strong></td>
        <td>${escapeHtml(job.company)}</td>
        <td><a href="${escapeHtml(job.url)}" target="_blank" rel="noreferrer">↗</a></td>
        <td><button class="${statusClass(job.status)}" data-status-job="${job.id}" type="button">▮ ${escapeHtml(job.status)} ⌄</button></td>
        <td>${escapeHtml(job.dateSaved)}</td>
        <td>${job.dateApplied ? escapeHtml(job.dateApplied) : '<span class="empty-cell">+ Date Applied</span>'}</td>
        <td>${escapeHtml(job.type || "Type")}</td>
        <td>${job.resumeId ? "✓ My Resume" : '<span class="empty-cell">+ Resume</span>'}</td>
        <td>${job.coverLetter ? "✓ Cover Letter" : '<span class="empty-cell">+ Cover Letter</span>'}</td>
        <td>${job.notes ? escapeHtml(job.notes) : '<span class="empty-cell">Write a note</span>'}</td>
        <td>＋</td>
      </tr>
    `
  );
  document.querySelector("#jobsTableBody").innerHTML =
    rows.join("") ||
    `<tr><td></td><td class="empty-cell">Add Job Position</td><td class="empty-cell">Add Company</td><td>＋</td><td><span class="status-pill">▮ Bookmarked ⌄</span></td><td>${todayLabel()}</td><td class="empty-cell">+ Date Applied</td><td class="empty-cell">Type</td><td class="empty-cell">+ Resume</td><td class="empty-cell">+ Cover Letter</td><td class="empty-cell">Write a note</td><td>＋</td></tr>`;

  document.querySelectorAll("[data-status-job]").forEach((button) => {
    button.addEventListener("click", () => cycleJobStatus(button.dataset.statusJob));
  });
  renderDashboard();
}

function cycleJobStatus(jobId) {
  const order = ["Bookmarked", "Applied", "Interviewing", "Rejected"];
  const job = appState.jobs.find((item) => item.id === jobId);
  if (!job) return;
  job.status = order[(order.indexOf(job.status) + 1) % order.length];
  if (job.status === "Applied" && !job.dateApplied) job.dateApplied = todayLabel();
  autoSave();
  renderJobs();
}

function inferJobFromUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    url = new URL(`https://${rawUrl}`);
  }
  const hostParts = url.hostname.replace(/^www\./, "").split(".");
  const companyName = {
    linkedin: "LinkedIn",
    indeed: "Indeed",
    greenhouse: "Greenhouse",
    lever: "Lever",
    workable: "Workable"
  };
  const company = companyName[hostParts[0].toLowerCase()] || hostParts[0]
    .split(/-|_/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
  const pathWords = url.pathname
    .split(/[/?#/_-]+/)
    .filter((word) => word && !/^\d+$/.test(word) && !["jobs", "job", "careers", "position", "opening", "view"].includes(word.toLowerCase()));
  const title =
    pathWords.length > 1
      ? pathWords.slice(0, 5).map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")
      : "Product Designer";
  const normalizedUrl = url.href;
  return {
    id: `job-${Date.now()}`,
    position: title,
    company: company || "Imported Company",
    url: normalizedUrl,
    status: "Bookmarked",
    dateSaved: todayLabel(),
    dateApplied: "",
    type: "Full-time",
    resumeId: "",
    coverLetter: "",
    notes: "Imported from job posting URL",
    details: `AI extracted this from ${url.hostname}: ${title} at ${company || "Imported Company"}. Focus areas include collaboration, measurable outcomes, stakeholder communication, and role-specific execution.`
  };
}

function openJobModal() {
  document.querySelector("#jobModal").hidden = false;
  document.querySelector("#jobUrlInput").focus();
}

function closeJobModal() {
  document.querySelector("#jobModal").hidden = true;
  document.querySelector("#aiStatus").textContent = "";
  document.querySelector("#jobUrlInput").value = "";
  document.querySelector("#addJobFromUrlBtn").disabled = true;
}

function addManualJob() {
  const job = {
    id: `job-${Date.now()}`,
    position: "Add Job Position",
    company: "Add Company",
    url: "#",
    status: "Bookmarked",
    dateSaved: todayLabel(),
    dateApplied: "",
    type: "Type",
    resumeId: "",
    coverLetter: "",
    notes: "",
    details: "Manual entry. Add details as you learn more about this role."
  };
  appState.jobs.unshift(job);
  autoSave();
  closeJobModal();
  setView("jobs");
}

async function addJobFromUrl() {
  const input = document.querySelector("#jobUrlInput");
  const status = document.querySelector("#aiStatus");
  const button = document.querySelector("#addJobFromUrlBtn");
  button.disabled = true;
  status.textContent = "AI is reading the job posting...";
  await new Promise((resolve) => setTimeout(resolve, 900));
  const job = inferJobFromUrl(input.value.trim());
  status.textContent = "Job details extracted and saved.";
  await new Promise((resolve) => setTimeout(resolve, 350));
  appState.jobs.unshift(job);
  autoSave();
  closeJobModal();
  setView("jobs");
}

function renderInterview() {
  const selectedJob = appState.jobs.find((job) => job.id === appState.interview.selectedJobId);
  const selectedResume = appState.resumes.find((item) => item.id === appState.interview.selectedResumeId);
  document.querySelector("#selectedJobLabel").textContent = selectedJob
    ? `${selectedJob.position} · ${selectedJob.company}`
    : "Which job are you preparing for?";
  document.querySelector("#selectedResumeLabel").textContent = selectedResume ? selectedResume.title : "Select Resume";
  const resumeDrop = document.querySelector("#openResumePickerBtn");
  resumeDrop.classList.toggle("has-value", Boolean(selectedResume));
  document.querySelector("#resumeStep").classList.toggle("has-value", Boolean(selectedResume));
  document.querySelector("#generatePrepBtn").disabled = !(selectedJob && selectedResume);

  const suggestions =
    appState.jobs
      .map(
        (job) => `<button class="select-option" data-select-job="${job.id}" type="button"><strong>${escapeHtml(job.position)}</strong><span>${escapeHtml(job.company)} · ${escapeHtml(job.status)}</span></button>`
      )
      .join("") || '<p class="select-option">No saved jobs yet.</p>';
  document.querySelector("#jobSelectMenu").innerHTML = `
    <button class="add-job-option" id="addJobFromInterviewBtn" type="button">＋ Add a New Job</button>
    ${suggestions}
  `;
  document.querySelectorAll("[data-select-job]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.interview.selectedJobId = button.dataset.selectJob;
      document.querySelector("#jobSelectMenu").classList.remove("is-open");
      autoSave();
      renderInterview();
    });
  });
  document.querySelector("#addJobFromInterviewBtn").addEventListener("click", () => {
    document.querySelector("#jobSelectMenu").classList.remove("is-open");
    openJobModal();
  });
}

function openResumeModal() {
  selectedResumeCard = false;
  document.querySelector("#resumeChoiceBtn").classList.remove("is-selected");
  document.querySelector("#chooseResumeBtn").disabled = true;
  document.querySelector("#resumeModal").hidden = false;
}

function closeResumeModal() {
  document.querySelector("#resumeModal").hidden = true;
}

function chooseResume() {
  appState.interview.selectedResumeId = appState.activeResumeId;
  autoSave();
  closeResumeModal();
  renderInterview();
}

function generatePrep() {
  const job = appState.jobs.find((item) => item.id === appState.interview.selectedJobId);
  const selected = appState.resumes.find((item) => item.id === appState.interview.selectedResumeId);
  if (!job || !selected) return;
  appState.interview.prepCount += 1;
  const skillList = lines(selected.skills).slice(0, 5);
  document.querySelector("#prepOutput").classList.add("is-visible");
  document.querySelector("#prepOutput").innerHTML = `
    <h2>Interview prep for ${escapeHtml(job.position)} at ${escapeHtml(job.company)}</h2>
    <div class="prep-grid">
      <article class="prep-card">
        <h3>Company overview</h3>
        <p>${escapeHtml(job.details)}</p>
      </article>
      <article class="prep-card">
        <h3>STAR storylines</h3>
        <ul>
          <li>Describe a project where you improved a workflow using ${escapeHtml(skillList[0] || "structured discovery")}.</li>
          <li>Share a measurable outcome from ${escapeHtml(selected.experience[0]?.company || "your recent role")}.</li>
          <li>Explain how you handled conflicting stakeholder priorities.</li>
        </ul>
      </article>
      <article class="prep-card">
        <h3>Practice questions</h3>
        <ul>
          <li>Why are you interested in ${escapeHtml(job.company)}?</li>
          <li>How would you approach your first 30 days?</li>
          <li>What tradeoff are you proud of making?</li>
        </ul>
      </article>
    </div>
  `;
  autoSave();
  renderDashboard();
  document.querySelector("#prepOutput").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDashboard() {
  document.querySelector("#dashboardDocCount").textContent = appState.resumes.length;
  document.querySelector("#dashboardJobCount").textContent = appState.jobs.length;
  document.querySelector("#dashboardPrepCount").textContent = appState.interview.prepCount;
}

form.addEventListener("input", (event) => {
  const target = event.target;
  if (target.name && target.name in resume.profile) resume.profile[target.name] = target.value;
  if (target.name === "skills") resume.skills = target.value;
  if (target.name === "highlights") resume.highlights = target.value;
  markDirty();
  renderPreview();
  updateScore();
});

document.querySelectorAll(".top-link").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-view-jump]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewJump));
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll("[data-panel-content]").forEach((panel) => {
      panel.classList.toggle("is-visible", panel.dataset.panelContent === button.dataset.panel);
    });
    button.classList.add("is-active");
  });
});

document.querySelector("#addExperienceBtn").addEventListener("click", () => {
  resume.experience.push({ company: "", title: "New role", start: "", end: "", bullets: "" });
  markDirty();
  renderResumeEditor();
});

document.querySelector("#addEducationBtn").addEventListener("click", () => {
  resume.education.push({ school: "", degree: "New program", dates: "", location: "" });
  markDirty();
  renderResumeEditor();
});

document.querySelectorAll(".template-card").forEach((button) => {
  button.addEventListener("click", () => {
    resume.design.template = button.dataset.template;
    markDirty();
    renderResumeEditor();
  });
});

document.querySelectorAll(".swatch").forEach((button) => {
  button.addEventListener("click", () => {
    resume.design.color = button.dataset.color;
    markDirty();
    renderResumeEditor();
  });
});

document.querySelector("#saveBtn").addEventListener("click", () => persist(false));

document.querySelector("#newResumeBtn").addEventListener("click", () => {
  const next = structuredClone(starterResume);
  next.id = `resume-${Date.now()}`;
  next.title = `My Resume ${appState.resumes.length + 1}`;
  appState.resumes.push(next);
  appState.activeResumeId = next.id;
  resume = next;
  bindProfileFields();
  markDirty();
  renderResumeEditor();
  renderDashboard();
});

document.querySelector("#printBtn").addEventListener("click", () => {
  persist(false);
  window.print();
});

document.querySelector("#fitPreviewBtn").addEventListener("click", () => {
  preview.classList.toggle("is-fit");
});

document.querySelector("#exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(appState, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resume-studio-suite.json";
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#importInput").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    appState = imported.resumes ? imported : { ...structuredClone(starterState), resumes: [imported], activeResumeId: imported.id || "resume-1" };
    resume = getActiveResume();
    bindProfileFields();
    markDirty();
    renderResumeEditor();
    renderJobs();
    renderInterview();
  } catch {
    alert("That JSON file could not be imported.");
  } finally {
    event.target.value = "";
  }
});

document.querySelector("#jobSearch").addEventListener("input", renderJobs);
document.querySelector("#openJobModalBtn").addEventListener("click", openJobModal);
document.querySelector("#closeJobModalBtn").addEventListener("click", closeJobModal);
document.querySelector("#manualJobBtn").addEventListener("click", addManualJob);
document.querySelector("#addJobFromUrlBtn").addEventListener("click", addJobFromUrl);
document.querySelector("#jobUrlInput").addEventListener("input", (event) => {
  document.querySelector("#addJobFromUrlBtn").disabled = event.target.value.trim().length < 6;
});
document.querySelector("#jobModal").addEventListener("click", (event) => {
  if (event.target.id === "jobModal") closeJobModal();
});

document.querySelector("#statsBtn").addEventListener("click", () => {
  let panel = document.querySelector(".stats-panel");
  if (panel) {
    panel.hidden = !panel.hidden;
    return;
  }
  panel = document.createElement("section");
  panel.className = "stats-panel";
  const counts = ["Bookmarked", "Applied", "Interviewing", "Rejected"].map((status) => ({
    status,
    count: appState.jobs.filter((job) => job.status === status).length
  }));
  panel.innerHTML = counts.map((item) => `<article><strong>${item.count}</strong><p>${item.status}</p></article>`).join("");
  document.querySelector(".jobs-page").insertBefore(panel, document.querySelector(".job-table-wrap"));
});

document.querySelector("#jobSelectBtn").addEventListener("click", () => {
  document.querySelector("#jobSelectMenu").classList.toggle("is-open");
});
document.querySelector("#openResumePickerBtn").addEventListener("click", openResumeModal);
document.querySelector("#closeResumeModalBtn").addEventListener("click", closeResumeModal);
document.querySelector("#resumeModal").addEventListener("click", (event) => {
  if (event.target.id === "resumeModal") closeResumeModal();
});
document.querySelector("#resumeChoiceBtn").addEventListener("click", () => {
  selectedResumeCard = !selectedResumeCard;
  document.querySelector("#resumeChoiceBtn").classList.toggle("is-selected", selectedResumeCard);
  document.querySelector("#chooseResumeBtn").disabled = !selectedResumeCard;
});
document.querySelector("#chooseResumeBtn").addEventListener("click", chooseResume);
document.querySelector("#generatePrepBtn").addEventListener("click", generatePrep);

bindProfileFields();
renderResumeEditor();
renderJobs();
renderInterview();
renderDashboard();
setView(location.hash.replace("#", "") || appState.activeView || "dashboard");
persist(true);
