<script setup lang="ts">
useHead({
  title: "Resume Studio"
});

onMounted(() => {
  const existing = document.querySelector('script[data-resume-studio="true"]');
  if (existing) existing.remove();

  const script = document.createElement("script");
  script.src = `/app.js?v=${Date.now()}`;
  script.defer = true;
  script.dataset.resumeStudio = "true";
  document.body.appendChild(script);
});
</script>

<template>
  <div>
    <header class="app-header">
      <a class="logo" href="#dashboard" aria-label="Resume Studio home">
        <span class="logo-loop"></span>
      </a>
      <nav class="top-nav" aria-label="Main navigation">
        <button class="top-link is-active" data-view="dashboard" type="button">Dashboard</button>
        <button class="top-link" data-view="documents" type="button">Documents</button>
        <button class="top-link" data-view="jobs" type="button">My Saved Jobs</button>
        <button class="top-link" data-view="interview" type="button">Prepare for Interview</button>
        <button class="top-link" data-view="examples" type="button">Resume Examples ↗</button>
      </nav>
      <div class="header-actions">
        <span class="save-indicator" id="globalSaveStatus">Saved ✓</span>
        <button class="upgrade-btn" type="button">Upgrade</button>
        <button class="avatar-btn" type="button" aria-label="Account">♙</button>
        <button class="chevron-btn" type="button" aria-label="Open account menu">⌄</button>
      </div>
    </header>

    <main>
      <section class="view is-active" id="dashboardView" data-view-panel="dashboard">
        <div class="page-pad dashboard-grid">
          <section class="welcome-panel">
            <p class="eyebrow">Career workspace</p>
            <h1>Build, track, and prepare from one place.</h1>
            <p>Manage resumes, save job applications, and generate focused interview prep from your saved roles.</p>
            <div class="quick-actions">
              <button class="primary-action" data-view-jump="documents" type="button">Edit resume</button>
              <button class="secondary-action" data-view-jump="jobs" type="button">Track jobs</button>
            </div>
          </section>
          <section class="metric-grid" aria-label="Workspace summary">
            <article class="metric-card">
              <span>Documents</span>
              <strong id="dashboardDocCount">1</strong>
              <p>Active resume ready to tailor.</p>
            </article>
            <article class="metric-card">
              <span>Saved jobs</span>
              <strong id="dashboardJobCount">0</strong>
              <p>Applications in your tracker.</p>
            </article>
            <article class="metric-card">
              <span>Interview kits</span>
              <strong id="dashboardPrepCount">0</strong>
              <p>Generated prep guides.</p>
            </article>
          </section>
        </div>
      </section>

      <section class="view" id="documentsView" data-view-panel="documents">
        <div class="documents-shell">
          <aside class="resume-sidebar" aria-label="Resume sections">
            <button class="primary-action" id="newResumeBtn" type="button">New resume</button>
            <nav class="side-nav" aria-label="Resume editor sections">
              <button class="nav-item is-active" data-panel="profile" type="button">Profile</button>
              <button class="nav-item" data-panel="experience" type="button">Experience</button>
              <button class="nav-item" data-panel="education" type="button">Education</button>
              <button class="nav-item" data-panel="skills" type="button">Skills</button>
              <button class="nav-item" data-panel="design" type="button">Design</button>
            </nav>
            <div class="score-card">
              <span>Resume strength</span>
              <strong id="scoreValue">82%</strong>
              <div class="meter"><span id="scoreMeter"></span></div>
              <p id="scoreTip">Add measurable impact to make this sharper.</p>
            </div>
          </aside>

          <section class="workspace">
            <header class="subbar">
              <div>
                <p class="eyebrow">Documents</p>
                <h1 id="resumeTitle">Senior Product Designer Resume</h1>
              </div>
              <div class="toolbar">
                <button id="saveBtn" type="button">Save</button>
                <button id="exportBtn" type="button">Export JSON</button>
                <label class="import-btn" for="importInput">Import</label>
                <input id="importInput" type="file" accept="application/json" />
                <button class="accent-btn" id="printBtn" type="button">Download PDF</button>
              </div>
            </header>

            <section class="builder-layout">
              <form class="editor-panel" id="resumeForm">
                <section class="panel is-visible" data-panel-content="profile">
                  <div class="panel-heading">
                    <h2>Profile</h2>
                    <span>Basics and summary</span>
                  </div>
                  <div class="field-grid">
                    <label>Full name <input name="name" type="text" /></label>
                    <label>Role <input name="role" type="text" /></label>
                    <label>Email <input name="email" type="email" /></label>
                    <label>Phone <input name="phone" type="tel" /></label>
                    <label>Location <input name="location" type="text" /></label>
                    <label>Website <input name="website" type="url" /></label>
                  </div>
                  <label>Professional summary <textarea name="summary" rows="5"></textarea></label>
                </section>

                <section class="panel" data-panel-content="experience">
                  <div class="panel-heading row-heading">
                    <div>
                      <h2>Experience</h2>
                      <span>Roles, dates, and impact</span>
                    </div>
                    <button class="ghost-btn" id="addExperienceBtn" type="button">Add role</button>
                  </div>
                  <div class="list-editor" id="experienceEditor"></div>
                </section>

                <section class="panel" data-panel-content="education">
                  <div class="panel-heading row-heading">
                    <div>
                      <h2>Education</h2>
                      <span>Schools, programs, and dates</span>
                    </div>
                    <button class="ghost-btn" id="addEducationBtn" type="button">Add education</button>
                  </div>
                  <div class="list-editor" id="educationEditor"></div>
                </section>

                <section class="panel" data-panel-content="skills">
                  <div class="panel-heading">
                    <h2>Skills</h2>
                    <span>Comma-separated skills and toolkits</span>
                  </div>
                  <label>Skills <textarea name="skills" rows="5"></textarea></label>
                  <label>Highlights <textarea name="highlights" rows="4"></textarea></label>
                </section>

                <section class="panel" data-panel-content="design">
                  <div class="panel-heading">
                    <h2>Design</h2>
                    <span>Choose a template and accent</span>
                  </div>
                  <div class="template-grid" role="radiogroup" aria-label="Resume template">
                    <button class="template-card is-selected" data-template="modern" type="button">Modern</button>
                    <button class="template-card" data-template="classic" type="button">Classic</button>
                    <button class="template-card" data-template="compact" type="button">Compact</button>
                  </div>
                  <div class="swatches" aria-label="Accent color">
                    <button class="swatch" data-color="#5b4dff" style="--swatch:#5b4dff" type="button"></button>
                    <button class="swatch" data-color="#00bf8f" style="--swatch:#00bf8f" type="button"></button>
                    <button class="swatch" data-color="#b54708" style="--swatch:#b54708" type="button"></button>
                    <button class="swatch" data-color="#c2255c" style="--swatch:#c2255c" type="button"></button>
                  </div>
                </section>
              </form>

              <section class="preview-panel" aria-label="Resume preview">
                <div class="preview-actions">
                  <span id="savedStatus">Unsaved changes</span>
                  <button id="fitPreviewBtn" type="button">Fit page</button>
                </div>
                <article class="resume-page template-modern" id="resumePreview"></article>
              </section>
            </section>
          </section>
        </div>
      </section>

      <section class="view" id="jobsView" data-view-panel="jobs">
        <div class="jobs-page">
          <div class="job-toolbar">
            <div class="job-title">
              <span class="target-icon">◎</span>
              <h1>Job Tracker</h1>
            </div>
            <label class="search-box">
              <span>⌕</span>
              <input id="jobSearch" type="search" placeholder="Search" />
            </label>
            <button class="filter-btn" id="statusFilterBtn" type="button">≡ All Statuses ⌄</button>
            <button class="filter-btn" type="button">▣ Columns ⌄</button>
            <button class="filter-btn" id="statsBtn" type="button">⌁ View Statistics ⌄</button>
            <button class="new-job-btn" id="openJobModalBtn" type="button">＋ New Job Application</button>
            <button class="filter-btn" type="button">Menu ⋯</button>
          </div>
          <div class="job-table-wrap">
            <table class="job-table">
              <thead>
                <tr>
                  <th><input type="checkbox" aria-label="Select all jobs" /></th>
                  <th>Position</th>
                  <th>Company</th>
                  <th>↗</th>
                  <th>Status</th>
                  <th>Date Saved</th>
                  <th>Date Applied</th>
                  <th>Type</th>
                  <th>Resume</th>
                  <th>Cover Letter</th>
                  <th>Notes</th>
                  <th>＋</th>
                </tr>
              </thead>
              <tbody id="jobsTableBody"></tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="view" id="interviewView" data-view-panel="interview">
        <div class="interview-page">
          <section class="interview-copy">
            <h1>Two steps.<br />Three clicks.<br /><span>Interview ready.</span></h1>
            <p>Get a personalized prep guide in minutes.</p>
            <ul>
              <li>✓ Concise company overview</li>
              <li>✓ STAR storylines</li>
              <li>✓ Key talking points</li>
              <li>✓ Practice questions</li>
            </ul>
            <strong class="support-pill">ϟ Efficient &amp; supportive</strong>
          </section>
          <section class="interview-card">
            <div class="step-row is-complete">
              <span class="step-number">1</span>
              <div>
                <h2>Select a job</h2>
                <button class="select-field" id="jobSelectBtn" type="button">
                  <span id="selectedJobLabel">Which job are you preparing for?</span>
                  <span>⌄</span>
                </button>
                <div class="select-menu" id="jobSelectMenu"></div>
              </div>
            </div>
            <div class="step-row" id="resumeStep">
              <span class="step-number">2</span>
              <div>
                <h2>Add your resume</h2>
                <button class="resume-drop" id="openResumePickerBtn" type="button">
                  <span class="plus-or-doc">＋</span>
                  <strong id="selectedResumeLabel">Select Resume</strong>
                  <small>Click to select from one of your resumes</small>
                </button>
              </div>
            </div>
            <button class="ready-btn" id="generatePrepBtn" type="button" disabled>Get Interview Ready</button>
          </section>
        </div>
        <section class="prep-output" id="prepOutput"></section>
      </section>

      <section class="view" id="examplesView" data-view-panel="examples">
        <div class="page-pad">
          <div class="examples-header">
            <p class="eyebrow">Resume examples</p>
            <h1>Pick a starting point.</h1>
            <p>Browse role-specific layouts and copy patterns you can adapt inside Documents.</p>
          </div>
          <div class="example-grid">
            <article class="example-card"><span>Product</span><strong>Product Designer</strong><p>Case-study-led profile with measurable outcomes.</p></article>
            <article class="example-card"><span>Engineering</span><strong>Frontend Engineer</strong><p>Technical skills, shipped features, and leadership scope.</p></article>
            <article class="example-card"><span>Operations</span><strong>Program Manager</strong><p>Roadmaps, stakeholder influence, and delivery metrics.</p></article>
          </div>
        </div>
      </section>
    </main>

    <div class="modal-backdrop" id="jobModal" hidden>
      <section class="job-modal" role="dialog" aria-modal="true" aria-labelledby="jobModalTitle">
        <button class="close-btn" id="closeJobModalBtn" type="button" aria-label="Close">×</button>
        <div class="modal-left">
          <span class="large-target">◎</span>
          <h2 id="jobModalTitle">Add a new job</h2>
          <p>Paste a job link to add to your job tracker.</p>
          <label>Job posting URL <input id="jobUrlInput" type="url" placeholder="https://www.example.com/jobs/123" /></label>
          <div class="modal-actions">
            <button class="secondary-action" id="manualJobBtn" type="button">Enter Manually</button>
            <button class="primary-action" id="addJobFromUrlBtn" type="button" disabled>Add Job</button>
          </div>
          <p class="ai-status" id="aiStatus" aria-live="polite"></p>
        </div>
        <div class="modal-right">
          <div class="chrome-card">●</div>
          <h3>Save jobs in under 1 second</h3>
          <p>Stop the copy-paste nightmare. Save jobs instantly from LinkedIn, Indeed, and more directly into your job tracker.</p>
          <button class="chrome-btn" type="button">● Add to Chrome - Free</button>
        </div>
      </section>
    </div>

    <div class="modal-backdrop" id="resumeModal" hidden>
      <section class="resume-modal" role="dialog" aria-modal="true" aria-labelledby="resumeModalTitle">
        <button class="close-btn" id="closeResumeModalBtn" type="button" aria-label="Close">×</button>
        <h2 id="resumeModalTitle">Select an Existing Resume</h2>
        <p>Choose the resume you used or will use to apply for this job.</p>
        <div class="resume-choice" id="resumeChoiceBtn" role="button" tabindex="0">
          <div class="resume-thumbnail">PX PO<br /><span>EXPERIENCE</span><br /><span>EDUCATION</span></div>
          <strong>My Resume</strong>
        </div>
        <button class="choose-resume-btn" id="chooseResumeBtn" type="button" disabled>Choose Resume</button>
      </section>
    </div>

    <template id="experienceTemplate">
      <div class="edit-card" data-kind="experience">
        <div class="card-title-row">
          <strong>Experience item</strong>
          <button class="remove-btn" type="button">Remove</button>
        </div>
        <div class="field-grid">
          <label>Company <input data-field="company" type="text" /></label>
          <label>Title <input data-field="title" type="text" /></label>
          <label>Start <input data-field="start" type="text" /></label>
          <label>End <input data-field="end" type="text" /></label>
        </div>
        <label>Impact bullets <textarea data-field="bullets" rows="4"></textarea></label>
      </div>
    </template>

    <template id="educationTemplate">
      <div class="edit-card" data-kind="education">
        <div class="card-title-row">
          <strong>Education item</strong>
          <button class="remove-btn" type="button">Remove</button>
        </div>
        <div class="field-grid">
          <label>School <input data-field="school" type="text" /></label>
          <label>Degree <input data-field="degree" type="text" /></label>
          <label>Dates <input data-field="dates" type="text" /></label>
          <label>Location <input data-field="location" type="text" /></label>
        </div>
      </div>
    </template>
  </div>
</template>
