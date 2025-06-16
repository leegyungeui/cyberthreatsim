# CyberThreatSim-Pro Project Report

## Introduction
CyberThreatSim-Pro is an educational platform designed to simulate cybersecurity threats and provide hands-on experience in threat detection and response. This project was developed as a university assignment to demonstrate skills in web development, cybersecurity, and DevOps.

## Features
- **Authentication**: Secure login with 2FA using QR code-based TOTP.
- **Threat Simulation**: Simulates DDoS, Phishing, and SQL Injection attacks with randomized outcomes.
- **Log Analysis**: Basic SIEM functionality to analyze simulation logs.
- **Dashboard**: Interactive UI built with React and Tailwind CSS.
- **Security**: Implements CSRF protection, XSS mitigation (DOMPurify), and HttpOnly cookies.

## Technical Stack
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, Tailwind CSS, axios
- **Tools**: VSCode, Git, Docker, draw.io

## Implementation
The backend uses FastAPI for API endpoints, SQLAlchemy for database management, and SQLite for lightweight storage. The frontend is built with React for dynamic UI and Tailwind CSS for styling. Docker ensures consistent environments.

## Results
The platform successfully simulates cyber threats and provides a user-friendly interface for students to learn cybersecurity concepts. Key metrics:
- Total simulations: Varies by user
- Success rate: Randomized (50-70%)
- Logs: Stored and displayed in dashboard

## Live Demo
Available locally at http://localhost:3000

## Conclusion
CyberThreatSim-Pro demonstrates a practical application of cybersecurity principles in an educational context. Future improvements could include additional threat types and advanced SIEM features.

## Architecture Diagram
![Architecture](diagram.png)