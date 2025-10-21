(() => {
  // Helpers
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));
  const debounce = (fn, wait = 300) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const MIN_NAME = 2;
  const MIN_SUBJECT = 3;
  const MIN_MESSAGE = 10;

  // Elements
  const form = qs('#contact-form');
  const nameInput = qs('#full-name');
  const emailInput = qs('#email');
  const subjectInput = qs('#subject');
  const messageInput = qs('#message');
  const submitBtn = qs('[data-testid="test-contact-submit"]');
  const successMessage = qs('#success-message');

  const errorName = qs('#name-error');
  const errorEmail = qs('#email-error');
  const errorSubject = qs('#subject-error');
  const errorMessage = qs('#message-error');

  const state = {
    name: false,
    email: false,
    subject: false,
    message: false,
  };

  // Validation functions
  function setError(inputEl, errorEl, message) {
    inputEl.classList.add('error');
    inputEl.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
  }

  function setValid(inputEl, errorEl) {
    inputEl.classList.remove('error');
    inputEl.removeAttribute('aria-invalid');
    errorEl.textContent = '';
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (!value) {
      state.name = false;
      setError(nameInput, errorName, 'Your name is required.');
      return false;
    }
    if (value.length < MIN_NAME) {
      state.name = false;
      setError(nameInput, errorName, `Name must be at least ${MIN_NAME} characters.`);
      return false;
    }
    state.name = true;
    setValid(nameInput, errorName);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      state.email = false;
      setError(emailInput, errorEmail, 'Email is required.');
      return false;
    }
    if (!emailRegex.test(value)) {
      state.email = false;
      setError(emailInput, errorEmail, 'Please enter a valid email address.');
      return false;
    }
    state.email = true;
    setValid(emailInput, errorEmail);
    return true;
  }

  function validateSubject() {
    const value = subjectInput.value.trim();
    if (!value) {
      state.subject = false;
      setError(subjectInput, errorSubject, 'Subject is required.');
      return false;
    }
    if (value.length < MIN_SUBJECT) {
      state.subject = false;
      setError(subjectInput, errorSubject, `Subject must be at least ${MIN_SUBJECT} characters.`);
      return false;
    }
    state.subject = true;
    setValid(subjectInput, errorSubject);
    return true;
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (!value) {
      state.message = false;
      setError(messageInput, errorMessage, 'Message cannot be empty.');
      return false;
    }
    if (value.length < MIN_MESSAGE) {
      state.message = false;
      setError(messageInput, errorMessage, `Message must be at least ${MIN_MESSAGE} characters.`);
      return false;
    }
    state.message = true;
    setValid(messageInput, errorMessage);
    return true;
  }

  function validateAll() {
    const a = validateName();
    const b = validateEmail();
    const c = validateSubject();
    const d = validateMessage();
    return a && b && c && d;
  }

  // UI State functions
  function setButtonSending(isSending) {
    if (isSending) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending...`;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Send Message`;
    }
  }

  function showSuccess(text) {
    successMessage.textContent = text;
    successMessage.classList.add('show');
    successMessage.setAttribute('role', 'status');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showFailure(text) {
    successMessage.textContent = text;
    successMessage.classList.add('show');
    successMessage.style.backgroundColor = '#e74c3c';
    successMessage.setAttribute('role', 'alert');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearStatus() {
    successMessage.textContent = '';
    successMessage.classList.remove('show');
    successMessage.style.backgroundColor = '';
    successMessage.removeAttribute('role');
  }

  // Debounced input handlers
  const debouncedValidateName = debounce(validateName, 250);
  const debouncedValidateEmail = debounce(validateEmail, 250);
  const debouncedValidateSubject = debounce(validateSubject, 250);
  const debouncedValidateMessage = debounce(validateMessage, 250);

  nameInput.addEventListener('input', debouncedValidateName);
  emailInput.addEventListener('input', debouncedValidateEmail);
  subjectInput.addEventListener('input', debouncedValidateSubject);
  messageInput.addEventListener('input', debouncedValidateMessage);

  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  subjectInput.addEventListener('blur', validateSubject);
  messageInput.addEventListener('blur', validateMessage);

  // Submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearStatus();

    const ok = validateAll();
    if (!ok) {
      const firstInvalid = qsa('.error')[0];
      if (firstInvalid) firstInvalid.focus();
      showFailure('Please fix the highlighted fields and try again.');
      return;
    }

    setButtonSending(true);

    // Send form (simulated here with timeout).
    setTimeout(() => {
      showSuccess('✅ Message sent successfully! Thank you for reaching out.');
      form.reset();
      qsa('.error').forEach((el) => el.classList.remove('error'));
      setButtonSending(false);

      setTimeout(() => clearStatus(), 5000);
    }, 1000);
  });

  // Accessibility enhancements
  [nameInput, emailInput, subjectInput, messageInput].forEach((el) => {
    el.setAttribute('aria-required', 'true');
  });

  emailInput.addEventListener('invalid', (ev) => ev.preventDefault());
})();
