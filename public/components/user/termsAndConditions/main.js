import Logo from '/icons/logo.svg';
import styles from './component.module.css';

export default function Main(root){
    root.innerHTML = `
        <div class="${styles["container"]}">
            <img src="${Logo}" class="${styles["logo"]}">
            <h1 class="${styles["title"]}">Terms and Conditions</h1>
            <div class="${styles["content"]}">
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing or using the S.M.I.L.E  system, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms, you are not authorized to access or use the System.</p>
                
                <h2>2. License Grant</h2>
                <p>Subject to these Terms, the System grants Users a limited, non-exclusive, non-transferable, and revocable license to access and use the System solely for lawful educational, campus-related, and authorized purposes. This license does not convey any ownership, title, or intellectual property rights in the System.</p>
                
                <h2>3. User Obligations and Responsibilities</h2>
                <pUsers shall maintain the confidentiality of any credentials, access codes, or account information provided by the System.<br><br>

                Users are fully responsible for all activities conducted under their accounts.<br><br>

                Users must immediately notify the System administrators of any unauthorized access or suspected security breach.<br><br>

                Users shall comply with all operational requirements, including but not limited to the lawful exchange of plastic bottles for System access, and shall not circumvent or attempt to bypass such requirements.</p>
                
                <h2>4. Privacy, Data Collection, and Monitoring</h2>
                <p>The System collects personal information solely for the purpose of authentication, authorization, service provision, and operational monitoring.<br><br>

                Users acknowledge and agree that their browsing activity, including visited websites, access times, and network usage, may be monitored and logged for the purpose of ensuring fair usage, system security, and compliance with these Terms.<br><br>

                Collected data will be handled in accordance with applicable privacy laws and will not be shared with third parties except as required by law, legal process, or operational necessity.</p>
                
                <h2>5. Acceptable Use and Prohibited Conduct Users shall:</h2>
                <p>Use the System solely for lawful purposes;<br><br>

                Refrain from attempting to gain unauthorized access to any part of the System;<br><br>

                Not interfere with the operation, performance, or security of the System;<br><br>

                Not engage in illegal, fraudulent, or unauthorized activities;<br><br>

                Not transmit viruses, malware, or other harmful code;<br><br>

                Comply with all applicable laws, regulations, and institutional policies.</p>
                
                <h2>6. Limitations of Liability</h2>
                <p>The System is provided on an “as-is” and “as-available” basis.<br><br>

                The System administrators and affiliated entities shall not be liable for any direct, indirect, incidental, consequential, or punitive damages, including but not limited to loss of data, interruption of service, or economic loss arising from the use or inability to use the System.<br><br>

                Users acknowledge that internet speed, connectivity, and availability may vary, and the System makes no warranty regarding uninterrupted or error-free service.</p>
                
                <h2>7. Rate Limiting and System Controls</h2>
                <p>The System may implement usage limitations, including but not limited to rate limiting or temporary suspension, to ensure equitable access.<br><br>

                Excessive, abusive, or unauthorized use may result in immediate restriction or termination of access without prior notice.</p>
                
                <h2>9. Modifications</h2>
                <p>The System reserves the right to revise, amend, or modify these Terms at any time. Continued use of the System following any such modifications constitutes acceptance of the revised Terms.</p>

                <h2>10. Governing Law and Dispute Resolution</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes arising out of or relating to these Terms or the use of the System shall be subject to the exclusive jurisdiction of the courts located within the Pandi, Bulacan, Philippines.</p>

                <h2>11. Contact Information</h2>
                <p>For inquiries, complaints, or reports regarding these Terms or the System, Users may contact the S.M.I.L.E System administrators.</p>
            </div>
            <div class="${styles["actions"]}">
                <button class="${styles["back-button"]}" id="back-button">Back to Portal</button>
            </div>
        </div>
    `;

    root.className = styles["main"];
}
