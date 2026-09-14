V51 — Exam management + safer guard

- Published exams: stop accepting / resume accepting / permanent delete.
- V51 Apps Script supports these management commands over GET/JSONP for reliable confirmation on iPad/iPhone.
- Online results: Hide a student from display only; restore one or all hidden rows. This does not delete Google Sheet data.
- Permanent deletion remains only in Published Exams and removes the exam, attempts, and events.
- Guard false-positive tuning: visibility hidden must persist 1.8 seconds before counting; blur/scroll/ordinary resize do not count; split screen remains a separate 4-second sustained check.

IMPORTANT: replace Apps Script Code.gs with Code.gs.txt and deploy a New version.
