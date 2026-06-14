# The Vault

## Overview

`The Vault` serves as a specialized, premium resource repository containing deeply practical frameworks, implementation paths, and technical documentation related to GRC standards, frameworks and domains.

It acts as a more technical, advanced counterpart to the standard educational or marketing blog, specifically designed to give high-growth businesses actionable blueprints to close their trust gaps and achieve rapid certification.

## Intent

Users who visit the blog are expected to be at the `consideration` or `decision` stage of the buyer journey.

**For example**, it is highly unlikely that someone would accidently search for content on how to implement `ISO 27001 Annex A 8.28 Secure Coding`.

Some who has landed on this page have intent:

- `What is...`
- `How do I implement...`
- `How to avoid...`
- `What does an auditor look for...`

The goal is to capture this traffic and use our conversion engine to convert visits to revenue.

## Scope

The initial scope of the Vault includes:

- **GRC**
  - **GRC Fundamentals**: Build a modern GRC program
  - **Compliance**: Achieve continuous compliance
  - **Risk management**: Identity and mitigate risk
  - **TPRM**: Reduce third party risk
  - **GRC Engineering**: Automate GRC at scale
- **Cyber Resilience**
  - **ISO 27001**: Build your security management system
  - **SOC 2**: Build a secure framework that accelerates trust
  - **DORA**: Master operational resilience
  - **NIS2**: Secure critical infrastructure
  - **Cyber Essentials**: Establish a secure baseline
- **AI Governance**
  - **EU AI Act**: Navigate european AI law
  - **ISO 42001**: Establish an AI management system
  - **NIST AI RMF**: Identify and mitigate AI risk
  - **AIUC-1**: Govern AI agents
  - **MITRE ATLAS**: Defend against AI threats
- **Free Tools**: A landing page advertising free tools with external links
- **Templates**: Repository of freemium templates
- **GRC Glossary**: Glossary of GRC terminology.

## Structure

- The **Vault** will have the URL path `/vault` and have a landing page that frames what's inside
- Each **Framework** will have the URL path `/vault/{framework}` (e.g. `/vault/iso-27001). Each framework will have a landing page that frames whats inside and takes the visitor on a guided journey.
- **Articles** in each Vault will have the path `/vault/{framework}/{article-slug}`
- Each **Article** will include a link to the parent page (e.g. `/vault/iso-27001)`)
- Each **Framework** will have a `ReferenceGuide` component at the bottom that provides a stylised list of related articles specific to that framework. This will serve both internal linking within the **Framework** Vault and help build topical authority.
- **IMPORTANT**: It should be assumed that IF someone is navigating a specific vault (e.g. ISO 27001) then they have medium/high intent related to that framework. They either want to learn, build or implement. We should not direct them outside the vault. We should channel them to a conversion action (e.g. book a call, download a lead magnet, join the community).
- Comparison content (e.g. ISO 27001 vs SOC 2) is **not** vault content, this will be published as a **Blog Artice** under `/blog/{article-slug}`.
