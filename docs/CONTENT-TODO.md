# Content TODO

Facts that could not be verified against an official source. Generated from the `todo` fields in
`packages/content` by `pnpm --filter @tve/content todo` — edit the content files, not this file.

## countries.json

- TODO(verify): Final country lists taken from the Royal Gazette notices of 31 August 2026 as reported by TAT, MFA and embassy pages; the consular.mfa.go.th summary is an image, so cross-check the 60-country 30-day list against it.
- TODO(verify): Myanmar (MM) 14-day bilateral exemption applies only at international airports.
- TODO(verify): Taiwan (TW), Hong Kong (HK), Macao (MO), Kosovo (XK) and Palestine (PS) are territories/partially recognised; confirm the site's country picker handles them. Kosovo lost exemption on 15 September 2026.
- TODO(verify): Vatican City (VA) and Palestine (PS) are not on any published list; marked visa-required.
- TODO(verify): Rules for diplomatic/official passports and for holders of bilateral-agreement passports differ; this file covers ordinary passports only.

## visas/dtv

- TODO(verify): Local-currency fees vary by embassy (GBP 300 London, USD 400 Washington, EUR 350 Helsinki); confirm the 10,000 THB base fee on an official MFA fee schedule.
- TODO(verify): Whether Thai massage and wellness/spa courses are on the official list of qualifying soft-power activities, or accepted case by case by embassies.
- TODO(verify): Bank-statement period for the 500,000 THB funds differs by embassy (Washington: 3 months; others only an ending balance).
- TODO(verify): Fee and exact procedure for the 180-day in-country extension (assumed standard 1,900 THB TM.7 extension).
- TODO(verify): Validity window for the police clearance certificate differs by embassy (6 months London, 3 months Washington).

## visas/ltr

- TODO(verify): minFundsTHB 1,320,000 is the lowest income threshold (USD 40,000 a year, for Work-from-Thailand or Highly Skilled applicants with a master's degree or higher) converted at an approximate 33 THB per USD. Update if the rate moves significantly.
- TODO(verify): The January 2025 Cabinet amendment was reported to extend dependants to parents with no limit on numbers; ltr.boi.go.th still says a maximum of 4 dependants (spouse and children under 20).
- TODO(verify): Visa fee paid at embassies abroad or via e-Visa is the local equivalent and may differ from 50,000 THB.
- TODO(verify): Income period: ltr.boi.go.th says 'average personal income in the past two years'; some secondary sources describe a shorter period after the 2025 amendments.

## visas/non-b-business

- TODO(verify): The 4 Thai employees per foreigner ratio, 2 million THB paid-up capital and minimum salary table come from Immigration Bureau Order 327/2557 (English translation only; immigration.go.th returned 403). Confirm the order has not been replaced.
- TODO(verify): Processing times differ by embassy; no single official figure was found.
- TODO(verify): Grace period to leave or change status after a work permit is cancelled (text says 'a short period'); no official figure found.

## visas/non-ed

- TODO(verify): Funds requirement varies by embassy (the Tokyo MFA sheet asks for 30,000 THB held for 3 months); minFundsTHB left null.
- TODO(verify): Fee 2,000 THB single entry / 5,000 THB multiple entry is from embassy pages; confirm on the e-Visa fee table for your country.
- TODO(verify): Extension rules (90 days per extension, maximum 1 year in total for non-formal schools such as language and Muay Thai schools) come from an English translation of Immigration Bureau Order 327/2557.
- TODO(verify): Whether an in-country change of status to ED is accepted (text says it is discretionary and differs by office).
- TODO(verify): The 2025-2026 enforcement campaign against ED visa misuse (monthly school reports, revocations) is reported by secondary sources only.

## visas/non-o-family

- TODO(verify): the 400,000 THB seasoning period for a marriage extension (Samut Prakan lists 2 months before applying) and whether any balance must be kept after approval.
- TODO(verify): home visits and the 30-day "under consideration" stamp for marriage extensions. Practice varies by office.
- TODO(verify): the same 400,000 THB / 40,000 THB rule for an extension to support a Thai child.
- TODO(verify): feeTHB 2,000 is the Thai fee schedule for a single-entry Non-Immigrant visa; embassies charge the equivalent in local currency and some issue multiple-entry Non-O visas.

## visas/non-o-retirement

- TODO(verify): seasoning of the 800,000 THB for a retirement extension. The widely applied rule is 2 months before the first extension and 3 months before each later one, then 400,000 THB kept at all times; Samut Prakan Immigration lists 3 months. Confirm against the current Immigration Bureau order.
- TODO(verify): whether each embassy still issues income letters for the 65,000 THB route, and what immigration offices accept instead (e.g. 12 months of transfers from abroad).
- TODO(verify): how early before the current permission ends an office accepts a retirement extension application (commonly up to 30 days).
- TODO(verify): feeTHB 2,000 is the Thai fee schedule for a single-entry Non-Immigrant visa; embassies charge the equivalent in local currency and some offer a multiple-entry version.

## visas/non-oa

- TODO(verify): insurance amounts differ between sources. The e-Visa site asks for at least USD 100,000 / 3,000,000 THB; some consulates (e.g. Chicago) still list 40,000 THB outpatient / 400,000 THB inpatient. Confirm the current figure.
- TODO(verify): insurance rule for in-country extensions of an O-A stay (TGIA lists 40,000 THB outpatient / 400,000 THB inpatient from a Thai insurer).
- TODO(verify): whether the police certificate and medical certificate must be notarised/legalised at every embassy, and the passport validity rule (the older MFA page says 18 months).
- TODO(verify): whether the O-A allows the savings/income combination route at every embassy (MFA page says yes; e-Visa list mentions only savings or income).

## visas/smart

- TODO(verify): Minimum health insurance cover for SMART S is not stated in Announcement Por 5/2568 ('coverage for the entire period of stay').
- TODO(verify): Length of each renewal (extensionDays) and total maximum period for SMART S are not stated in the 2025 announcement; the older FAQ mentions 6-month, 1-year and 2-year options.
- TODO(verify): What happens to existing SMART T, I and E holders when their visa expires (assumed to keep their status until expiry, then move to the LTR).
- TODO(verify): Fee of 10,000 THB per year of permission is from the SMART FAQ and management page; embassy fees abroad may differ.

## visas/thailand-privilege

- TODO(verify): Bronze (650,000 THB, 5 years) is still listed on thailandprivilege.co.th, but agents report applications close on 30 September 2026. feeTHB and minFundsTHB use Gold (900,000 THB, 5 years) as the entry tier from 1 October 2026. Recheck after that date.
- TODO(verify): Next Member (family) prices: the official site advertises a 750,000 THB promotion; standard prices reported as 1,000,000 / 1,500,000 / 2,000,000 THB for Platinum / Diamond / Reserve. Confirm current terms and end date.
- TODO(verify): Background-check processing time (reported as 1 to 3 months) is not stated on the official site.
- TODO(verify): Stay per entry of 1 year is from Thailand Privilege pages; confirm how it is stamped at immigration.

## visas/tourist-tr

- TODO(verify): The 1,000 THB (single) and 5,000 THB (METV) base fees are charged in local currency and differ by embassy (e.g. USD 40 / USD 200 in Washington, NOK 400 / NOK 2,000 in Oslo, GBP 30 in London). Confirm the THB base amounts on an official MFA fee schedule.
- TODO(verify): Which embassies currently offer the METV through the e-Visa system; availability varies by mission.
- TODO(verify): Bank-statement period differs by embassy (Washington asks for 3 months; others ask only for a current balance).

## visas/visa-exemption

- TODO(verify): Land-border limit. TAT and the Royal Gazette summary say visa-exempt entries through land borders are limited to two per calendar year (not for Malaysia, Brunei, Indonesia, Singapore); the Royal Thai Embassy London wording says 'only twice within a calendar year' without mentioning land borders. Confirm whether air entries count.
- TODO(verify): Whether the 30-day extension (1,900 THB) also applies to the 15-day exemption for Mauritius and Seychelles and to bilateral-agreement stays.
- TODO(verify): Minimum funds on arrival. Immigration may ask for 20,000 THB per person / 40,000 THB per family; no fixed figure published for the 2026 scheme, so minFundsTHB is null.
- TODO(verify): Whether Urgent Work Permit notifications are still possible after visa-exempt entry (Fragomen says yes; other advisers say pending Department of Employment clarification).

## visas/visa-on-arrival

- TODO(verify): Length and fee of a VoA extension under the 2026 rules. Historically immigration allowed up to 7 extra days for 1,900 THB at the officer's discretion; extensionDays is null until confirmed.
- TODO(verify): Current list of designated VoA checkpoints (airports and land borders) under the 2026 notification.
- TODO(verify): Whether the VoA land-border / frequency limits apply to Azerbaijan, Belarus and Serbia nationals.

## guides/90-day-reporting

- TODO(verify): the exact filing window for online reports on tm47.immigration.go.th (commonly 15 days before to 7 days after the due date) and whether a first report must be made in person.
- TODO(verify): LTR holders report once a year instead of every 90 days.

## guides/digital-nomad-cities

- TODO(verify): tax residency threshold wording: the Revenue Code (Section 41) says 180 days or more in a calendar year; the Revenue Department English page says 'more than 180 days'. Confirm with a Thai tax adviser.
- TODO(verify): status of Revenue Department Instructions Por. 161/2566 and Por. 162/2566 (still in force as of September 2026 per law-firm reports; a proposed remittance exemption window was not law). Re-check every quarter.
- TODO(verify): cost-of-living ranges per city are editorial estimates, not official figures; re-check yearly.
- TODO(verify): LTR Work-from-Thailand Professional thresholds (USD 80,000 average income over 2 years, or USD 40,000 with a master's degree) and employer criteria after the 2025 BOI revisions.
- TODO(verify): LTR visa fee of 50,000 THB and the foreign-income tax exemption for the Work-from-Thailand Professional category (confirm on ltr.boi.go.th).

## guides/e-visa-walkthrough

- TODO(verify): processing time and the earliest/latest application window differ by embassy (Vienna: opens 90 days before arrival, decision within 30 working days; Islamabad: about 14 working days). Re-check the example figures before each review.
- TODO(verify): whether a printed e-Visa is still required at check-in varies by embassy (the Islamabad notice says printed copy only). Confirm whether a general rule exists.

## guides/muay-thai-visa-guide

- TODO(verify): DTV fee of 10,000 THB and its local-currency equivalent per embassy (official DTV page did not render when checked).
- TODO(verify): DTV changes from 31 August 2026 (proof of permanent residence in the country where you apply; criminal record certificate) are reported by several law firms; confirm on an embassy or thaievisa.go.th page.
- TODO(verify): whether the 30-day visa exemption (tourism purposes, from 15 September 2026) can still be extended by 30 days at immigration, and whether short-term Muay Thai training counts as tourism.
- TODO(verify): camp prices (drop-in, weekly, monthly) and ED-visa school fees are editorial market ranges, not official figures; re-check yearly.
- TODO(verify): the Non-Immigrant ED fee of about 2,000 THB single entry (USD 80 in Washington) varies by embassy.
- TODO(verify): extension-of-stay fee of 1,900 THB (bangkok.immigration.go.th fee page returned 403 when checked; figure from embassy/secondary sources).
- TODO(verify): Tourist Visa (TR) stay of 60 days with one 30-day extension; confirm it is unchanged after the September 2026 reforms.

## guides/overstay-penalties

- TODO(verify): the Washington embassy page (updated 2023) says overstays of a few hours may be waived at the officer's discretion. Confirm this is still current practice.

## guides/re-entry-permit

- TODO(verify): which international airports currently run a re-entry permit counter before departure passport control, and their hours.
- TODO(verify): whether a multiple-entry DTV holder who has extended their stay needs a re-entry permit to keep the extension.

## guides/tdac

- TODO(verify): whether a TDAC can be submitted on the day of arrival itself (the official notice says information must be submitted "3 days in advance of their arrival date").
- TODO(verify): whether long-term residents re-entering with an extension and re-entry permit must submit a TDAC every time (the official notice says all foreigners).

## guides/tm30

- TODO(verify): TM30 fine amounts. Samut Prakan Immigration says house owners face a fine of up to 2,000 THB and hotel managers 4,000 to 8,000 THB; offices commonly charge less for a first late report.
- TODO(verify): whether a new TM30 is required after domestic trips (practice varies by office) versus only after returning from abroad.

## guides/visa-extension

- TODO(verify): 30-day extension for visa-exempt entries after the 15 September 2026 change to a 30-day exemption (reported by news sources citing the Royal Gazette; confirm with the Immigration Bureau).
- TODO(verify): whether visa-on-arrival stays can be extended, and by how long.
- TODO(verify): the 30-day extension for Tourist (TR) visa holders under Immigration Bureau Order 327/2557.

## pages/faq

- TODO(verify): land-border entry cap under the visa exemption (reported as 2 per calendar year, with exceptions for some neighbouring countries) and whether a 30-day extension of an exemption stay is still available after 15 September 2026.
- TODO(verify): extension-of-stay fee of 1,900 THB (bangkok.immigration.go.th fee page returned 403 when checked; figure from embassy/secondary sources).
- TODO(verify): overstay fine of 500 THB per day up to 20,000 THB and the re-entry ban tiers for longer overstays.
- TODO(verify): Tourist Visa 60 days + 30-day extension and DTV extension of up to 180 days per entry.

## pages/privacy

- TODO(verify): fill in the actual analytics provider (Plausible or Umami), hosting provider and image CDN once chosen, and whether the Formspree contact form is enabled.
- TODO(verify): confirm the operator's legal name and address for the data-controller section.

## pages/terms

- TODO(verify): governing law and operator identity for the terms (currently left general).

