# Conversion Engine

## 1. Context & Strategic Vision

The #1 goal of the rebrand and website restructure is the critical need to pivot from:

**Current State:** `SEO-first website focused on informational search intent`
**Target State:** `value-first website, optimised for conversion.`

**The consequence of us not achieving this goal:** I will need to shutdown the business and consider filing for bankrupcy.

## 2. Conversion Architecture

GRCMANA uses `Hubspot` as our CRM and conversion engine. Key principles:

- All landing pages will be hosted on Hubspot.
- All lead magnets and content offers will be hosted on Hubspot.
- Hubspot Forms will be integrated into the website to facilitate conversions.
- Hubspot Analytics will be integrated into the website to track visits, research signals and buyer intent.
- Bookings (e.g. Book a Discovery Call) will use Hubspot Meeting Scheduler (not Calendly or equivalent.)
- **Warm** email sequences to contacts who have consented to communication will be delivered via `Hubspot`.
- **Cold** email sequences to contacts where there is legitimate interest will be delivered via `Instantly`.
- Outbound LinkedIn sequences will be delivered via `HeyReach.`
- Contact enrichment will be performed by `Apollo.io` via enrichment pipelines configured in `n8n`.
