# Job Triangle – Job Application Tracker

A simple, lightweight web application to track and manage job applications in one place.

## 📌 About the Project

During my job search, I applied for multiple job opportunities through platforms like LinkedIn, Naukri, Indeed, and company career pages.

As the number of applications increased, I faced a common problem: I couldn't remember which companies I had applied to, which roles I had applied for, or the details of previous applications.

Sometimes, when recruiters called me regarding an application, I struggled to remember the exact job role and company details.

To solve this problem, I built **Job Triangle**, a personal job application tracking tool that helps me record every application, monitor its progress, and quickly retrieve application details whenever needed.

The main goal of this project is functionality: keeping my job search organized and making application tracking easier.

## ✨ Features

- **Add Applications:** Record company name, job role, job category, application date, source, and current status.
- **Track Application Status:** Monitor applications across five stages:
  - Applied
  - Screening
  - Interview
  - Offer
  - Closed
- **Edit Applications:** Update previously saved application details.
- **Delete Applications:** Remove applications that are no longer needed.
- **Add Notes:** Store recruiter details, job links, follow-up information, and other important notes.
- **Search Applications:** Quickly find applications using company names, job roles, categories, sources, or notes.
- **Filter Applications:** View applications based on their current status.
- **Sort Applications:** Organize records by newest, oldest, status, or company name.
- **Dashboard Overview:** View total applications, screening progress, interviews, offers, and application pipeline statistics.
- **CSV Export:** Export application records as a CSV file for backup and future reference.
- **Automatic Local Storage:** Application data is automatically saved in the browser.
- **Cross-Tab Synchronization:** Refresh application records when changes are made in another browser tab.

## 🛠️ Tech Stack

- HTML5 – Application structure
- CSS3 – Styling and responsive layout
- JavaScript – Application logic and data management
- Browser LocalStorage – Persistent data storage
- CSV – Application data export

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### 2. Navigate to the Project Directory

```bash
cd YOUR-REPOSITORY
```

### 3. Run the Application

Open `index.html` in your browser.

No backend server, database, or additional dependencies are required.

## 📂 Project Structure

```text
Job-Triangle/
│
├── index.html       # Application structure
├── style.css        # Styling and responsive design
├── script.js        # Application functionality
└── README.md        # Project documentation
```

## 💾 Data Storage

Job Triangle uses the browser's **LocalStorage API** to save application records.

- Data is automatically saved whenever an application is added, edited, deleted, or updated.
- Saved records remain available after refreshing the page.
- Data is stored locally in the browser on the current device.
- CSV export allows users to maintain an external backup.

**Important:** This application does not currently use cloud storage or a backend database. Browser data is not automatically synchronized across different devices or browsers. Clearing browser storage may permanently remove saved records, so exporting regular backups is recommended.

## 🎯 Project Objective

The objective of Job Triangle is to make job searching more organized by providing a simple way to:

- Remember every job application.
- Identify which company and role you applied for.
- Keep track of recruiter communication.
- Monitor interview and application progress.
- Avoid confusion when recruiters contact you.
- Maintain a clear record of your job search journey.

## 🚀 Future Improvements

- Cloud-based database integration.
- User authentication and secure accounts.
- Application follow-up reminders.
- Interview date and schedule tracking.
- Recruiter contact management.
- Job description and application link storage.
- Multi-device data synchronization.

## 👨‍💻 Author

**Syed Ibrahim**

B.Sc Computer Science Graduate | Aspiring AWS Cloud Engineer

- GitHub: [https://github.com/syedibrahimdev20-bot](https://github.com/syedibrahimdev20-bot)
- LinkedIn: [https://www.linkedin.com/in/syed-ibrahim-dev](https://www.linkedin.com/in/syed-ibrahim-dev)

---

**Job Triangle – Apply. Track. Follow Up.**

*A simple tool built to solve a real problem during my job search.*
