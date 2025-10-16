# 🌟 HNG Stage 0 Task README

## 🧾 Short Project Description
This is my HNG Stage 0 Task, a simple, elegant profile card built using **HTML, CSS, and JavaScript**.  
It displays my basic information such as **name, avatar, bio, social links, hobbies, and dislikes**, while also dynamically showing the **current time in milliseconds** and updates it when the user clicks **“Check Time”** button.  

The layout is fully responsive and adjusts smoothly for **mobile, tablet, and desktop** screens.

------

## 🌐 Live Demo
🔗 **View the hosted project:**  
👉 [Profile card: Live Demo](https://edidayoung.github.io/HNG-Tasks/HNG-Stage-0/index.html)

------

## 💻 GitHub Repository
📁 **Project Repository:**  
👉 [GitHub Repo](https://github.com/edidayoung/HNG-Tasks)

------

## ⚙️ How to Run Locally
Follow these steps to test the project on your local system:

1. **Clone the repository**
   ```bash
   git clone https://github.com/edidayoung/HNG-Tasks.git

2. **Navigate to the project directory/folder**
  ```bash
   cd HNG-Tasks/HNG-Stage-0

3. **Open the Project**
   Simply open the [`index.html`](https://github.com/edidayoung/HNG-Tasks/tree/main/HNG-Stage-0) file in your preferred web browser.


## ✅ Acceptance Criteria (Checklist)
**The poject succesfully checks that:**

- All requirements for grading and automated testing have been met.
- All required elements exist and are discoverable by their given `data-testids`.
- HTML structure uses semantic tags (`article`, `figure`, `nav`, `section`, `headings`).
- The `test-user-time` value equals `Date.now()` (in milliseconds, with acceptable delta).
- Avatar includes an `alt` attribute and `data-testid="test-user-avatar"`.
- Social links are located inside `test-user-social-links` and are individually testable (e.g., `test-user-social-twitter`).
- Hobbies and dislikes are displayed as distinct lists, each with their own data test IDs `test-user-hobbies` and `test-user-dislikes`
- All links and buttons are keyboard accessible; **focus styles** are visible during navigation.
- Layout is fully responsive across typical breakpoints i.e mobile, tablet, and desktop.
- The “Check Time” button dynamically updates the current time in milliseconds.
- Profile card smoothly expands to fit additional content and resizes properly on smaller screens.

## 🧪 Tests/Notes

- JavaScript’s `Date.now()` is used to fetch the current timestamp dynamically.
- Verified across Chrome, Firefox, and Edge browsers.
- Time updates correctly on every click and stays within ±100ms of system time.
- Card layout tested for responsiveness at common screen widths: 320px, 768px, 1024px, 1440px.
- Keyboard focus indicators visible on all interactive elements.

## 🧰 Technologies Used
**Below are the technologies utilized:**

- HTML5: Semantic structure.
- CSS3 (Flexbox, Media Queries): Responsive styling and animations.
- JavaScript (ES6): Dynamic time updates and interactivity.
- GitHub Pages: Hosting and deployment.

## 👨‍💻 Author

**⚡Name:** Edidiong E. Ekaette
**🌍 GitHub:** @edidayoung
**📩 Email:** ekaetteedidiong0@gmail.com

## 🙏 Thank You

Thank you for checking out this project! 😊
Special appreciation to the [HNG Internship Team](https://hng.tech/internship) for providing this learning opportunity.
If you liked this project, feel free to ⭐ the repo or connect with me on [LinkedIn](https://www.linkedin.com/in/edidiong-ekaette)
 — I’d love to hear from you!