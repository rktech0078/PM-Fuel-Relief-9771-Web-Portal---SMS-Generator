# ⛽ PM Fuel Relief 9771 Web Portal & SMS Generator

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A modern, fast, and user-friendly web portal and automated SMS generator designed to assist citizens in registering for the **Pakistan Prime Minister Fuel Relief Scheme (Rs. 100/liter subsidy)** via shortcode **9771**. Built with authentic Urdu typography (**Jameel Noori Nastaleeq**), mobile-first responsive layout, and zero-error SMS formatting.

---

## 🚀 Key Features

- **📱 Smart 9771 SMS Generator**: Automatically formats registration messages into the exact official structure:
  ```text
  REG <CNIC_13_DIGITS> <VEHICLE_NO> <PROVINCE_CODE> <DDMMYYYY>
  ```
  *(Example: `REG 4210112345671 LEA1234 P 02092026`)*
- **⚡ One-Tap SMS App Launcher**: Directly opens native messaging apps on iOS (`sms:9771&body=...`) and Android (`sms:9771?body=...`) with recipient `9771` and pre-typed message.
- **📅 Foolproof Date Input System**:
  - 3-dropdown selector (Day, Month, Year) to eliminate `mm/dd/yyyy` confusion.
  - Manual 8-digit typing option (`DDMMYYYY`).
  - Native calendar selector with LTR normalization.
- **🧮 Accurate Fuel Subsidy Calculator**:
  - **Motorcycles**: Monthly quota capped at **20 Liters** (Rs. 2,000 savings/month).
  - **Rickshaws / 3-Wheelers**: Monthly quota capped at **20 Liters** (Rs. 2,000 savings/month).
  - **Cars up to 800cc**: Monthly quota capped at **30 Liters** (Rs. 3,000 savings/month).
- **📲 Progressive Web App (PWA) & App Downloader**:
  - Standalone mobile installation support with `⛽` icon.
  - Native Chrome/Safari install prompts and downloadable offline web app launcher.
- **🖨️ Printable Registration Slip**: Instant summary card generation for personal record keeping.
- **🔍 Full SEO & Rich Search Engine Optimization**:
  - OpenGraph & Twitter Cards.
  - JSON-LD Structured Data Schema (`WebApplication`).
  - Automated `sitemap.xml` and `robots.txt`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS
- **Typography**: Jameel Noori Nastaleeq (`@font-face`) & Google Font Noto Nastaliq Urdu
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📦 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pm-fuel-relief-web.git
   cd pm-fuel-relief-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment on Vercel

The application is fully optimized for single-click deployment on Vercel:

1. Push your repository to GitHub.
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Set your project name (Recommended free domains):
   - `fuelrelief9771.vercel.app`
   - `pmfuelrelief9771.vercel.app`
   - `pm-fuel-relief.vercel.app`
4. Deploy! 🚀

---

## ⚠️ Legal Disclaimer

> **Non-Governmental Public Facilitation Tool**: This portal is an independent, non-governmental public service tool built solely to assist citizens in correctly structuring SMS messages for shortcode `9771`. This project is **not affiliated with, endorsed by, or connected to the Government of Pakistan, NADRA, NITB, or any official entity**. No user data is stored on any server or database.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
