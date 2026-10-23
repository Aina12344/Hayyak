/*
 * auth.js - Register (register.html) and Log in (login.html) with validation.
 *
 * NOTE: this release has no database yet, so accounts are kept in the browser
 * (localStorage, key "hayyak.users"). When the PHP / SQL tier is added, replace
 * findUser() and saveUser() with requests to the server; the validation stays the same.
 */
(function () {
  "use strict";

  /* ---------- Page texts ---------- */
  Hayyak.addText({
    ar: {
      reg_title: "إنشاء حساب", reg_sub: "سجّل لتقيّم المواقع وتحفظها في زياراتي القادمة.",
      log_title: "تسجيل الدخول", log_sub: "أهلًا بعودتك إلى حيّاك.",
      side_title: "اكتشف تراث المملكة", side_sub: "كل المواقع التراثية في مكان واحد.",
      f_name: "الاسم الكامل", f_email: "البريد الإلكتروني", f_pass: "كلمة المرور", f_pass2: "تأكيد كلمة المرور",
      ph_name: "مثال: سارة محمد", ph_email: "name@example.com", ph_pass: "••••••••",
      rule_len: "8 أحرف على الأقل", rule_upper: "حرف إنجليزي كبير", rule_lower: "حرف إنجليزي صغير", rule_num: "رقم واحد على الأقل", rule_special: "رمز خاص مثل \u2066! @ # $\u2069",
      btn_register: "إنشاء الحساب", btn_login: "دخول",
      have_acc: "عندك حساب؟", no_acc: "ما عندك حساب؟",
      show_pass: "إظهار كلمة المرور", hide_pass: "إخفاء كلمة المرور",
      e_name_req: "الرجاء إدخال الاسم الكامل.",
      e_name_fmt: "الاسم يجب أن يكون من 3 إلى 50 حرفًا، حروف ومسافات فقط.",
      e_email_req: "الرجاء إدخال البريد الإلكتروني.",
      e_email_fmt: "صيغة البريد الإلكتروني غير صحيحة.",
      e_email_used: "هذا البريد مسجّل مسبقًا. جرّب تسجيل الدخول.",
      e_pass_req: "الرجاء إدخال كلمة المرور.",
      e_pass_weak: "كلمة المرور لا تحقق الشروط أدناه.",
      e_pass2_req: "الرجاء تأكيد كلمة المرور.",
      e_pass2_match: "كلمتا المرور غير متطابقتين.",
      e_login: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      ok_register: "تم إنشاء حسابك بنجاح! جاري تحويلك…",
      ok_login: "تم تسجيل الدخول! جاري تحويلك…"
    },
    en: {
      reg_title: "Create an account", reg_sub: "Sign up to review sites and save them to My Upcoming Visits.",
      log_title: "Log in", log_sub: "Welcome back to Hayyak.",
      side_title: "Discover the Kingdom's heritage", side_sub: "Every heritage site in one place.",
      f_name: "Full name", f_email: "Email", f_pass: "Password", f_pass2: "Confirm password",
      ph_name: "e.g. Sara Mohammed", ph_email: "name@example.com", ph_pass: "••••••••",
      rule_len: "At least 8 characters", rule_upper: "One uppercase letter", rule_lower: "One lowercase letter", rule_num: "At least one number", rule_special: "A special character like ! @ # $",
      btn_register: "Create account", btn_login: "Log in",
      have_acc: "Already have an account?", no_acc: "Don't have an account?",
      show_pass: "Show password", hide_pass: "Hide password",
      e_name_req: "Please enter your full name.",
      e_name_fmt: "Name must be 3 to 50 characters, letters and spaces only.",
      e_email_req: "Please enter your email.",
      e_email_fmt: "Please enter a valid email address.",
      e_email_used: "This email is already registered. Try logging in.",
      e_pass_req: "Please enter your password.",
      e_pass_weak: "Password does not meet the rules below.",
      e_pass2_req: "Please confirm your password.",
      e_pass2_match: "Passwords do not match.",
      e_login: "Incorrect email or password.",
      ok_register: "Your account has been created! Redirecting…",
      ok_login: "Logged in! Redirecting…"
    }
  });

  /* ---------- Accounts (temporary, until the database is ready) ---------- */
  const USERS_KEY = "hayyak.users";
  /* Admin accounts are created by the system, not through the Register page */
  const ADMINS = [{ fullName: "Hayyak Admin", email: "admin@hayyak.sa", password: "Admin@2026", role: "admin" }];

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; }
  }
  function findUser(email) {
    email = email.toLowerCase();
    return ADMINS.concat(loadUsers()).filter(function (u) { return u.email.toLowerCase() === email; })[0] || null;
  }
  function saveUser(user) {
    const users = loadUsers();
    users.push(user);
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); return true; } catch (e) { return false; }
  }

  /* ---------- Validation rules ---------- */
  const NAME_RE = /^[A-Za-z؀-ۿ\s]{3,50}$/;           // Arabic / English letters and spaces
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  const PASS_RULES = {
    len: function (p) { return p.length >= 8; },
    upper: function (p) { return /[A-Z]/.test(p); },
    lower: function (p) { return /[a-z]/.test(p); },
    num: function (p) { return /[0-9]/.test(p); },
    special: function (p) { return /[^A-Za-z0-9\s]/.test(p); }   // any symbol, e.g. ! @ # $ % & *
  };

  function checkName(v) {
    v = v.trim().replace(/\s+/g, " ");
    if (!v) return "e_name_req";
    if (!NAME_RE.test(v)) return "e_name_fmt";
    return "";
  }
  function checkEmail(v, mustBeNew) {
    v = v.trim();
    if (!v) return "e_email_req";
    if (!EMAIL_RE.test(v)) return "e_email_fmt";
    if (mustBeNew && findUser(v)) return "e_email_used";
    return "";
  }
  function checkPassword(v) {
    if (!v) return "e_pass_req";
    const ok = Object.keys(PASS_RULES).every(function (k) { return PASS_RULES[k](v); });
    return ok ? "" : "e_pass_weak";
  }
  function checkConfirm(v, pass) {
    if (!v) return "e_pass2_req";
    if (v !== pass) return "e_pass2_match";
    return "";
  }

  /* ---------- Showing errors next to each field ---------- */
  function showError(input, key) {
    const box = input.closest(".auth-field");
    const msg = box.querySelector(".error");
    box.classList.toggle("invalid", !!key);
    box.classList.toggle("valid", !key && input.value !== "");
    input.setAttribute("aria-invalid", key ? "true" : "false");
    msg.setAttribute("data-key", key || "");
    msg.textContent = key ? Hayyak.t(key) : "";
    return !key;
  }
  function showAlert(form, key, type) {
    const a = form.querySelector(".form-alert");
    a.className = "form-alert " + (type || "");
    a.setAttribute("data-key", key || "");
    a.textContent = key ? Hayyak.t(key) : "";
    a.hidden = !key;
  }
  /* re-translate messages that are on screen when the language changes */
  document.addEventListener("hayyak:lang", function () {
    document.querySelectorAll(".error[data-key], .form-alert[data-key]").forEach(function (el) {
      const k = el.getAttribute("data-key");
      el.textContent = k ? Hayyak.t(k) : "";
    });
    document.querySelectorAll(".pass-toggle").forEach(updateToggleLabel);
  });

  /* ---------- Show / hide password buttons ---------- */
  function updateToggleLabel(btn) {
    const input = document.getElementById(btn.getAttribute("aria-controls"));
    const shown = input.type === "text";
    btn.innerHTML = Hayyak.icon(shown ? "eyeOff" : "eye");
    btn.setAttribute("aria-label", Hayyak.t(shown ? "hide_pass" : "show_pass"));
  }
  document.querySelectorAll(".pass-toggle").forEach(function (btn) {
    updateToggleLabel(btn);
    btn.addEventListener("click", function () {
      const input = document.getElementById(btn.getAttribute("aria-controls"));
      input.type = input.type === "password" ? "text" : "password";
      updateToggleLabel(btn);
    });
  });

  function goAfterLogin(form, key) {
    showAlert(form, key, "success");
    form.querySelector("button[type=submit]").disabled = true;
    setTimeout(function () { window.location.href = "index.html"; }, 1200);
  }

  /* ---------- Register page ---------- */
  const reg = document.getElementById("register-form");
  if (reg) {
    const name = reg.elements.fullName, email = reg.elements.email,
          pass = reg.elements.password, pass2 = reg.elements.confirm;
    let submitted = false;   // errors appear live only after the first try

    function updateRules() {
      Object.keys(PASS_RULES).forEach(function (k) {
        const li = reg.querySelector('[data-rule="' + k + '"]');
        li.classList.toggle("ok", PASS_RULES[k](pass.value));
      });
    }
    pass.addEventListener("input", updateRules);

    [[name, function () { return checkName(name.value); }],
     [email, function () { return checkEmail(email.value, true); }],
     [pass, function () { return checkPassword(pass.value); }],
     [pass2, function () { return checkConfirm(pass2.value, pass.value); }]
    ].forEach(function (pair) {
      pair[0].addEventListener("blur", function () { if (pair[0].value) showError(pair[0], pair[1]()); });
      pair[0].addEventListener("input", function () {
        if (submitted || pair[0].closest(".auth-field").classList.contains("invalid")) showError(pair[0], pair[1]());
        if (pair[0] === pass && pass2.value) showError(pass2, checkConfirm(pass2.value, pass.value));
      });
    });

    reg.addEventListener("submit", function (e) {
      e.preventDefault();
      submitted = true;
      showAlert(reg, "");
      const ok = [
        showError(name, checkName(name.value)),
        showError(email, checkEmail(email.value, true)),
        showError(pass, checkPassword(pass.value)),
        showError(pass2, checkConfirm(pass2.value, pass.value))
      ].every(Boolean);
      if (!ok) { reg.querySelector(".invalid input").focus(); return; }

      const user = {
        fullName: name.value.trim().replace(/\s+/g, " "),
        email: email.value.trim().toLowerCase(),
        password: pass.value,
        role: "tourist"
      };
      saveUser(user);
      Hayyak.login({ name: user.fullName.split(" ")[0], email: user.email, role: user.role });
      goAfterLogin(reg, "ok_register");
    });
  }

  /* ---------- Log in page ---------- */
  const log = document.getElementById("login-form");
  if (log) {
    const email = log.elements.email, pass = log.elements.password;
    [email, pass].forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.closest(".auth-field").classList.contains("invalid")) {
          showError(input, input === email ? checkEmail(email.value) : (pass.value ? "" : "e_pass_req"));
        }
        showAlert(log, "");
      });
    });

    log.addEventListener("submit", function (e) {
      e.preventDefault();
      showAlert(log, "");
      const ok = [
        showError(email, checkEmail(email.value)),
        showError(pass, pass.value ? "" : "e_pass_req")
      ].every(Boolean);
      if (!ok) { log.querySelector(".invalid input").focus(); return; }

      const user = findUser(email.value.trim());
      if (!user || user.password !== pass.value) {
        showAlert(log, "e_login", "error");   // same message for both cases, so emails can't be guessed
        pass.value = "";
        pass.focus();
        return;
      }
      Hayyak.login({ name: user.fullName.split(" ")[0], email: user.email, role: user.role });
      goAfterLogin(log, "ok_login");
    });
  }
})();
