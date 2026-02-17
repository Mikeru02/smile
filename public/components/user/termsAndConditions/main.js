import Logo from '/icons/logo.svg';
import styles from './component.module.css';

export default function Main(root){
    root.innerHTML = `
        <div class="${styles["container"]}">
            <img src="${Logo}" class="${styles["logo"]}">
            <h1 class="${styles["title"]}">Terms and Conditions</h1>
            <div class="${styles["content"]}">
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using the S.M.I.L.E system, you accept and agree to be bound by the terms and provision of this agreement.</p>
                
                <h2>2. Use License</h2>
                <p>Permission is granted to temporarily use the S.M.I.L.E system for the purpose of educational activities and campus services. This is the grant of a license, not a transfer of title.</p>
                
                <h2>3. User Responsibilities</h2>
                <p>Users are responsible for maintaining the confidentiality of their credentials and for all activities that occur under their account. You agree to immediately notify the system administrators of any unauthorized use of your account.</p>
                
                <h2>4. Privacy</h2>
                <p>Your personal information is collected solely for the purpose of system authentication and service delivery. We are committed to protecting your privacy and will not share your information with third parties without your consent, except as required by law.</p>
                
                <h2>5. System Usage</h2>
                <p>The S.M.I.L.E system is provided for educational purposes only. Users must not attempt to compromise system security, interfere with system operations, or use the system for any illegal or unauthorized activities.</p>
                
                <h2>6. Limitations</h2>
                <p>In no event shall the system administrators be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising from the use or inability to use the S.M.I.L.E system.</p>
                
                <h2>7. Revisions</h2>
                <p>We reserve the right to revise these terms and conditions at any time. Continued use of the system after any such changes shall constitute your consent to such changes.</p>
                
                <h2>8. Contact Information</h2>
                <p>If you have any questions about these Terms and Conditions, please contact the system administrators at the campus IT department.</p>
            </div>
            <div class="${styles["actions"]}">
                <button class="${styles["back-button"]}" id="back-button">Back to Portal</button>
            </div>
        </div>
    `;

    root.className = styles["main"];
}
