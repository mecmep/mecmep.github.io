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
const waller = document.getElementById('waller')

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
		else if (isOpen)
			this.setAttribute('aria-label', 'Закрыть меню навигации')
		else
			this.setAttribute('aria-label', 'Открыть меню навигации')
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
			else
				navToggleButton.setAttribute('aria-label', 'Открыть меню навигации')
			navToggleButton.focus()
		}
	})
}

function openModal(modalId) {
	const modal = document.getElementById(modalId)

	modalOverlay.classList.remove('hidden')
	closeModalButton.classList.remove('hidden')
	modal.classList.remove('hidden')
	setTimeout(() => {
		modal.classList.add('active')
	})
}
function openCallback() {
	openModal('callback')
}
headerCallbackButton.addEventListener('click', openCallback)
footerCallbackButton.addEventListener('click', openCallback)

function closeModal() {
	const modalsVisible = document.querySelectorAll('.modal:not(.hidden)')

	for (let i = 0, modal; i < modalsVisible.length; i++) {
		modal = modalsVisible[i]
		modal.classList.remove('active')
		modal.addEventListener('transitionend', function handler() {
			this.removeEventListener('transitionend', handler)
			modal.classList.add('hidden')
			closeModalButton.classList.add('hidden')
			modalOverlay.classList.add('hidden')
		})
	}
}
modalOverlay.addEventListener('click', closeModal)
closeModalButton.addEventListener('click', closeModal)

// Переключение превью полезной информации
for (let i = 0; i < infoButtons.length; i++) {
	infoButtons[i].addEventListener('click', function () {
		const infoButtonSelected = document.querySelector('#wallerselect button[aria-selected="true"]')
		const infoPromo = document.getElementById(this.getAttribute('aria-controls'))
		const infoPromoPrevious = document.querySelector('#waller .visible')

		infoButtonSelected.removeAttribute('aria-selected')
		this.setAttribute('aria-selected', true)
		infoPromoPrevious.classList.remove('visible')
		infoPromo.classList.add('visible')
		waller.scrollIntoView({behavior:'smooth'})
	})
}

// Валидация формы заказа обратного звонка
fio.setCustomValidity('Пожалуйста, заполните поле с именем')
tel.setCustomValidity('Пожалуйста, заполните поле с номером телефона')
fio.addEventListener('input', function () {
	if (fio.validity.valueMissing)
		fio.setCustomValidity('Пожалуйста, заполните поле с именем')
	else
		fio.setCustomValidity('')
})
tel.addEventListener('input', function () {
	const phoneNumber = this.value.replace(/[^0-9]/g,'')

	if (phoneNumber == '')
		this.value = ''
	else
		this.value = '+' + phoneNumber
	if (tel.validity.valueMissing)
		tel.setCustomValidity('Пожалуйста, заполните поле с номером телефона')
	else if (tel.validity.patternMismatch)
		tel.setCustomValidity('Номер телефона заполнен в неправильном формате')
	else
		tel.setCustomValidity('')
})
email.addEventListener('input', function () {
	if (email.validity.patternMismatch)
		email.setCustomValidity('Введён не адрес электронной почты')
	else
		email.setCustomValidity('')
})

function openModalResponse() {
	callback.classList.add('hidden')
	modalResponse.classList.remove('hidden')
}
function submitForm(event) {
	(async function () {
		event.preventDefault()

		const formData = new FormData(event.target)

		let data = {}
		for (let [key, value] of formData) {
			data[key] = value
		}

		try {
			const response = await fetch('ajax.php', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			})

			if (response.ok) {
				const json = await response.json()

				if (json.error)
					modalResponse.classList.add('error')
				else
					modalResponse.classList.remove('error')
				modalResponse.innerHTML = json.message
				openModalResponse()
			} else {
				throw new Error(`Ошибка HTTP! Статус: ${response.status}`)
			}
		} catch (error) {
			modalResponse.classList.add('error')
			modalResponse.innerHTML = 'При отправке запроса возникла ошибка (GitHub Pages не работает с PHP)'
			openModalResponse()
			console.error('Ошибка:', error)
		}
	})()
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
