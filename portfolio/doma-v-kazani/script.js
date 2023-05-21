const callback = document.getElementById('callback')
const callbackForm = document.getElementById('callbackform')
const closeModalButton = document.getElementById('closemodal')
const email = document.getElementById('email')
const fio = document.getElementById('fio')
const footerCallbackButton = document.getElementById('footercallbackbutton')
const headerCallbackButton = document.getElementById('headercallbackbutton')
const infoButtons = document.querySelectorAll('#wallerselect button')
const modalOverlay = document.getElementById('modaloverlay')
const modalResponse = document.getElementById('modalresponse')
const navs = document.querySelectorAll('nav')
const navToggleButtons = document.querySelectorAll('nav > button')
const subNavToggleButtons = document.querySelectorAll('nav > ul > li > button')
const tel = document.getElementById('tel')
const upButton = document.getElementById('up')
const wallerAnchor = document.getElementById('walleranchor')

// Раскрытие/скрытие навигационного меню по клику на кнопке
for (let i = 0; i < navToggleButtons.length; i++) {
	navToggleButtons[i].addEventListener('click', function () {
		const ariaControls = this.getAttribute('aria-controls')
		const isOpen = this.getAttribute('aria-expanded') === 'false'

		this.setAttribute('aria-expanded', isOpen)
		if (ariaControls === 'wallerselect' && isOpen)
			this.setAttribute('aria-label', 'Закрыть выбор полезной информации')
		else if (ariaControls === 'wallerselect')
			this.setAttribute('aria-label', 'Открыть выбор полезной информации')
		else if (isOpen) {
			document.documentElement.classList.add('headernavisopen')
			this.setAttribute('aria-label', 'Закрыть меню навигации')
		} else {
			this.setAttribute('aria-label', 'Открыть меню навигации')
			document.documentElement.classList.remove('headernavisopen')
		}
	})
}

// Поведение кнопок выпадающего меню
for (let i = 0; i < subNavToggleButtons.length; i++) {
	subNavToggleButtons[i].addEventListener('click', function () {
		if (this.classList.contains('closesubnav')) {
			this.classList.remove('closesubnav')
			this.setAttribute('aria-label', 'Открыть подменю')
		} else {
			this.classList.add('closesubnav')
			this.setAttribute('aria-label', 'Закрыть подменю')
		}
	})
}

// Скрытие навигационного меню по клавише Escape
for (let i = 0; i < navs.length; i++) {
	navs[i].addEventListener('keyup', function (e) {
		const navToggleButton = this.querySelector('nav > button')

		if (e.keyCode === 27) {
			navToggleButton.setAttribute('aria-expanded', false)
			if (navToggleButton.getAttribute('aria-controls') === 'wallerselect')
				navToggleButton.setAttribute('aria-label', 'Открыть выбор полезной информации')
			else {
				navToggleButton.setAttribute('aria-label', 'Открыть меню навигации')
				document.documentElement.classList.remove('headernavisopen')
			}
			navToggleButton.focus()
		}
	})
}

function openModal(modalId) {
	const modal = document.getElementById(modalId)
	const modalPrev = document.querySelector('.modal.active')

	// В зависимости от наличия открытого модального окна, разный порядок действий
	if (!modalPrev) {
		document.documentElement.classList.add('noscroll')
		modalOverlay.classList.remove('hidden')
		closeModalButton.classList.remove('hidden')
		modal.classList.remove('hidden')
		setTimeout(function () {
			modal.classList.add('active')
			document.addEventListener('keyup', closeModalByEscape)
		})
	} else {
		modalPrev.classList.add('hidden')
		modalPrev.classList.remove('active')
		modal.classList.remove('hidden')
		setTimeout(function () {
			modal.classList.add('active')
		})
	}
}
function openCallback() {
	openModal('callback')
}
headerCallbackButton.addEventListener('click', openCallback)
footerCallbackButton.addEventListener('click', openCallback)

function closeModal() {
	const modal = document.querySelector('.modal.active')

	document.removeEventListener('keyup', closeModalByEscape)
	modal.addEventListener('transitionend', function handler() {
		this.removeEventListener('transitionend', handler)
		this.classList.add('hidden')
		closeModalButton.classList.add('hidden')
		modalOverlay.classList.add('hidden')
		document.documentElement.classList.remove('noscroll')
	})
	modal.classList.remove('active')
}
modalOverlay.addEventListener('click', closeModal)
closeModalButton.addEventListener('click', closeModal)

function closeModalByEscape(event) {
	if (event.keyCode === 27)
		closeModal()
}

// Переключение превью полезной информации
for (let i = 0; i < infoButtons.length; i++) {
	infoButtons[i].addEventListener('click', function () {
		const infoButtonSelected = document.querySelector('#wallerselect button[aria-selected="true"]')
		const infoPromo = document.getElementById(this.getAttribute('aria-controls'))
		const infoPromoPrevious = document.querySelector('#waller > div:not([hidden])')

		infoButtonSelected.setAttribute('aria-selected', false)
		this.setAttribute('aria-selected', true)
		infoPromoPrevious.hidden = true
		infoPromo.hidden = false
		wallerAnchor.scrollIntoView({behavior:'smooth'})
	})
}

// Валидация формы заказа обратного звонка
fio.setCustomValidity('Пожалуйста, заполните поле с именем')
tel.setCustomValidity('Пожалуйста, заполните поле с номером телефона')
fio.addEventListener('input', function () {
	if (this.validity.valueMissing)
		this.setCustomValidity('Пожалуйста, заполните поле с именем')
	else
		this.setCustomValidity('')
})
tel.addEventListener('input', function () {
	const phoneNumber = this.value.replace(/[^0-9]/g,'')

	if (phoneNumber == '')
		this.value = ''
	else
		this.value = '+' + phoneNumber
	if (this.validity.valueMissing)
		this.setCustomValidity('Пожалуйста, заполните поле с номером телефона')
	else if (this.validity.patternMismatch)
		this.setCustomValidity('Номер телефона заполнен в неправильном формате')
	else
		this.setCustomValidity('')
})
email.addEventListener('input', function () {
	if (this.validity.patternMismatch)
		this.setCustomValidity('Введён не адрес электронной почты')
	else
		this.setCustomValidity('')
})

function submitForm(event) {
	event.preventDefault()

	modalResponse.classList.add('error')
	modalResponse.innerHTML = 'При отправке запроса возникла ошибка (GitHub Pages не работает с PHP)'

	openModal('modalresponse')
}
callbackForm.addEventListener('submit', submitForm)

// Отображение/скрытие кнопки прокрутки страницы вверх при прокрутке экрана на высоту видимой области окна
let scrollTicking = false
window.onscroll = function () {
	if (document.documentElement.scrollTop > document.documentElement.clientHeight) {
		if (!scrollTicking) {
			scrollTicking = true
			// Обработчик события добавлен на случай быстрой прокрутки страницы вниз, когда кнопка не завершила процесс своего скрытия при прокрутке страницы вверх
			upButton.addEventListener('transitionend', function showUpButton() {
				this.removeEventListener('transitionend', showUpButton)
				this.classList.remove('hidden')
			})
			upButton.classList.remove('hidden')
			setTimeout(function () {
				upButton.classList.add('active')
			})
		}
	} else {
		if (scrollTicking) {
			scrollTicking = false
			upButton.addEventListener('transitionend', function hideUpButton() {
				this.removeEventListener('transitionend', hideUpButton)
				this.classList.add('hidden')
			})
			upButton.classList.remove('active')
		}
	}
}

let scrollToTopTimer
function scrollToTop() {
	const scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop)

	if (scrollTop > 0)
		window.scrollBy(0, -30)
	else
		clearInterval(scrollToTopTimer)
}
upButton.addEventListener('click', function () {
	scrollToTopTimer = setInterval(scrollToTop, 5)
})
