const SS_ID = "13ocgfOgH-qLyfmQ1AWgd_oRpo3g0DuqnkNI-8RwoUpI";

function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    const action = p.action || "";
    let result;

    if (!action) result = { ok: true, message: "Exam API ready" };
    else if (action === "getExam") result = getExam(p);
    else if (action === "startAttempt") result = startAttempt(p);
    else if (action === "submitAttempt") {
      const b = Object.assign({}, p, {
        answers: p.answersJson ? JSON.parse(p.answersJson) : {},
        leaveCount: Number(p.leaveCount || 0)
      });
      result = submitAttempt(b);
    }
    else if (action === "logEvent") result = logEvent(p);
    else result = { ok: false, error: "Unknown action" };

    return output(result, p.callback);
  } catch (err) {
    const cb = e && e.parameter ? e.parameter.callback : "";
    return output({ ok: false, error: String(err) }, cb);
  }
}

function doPost(e) {
  try {
    const b = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    if (b.action === "createExam") return output(createExam(b));
    if (b.action === "getExam") return output(getExam(b));
    if (b.action === "startAttempt") return output(startAttempt(b));
    if (b.action === "submitAttempt") return output(submitAttempt(b));
    if (b.action === "logEvent") return output(logEvent(b));

    return output({ ok: false, error: "Unknown action" });
  } catch (err) {
    return output({ ok: false, error: String(err) });
  }
}

function output(obj, callback) {
  const text = JSON.stringify(obj);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + "(" + text + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(text)
    .setMimeType(ContentService.MimeType.JSON);
}

function getBook() {
  return SpreadsheetApp.openById(SS_ID);
}

function getSheet(name, headers) {
  const ss = getBook();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
  }
  return sh;
}

function newId(prefix) {
  return prefix + "_" +
    Utilities.getUuid().replace(/-/g, "").substring(0, 10).toUpperCase();
}

function createExam(b) {
  if (!b.title || !Array.isArray(b.questions) || !b.questions.length) {
    return { ok: false, error: "ข้อมูลข้อสอบไม่ครบ" };
  }

  let examId = String(b.examId || "").trim();
  if (!/^EX_[A-Z0-9]{10,20}$/.test(examId)) examId = newId("EX");

  const sh = getSheet("Exams", [
    "examId","title","duration","maxLeave","showScore",
    "oneAttempt","questionsJson","active","createdAt"
  ]);

  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === examId) {
      return { ok: true, examId: examId };
    }
  }

  sh.appendRow([
    examId,
    b.title,
    Number(b.duration || 50),
    Number(b.maxLeave || 3),
    b.showScore !== false,
    b.oneAttempt !== false,
    JSON.stringify(b.questions),
    true,
    new Date()
  ]);

  return { ok: true, examId: examId };
}

function findExam(examId) {
  const sh = getSheet("Exams", [
    "examId","title","duration","maxLeave","showScore",
    "oneAttempt","questionsJson","active","createdAt"
  ]);
  const data = sh.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(examId)) {
      return {
        examId: data[i][0],
        title: data[i][1],
        duration: Number(data[i][2]),
        maxLeave: Number(data[i][3]),
        showScore: String(data[i][4]).toLowerCase() === "true",
        oneAttempt: String(data[i][5]).toLowerCase() === "true",
        questions: JSON.parse(data[i][6] || "[]"),
        active: String(data[i][7]).toLowerCase() !== "false"
      };
    }
  }
  return null;
}

function getExam(b) {
  const exam = findExam(b.examId);
  if (!exam || !exam.active) return { ok: false, error: "ไม่พบข้อสอบ" };

  return {
    ok: true,
    exam: {
      examId: exam.examId,
      title: exam.title,
      duration: exam.duration,
      maxLeave: exam.maxLeave,
      questions: exam.questions.map(function(q) {
        return { q: q.q, choices: q.choices };
      })
    }
  };
}

function attemptsSheet() {
  return getSheet("Attempts", [
    "attemptId","examId","studentId","studentName","status",
    "startAt","endAt","score","total","leaves","reason","answersJson"
  ]);
}

function startAttempt(b) {
  const exam = findExam(b.examId);
  if (!exam) return { ok: false, error: "ไม่พบข้อสอบ" };

  if (!b.studentId || !b.studentName) {
    return { ok: false, error: "กรอกชื่อและรหัสนักเรียนให้ครบ" };
  }

  const sh = attemptsSheet();
  const data = sh.getDataRange().getValues();

  if (exam.oneAttempt) {
    for (let i = 1; i < data.length; i++) {
      if (
        String(data[i][1]) === String(b.examId) &&
        String(data[i][2]) === String(b.studentId)
      ) {
        return { ok: false, error: "รหัสนักเรียนนี้เข้าสอบชุดนี้แล้ว" };
      }
    }
  }

  const attemptId = newId("AT");
  const start = new Date();
  const end = new Date(start.getTime() + exam.duration * 60 * 1000);

  sh.appendRow([
    attemptId,b.examId,b.studentId,b.studentName,"STARTED",
    start,"","","",0,"",""
  ]);

  return {
    ok: true,
    attemptId: attemptId,
    startMs: start.getTime(),
    endMs: end.getTime()
  };
}

function findAttempt(attemptId) {
  const sh = attemptsSheet();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(attemptId)) {
      return { sheet: sh, row: i + 1, data: data[i] };
    }
  }
  return null;
}

function submitAttempt(b) {
  const attempt = findAttempt(b.attemptId);
  if (!attempt) return { ok: false, error: "ไม่พบข้อมูลการเข้าสอบ" };
  if (String(attempt.data[4]) === "SUBMITTED") {
    return { ok: false, error: "ส่งข้อสอบแล้ว" };
  }

  const exam = findExam(b.examId);
  if (!exam) return { ok: false, error: "ไม่พบข้อสอบ" };

  const answers = b.answers || {};
  let score = 0;

  exam.questions.forEach(function(q, i) {
    if (String(answers[i] || "") === String(q.answer || "")) score++;
  });

  attempt.sheet.getRange(attempt.row, 5, 1, 8).setValues([[
    "SUBMITTED",
    attempt.data[5],
    new Date(),
    score,
    exam.questions.length,
    Number(b.leaveCount || 0),
    b.reason || "",
    JSON.stringify(answers)
  ]]);

  return {
    ok: true,
    score: score,
    total: exam.questions.length,
    showScore: exam.showScore
  };
}

function logEvent(b) {
  const sh = getSheet("Events", [
    "timestamp","examId","attemptId","event","leaveCount"
  ]);

  sh.appendRow([
    new Date(),
    b.examId || "",
    b.attemptId || "",
    b.event || "",
    Number(b.leaveCount || 0)
  ]);

  return { ok: true };
}
