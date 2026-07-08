// EmailJS Configuration
// TODO: Replace 'YOUR_TEMPLATE_ID' with your actual EmailJS Template ID
const EMAILJS_CONFIG = {
  publicKey: '0MLhnyQeRI1-Dx1CF',
  serviceId: 'service_d7ajzly',
  templateId: 'template_cgiqpvr'  // <-- Replace this after creating template in EmailJS dashboard
};

// Initialize EmailJS
(function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }
})();

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
  }
  
  // Determine form type based on form ID
  const formType = form.id === 'pediatrForm' ? 'Анкета для педиатра' : 
                   form.id === 'nevrologForm' ? 'Анкета для невролога' : 'Анкета';
  
  // Build comprehensive message from all form fields
  let messageParts = [];
  
  if (form.id === 'pediatrForm') {
    // Pediatrician form fields
    if (data.birthWeight) messageParts.push('Вес при рождении: ' + data.birthWeight + ' кг');
    if (data.currentWeight) messageParts.push('Текущий вес: ' + data.currentWeight + ' кг');
    if (data.height) messageParts.push('Рост: ' + data.height + ' см');
    if (data.feedingType) {
      const feedingMap = {breast: 'Грудное', formula: 'Искусственное', mixed: 'Смешанное'};
      messageParts.push('Тип вскармливания: ' + (feedingMap[data.feedingType] || data.feedingType));
    }
    if (data.allergies) messageParts.push('Аллергии: ' + data.allergies);
    if (data.diseases) messageParts.push('Перенесенные заболевания: ' + data.diseases);
    if (data.vaccines) {
      const vaccinesMap = {yes: 'Да, все', no: 'Нет', partial: 'Частично'};
      messageParts.push('Прививки: ' + (vaccinesMap[data.vaccines] || data.vaccines));
    }
    if (data.currentComplaints) messageParts.push('Текущие жалобы: ' + data.currentComplaints);
  } else if (form.id === 'nevrologForm') {
    // Neurologist form fields
    if (data.complaints) messageParts.push('Жалобы: ' + data.complaints);
    if (data.pregnancy) {
      const pregnancyMap = {normal: 'Нормально', complicated: 'С осложнениями'};
      messageParts.push('Беременность: ' + (pregnancyMap[data.pregnancy] || data.pregnancy));
    }
    if (data.birthComplications) {
      const bcMap = {no: 'Нет', yes: 'Да'};
      messageParts.push('Осложнения при родах: ' + (bcMap[data.birthComplications] || data.birthComplications));
      if (data.birthDetails) messageParts.push('Детали родов: ' + data.birthDetails);
    }
    if (data.holdHead) messageParts.push('Держал голову: ' + data.holdHead);
    if (data.sitAge) messageParts.push('Начал сидеть: ' + data.sitAge);
    if (data.crawlAge) messageParts.push('Начал ползать: ' + data.crawlAge);
    if (data.walkAge) messageParts.push('Начал ходить: ' + data.walkAge);
    if (data.firstWords) messageParts.push('Первые слова: ' + data.firstWords);
    if (data.seizures) messageParts.push('Судороги: ' + (data.seizures === 'yes' ? 'Да' : 'Нет'));
    if (data.headTrauma) messageParts.push('Травмы головы: ' + (data.headTrauma === 'yes' ? 'Да' : 'Нет'));
    if (data.medications) {
      messageParts.push('Прием лекарств: ' + (data.medications === 'yes' ? 'Да' : 'Нет'));
      if (data.medsDetails) messageParts.push('Лекарства: ' + data.medsDetails);
    }
    if (data.heredity) messageParts.push('Наследственность: ' + data.heredity);
    if (data.extraInfo) messageParts.push('Дополнительная информация: ' + data.extraInfo);
  }
  
  const message = messageParts.join('\n');

  // Prepare template parameters - ALL fields from both forms
  const templateParams = {
    type: formType,
    // Basic info (both forms)
    childName: data.childName || '',
    childAge: data.childAge || '',
    birthDate: data.birthDate || '',
    phone: data.phone || '',
    email: data.email || '',
    // Single message field with all data (for backward compatibility with template)
    сообщение: message,
    message: message,
    
    // Individual fields for future template updates
    birthWeight: data.birthWeight || '',
    currentWeight: data.currentWeight || '',
    height: data.height || '',
    feedingType: data.feedingType || '',
    allergies: data.allergies || '',
    diseases: data.diseases || '',
    vaccines: data.vaccines || '',
    currentComplaints: data.currentComplaints || '',
    complaints: data.complaints || '',
    pregnancy: data.pregnancy || '',
    birthComplications: data.birthComplications || '',
    birthDetails: data.birthDetails || '',
    holdHead: data.holdHead || '',
    sitAge: data.sitAge || '',
    crawlAge: data.crawlAge || '',
    walkAge: data.walkAge || '',
    firstWords: data.firstWords || '',
    seizures: data.seizures || '',
    headTrauma: data.headTrauma || '',
    medications: data.medications || '',
    medsDetails: data.medsDetails || '',
    heredity: data.heredity || '',
    extraInfo: data.extraInfo || ''
  };
  
  // Send via EmailJS
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID') {
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
      .then(function(response) {
        console.log('Email sent:', response);
        showFormSuccess(form);
      }, function(error) {
        console.error('Email error:', error);
        showFormError(form, 'Ошибка отправки. Пожалуйста, попробуйте позже или позвоните нам.');
      })
      .finally(function() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
  } else {
    // Fallback: show data for testing
    console.log('EmailJS not configured or template ID not set. Form data:', templateParams);
    showFormSuccess(form);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }
}

function showFormSuccess(form) {
  // Create success message
  const successDiv = document.createElement('div');
  successDiv.className = 'form-success-message';
  successDiv.innerHTML = '<i class="fas fa-check-circle"></i> <strong>Анкета успешно отправлена!</strong><br>Мы свяжемся с вами для подтверждения записи.';
  successDiv.style.cssText = 'background: linear-gradient(135deg, #d4edda, #c3e6cb); color: #155724; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; font-size: 16px;';
  
  form.insertBefore(successDiv, form.firstChild);
  form.reset();
  
  // Scroll to success message
  successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Remove after 5 seconds
  setTimeout(() => {
    if (successDiv.parentNode) successDiv.parentNode.removeChild(successDiv);
  }, 5000);
}

function showFormError(form, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error-message';
  errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> <strong>Ошибка:</strong> ' + message;
  errorDiv.style.cssText = 'background: linear-gradient(135deg, #f8d7da, #f5c6cb); color: #721c24; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; font-size: 16px;';
  
  form.insertBefore(errorDiv, form.firstChild);
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  setTimeout(() => {
    if (errorDiv.parentNode) errorDiv.parentNode.removeChild(errorDiv);
  }, 5000);
}
