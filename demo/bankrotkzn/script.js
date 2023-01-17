const adviceButton = document.getElementById('advicebutton')
const callbackFio = document.getElementById('callbackfio')
const callbackForm = document.getElementById('callbackform')
const callbackPhone = document.getElementById('callbackphone')
const closeModalButton = document.getElementById('closemodal')
const footerCallbackButton = document.getElementById('footercallbackbutton')
const headerCallbackButton = document.getElementById('headercallbackbutton')
const headerNavAnchors = document.querySelectorAll('#headernavlist a')
const modalOverlay = document.getElementById('modaloverlay')
const modalResponse = document.getElementById('modalresponse')
const nextReviewButton = document.getElementById('nextreview')
const prevReviewButton = document.getElementById('prevreview')
const requestButton = document.getElementById('requestbutton')
const requestFio = document.getElementById('requestfio')
const requestForm = document.getElementById('requestform')
const requestPhone = document.getElementById('requestphone')
const reviews = document.querySelectorAll('#reviewslist > li')
const reviewsButtons = document.querySelectorAll('#reviewslist button')
const reviewsControls = document.getElementById('reviewscontrols')
const reviewsModal = document.getElementById('reviewsmodal')
const solutions = document.getElementById('solutions')
const upButton = document.getElementById('up')
const warranty = document.getElementById('warranty')
const warrantyCallbackButton = document.getElementById('warrantycallbackbutton')
const whyNot = document.getElementById('whynot')

document.addEventListener('DOMContentLoaded', () => {
	solutions.classList.remove('man')
	warranty.classList.remove('woman')
})

headerNavAnchors.forEach(e => {
	e.addEventListener('click', () => {
		const scrollToId = e.getAttribute('href').replace('#', '')

		event.preventDefault()
		document.getElementById(scrollToId).scrollIntoView({behavior:'smooth'})
	})
})

// Отображение/скрытие кнопки прокрутки страницы вверх при прокрутке экрана на высоту видимой области окна
let scrollTicking = false
window.onscroll = () => {
	if (document.documentElement.scrollTop > document.documentElement.clientHeight) {
		if (!scrollTicking) {
			scrollTicking = true
			// Обработчик события добавлен на случай быстрой прокрутки страницы вниз, когда кнопка не завершила процесс своего скрытия при прокрутке страницы вверх
			upButton.addEventListener('transitionend', function showUpButton() {
				this.removeEventListener('transitionend', showUpButton)
				this.hidden = false
			})
			upButton.hidden = false
			setTimeout(() => {
				upButton.classList.add('active')
			})
		}
	} else {
		if (scrollTicking) {
			scrollTicking = false
			upButton.addEventListener('transitionend', function hideUpButton() {
				this.removeEventListener('transitionend', hideUpButton)
				this.hidden = true
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
upButton.addEventListener('click', () => {
	scrollToTopTimer = setInterval(scrollToTop, 5)
})

function openModal(modalId) {
	const modal = document.getElementById(modalId)

	document.documentElement.classList.add('noscroll')
	modalOverlay.hidden = false
	closeModalButton.hidden = false
	modal.hidden = false
	setTimeout(() => {
		modal.classList.add('active')
	})
}
function openCallback() {
	openModal('callback')
	callbackFio.focus()
}
function openWhyNot() {
	openModal('whynot')
}
function openRequestModal() {
	whyNot.hidden = true
	whyNot.classList.remove('active')
	openModal('requestmodal')
	requestFio.focus()
}
headerCallbackButton.addEventListener('click', openCallback)
requestButton.addEventListener('click', openWhyNot)
warrantyCallbackButton.addEventListener('click', openCallback)
footerCallbackButton.addEventListener('click', openCallback)
adviceButton.addEventListener('click', openRequestModal)

function closeModal() {
	const modalVisible = document.querySelector('.modal:not([hidden])')

	modalVisible.addEventListener('transitionend', function handler() {
		this.removeEventListener('transitionend', handler)
		this.hidden = true
		closeModalButton.hidden = true
		modalOverlay.hidden = true
		document.documentElement.classList.remove('noscroll')
	})
	modalVisible.classList.remove('active')

	// Запуск остановленной при увеличении отзыва карусели отзывов
	if (modalVisible === reviewsModal)
		reviewsCarouselTimer = setInterval(reviewsCarousel, 15000)
}
modalOverlay.addEventListener('click', closeModal)
closeModalButton.addEventListener('click', closeModal)

// Валидация формы заказа обратного звонка
function fioListener(inputElement) {
	if (inputElement.validity.valueMissing)
		inputElement.setCustomValidity('Пожалуйста, заполните поле с именем')
	else
		inputElement.setCustomValidity('')
}
function phoneListener(inputElement) {
	const phoneNumber = inputElement.value.replace(/[^0-9]/g,'')

	if (phoneNumber == '')
		inputElement.value = ''
	else
		inputElement.value = '+' + phoneNumber
	if (inputElement.validity.valueMissing)
		inputElement.setCustomValidity('Пожалуйста, заполните поле с номером телефона')
	else if (inputElement.validity.patternMismatch)
		inputElement.setCustomValidity('Номер телефона заполнен в неправильном формате')
	else
		inputElement.setCustomValidity('')
}
callbackFio.setCustomValidity('Пожалуйста, заполните поле с именем')
callbackPhone.setCustomValidity('Пожалуйста, заполните поле с номером телефона')
requestFio.setCustomValidity('Пожалуйста, заполните поле с именем')
requestPhone.setCustomValidity('Пожалуйста, заполните поле с номером телефона')
callbackFio.addEventListener('input', () => {fioListener(callbackFio)})
callbackPhone.addEventListener('input', () => {phoneListener(callbackPhone)})
requestFio.addEventListener('input', () => {fioListener(requestFio)})
requestPhone.addEventListener('input', () => {phoneListener(requestPhone)})

function openModalResponse() {
	const modalVisible = document.querySelector('.modal:not([hidden])')

	modalVisible.hidden = true
	modalVisible.classList.remove('active')
	openModal('modalresponse')
}
function submitForm(event) {
	(async () => {
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
requestForm.addEventListener('submit', submitForm)

// Плавное появление мужчины и женщины при прокрутке страницы
let documentHeight,
	solutionsBottom,
	warrantyBottom
window.addEventListener('scroll', () => {
	documentHeight = document.documentElement.clientHeight
	solutionsBottom = solutions.getBoundingClientRect().top + solutions.getBoundingClientRect().height
	warrantyBottom = warranty.getBoundingClientRect().top + warranty.getBoundingClientRect().height

	if (solutionsBottom - documentHeight < 150)
		solutions.classList.add('man')
	if (warrantyBottom - documentHeight < 150)
		warranty.classList.add('woman')
})

let animationIsActive = false,
	nextReviewButtonFocused = false,
	nextReviewButtonFocusedClone, // вспомогательная переменная, необходимая из-за потери фокуса кнопки при её деактивации во время движения карусели
	prevReviewButtonFocused = false,
	prevReviewButtonFocusedClone // аналогично смотри выше
function reviewsCarousel() {
	for (let i1 = 0, next1 = 1, next2 = 2, next3 = 3, next4 = 4; i1 < reviews.length; i1++, next1++, next2++, next3++, next4++) {
		if (reviews[i1].classList.contains('active1')) {
			if (next1 === reviews.length)
				next1 = 0
			if (next2 >= reviews.length)
				next2 -= reviews.length
			if (next3 >= reviews.length)
				next3 -= reviews.length
			if (next4 >= reviews.length)
				next4 -= reviews.length

			// Удаление устаревших настроек слайда после завершения анимации
			reviews[i1].addEventListener('transitionend', function hideReview() {
				this.removeEventListener('transitionend', hideReview)
				animationIsActive = false
				this.classList.remove('active0')
				nextReviewButton.disabled = false
				prevReviewButton.disabled = false
				if (nextReviewButtonFocusedClone)
					nextReviewButton.focus({preventScroll: true})
				if (prevReviewButtonFocusedClone)
					prevReviewButton.focus({preventScroll: true})
				reviewsControls.classList.remove('nextdisabled')
				reviewsControls.classList.remove('prevdisabled')
			})

			// Подготовка карусели перед использованием анимации
			if (nextReviewButtonFocused)
				reviewsControls.classList.add('prevdisabled')
			else if (prevReviewButtonFocused)
				reviewsControls.classList.add('nextdisabled')
			else {
				reviewsControls.classList.add('nextdisabled')
				reviewsControls.classList.add('prevdisabled')
			}
			nextReviewButtonFocusedClone = nextReviewButtonFocused
			prevReviewButtonFocusedClone = prevReviewButtonFocused
			nextReviewButton.disabled = true
			prevReviewButton.disabled = true
			reviews[next1].classList.add('visible')
			reviews[next2].classList.add('visible')
			reviews[next3].classList.add('visible')
			reviews[next4].classList.add('visible')

			// Анимирование карусели
			setTimeout(() => {
				animationIsActive = true
				reviews[i1].classList.add('active0')
				reviews[i1].classList.remove('active1')
				reviews[next1].classList.add('active1')
				reviews[next1].classList.remove('active2')
				reviews[next1].classList.remove('visible')
				reviews[next2].classList.add('active2')
				reviews[next2].classList.remove('active3')
				reviews[next2].classList.remove('visible')
				reviews[next3].classList.add('active3')
				reviews[next3].classList.remove('active4')
				reviews[next3].classList.remove('visible')
				reviews[next4].classList.add('active4')
				reviews[next4].classList.remove('visible')
			}, 5)

			break
		}
	}
}
let reviewsCarouselTimer = setInterval(reviewsCarousel, 15000)

nextReviewButton.addEventListener('blur', () => {
	nextReviewButtonFocused = false
})
nextReviewButton.addEventListener('click', () => {
	reviewsCarousel()
	clearInterval(reviewsCarouselTimer)
	reviewsCarouselTimer = setInterval(reviewsCarousel, 15000)
})
nextReviewButton.addEventListener('focus', () => {
	nextReviewButtonFocused = true
	prevReviewButtonFocused = false
})

function reviewsCarouselBack() {
	for (let i4 = reviews.length - 1, prev1 = i4 - 4, prev2 = i4 - 3, prev3 = i4 - 2, prev4 = i4 - 1; i4 > -1; i4--, prev1--, prev2--, prev3--, prev4--) {
		if (reviews[i4].classList.contains('active4')) {
			if (prev1 < 0)
				prev1 += reviews.length
			if (prev2 < 0)
				prev2 += reviews.length
			if (prev3 < 0)
				prev3 += reviews.length
			if (prev4 === -1)
				prev4 += reviews.length

			// Удаление устаревших настроек слайда после завершения анимации
			reviews[prev1].addEventListener('transitionend', function hideReview() {
				this.removeEventListener('transitionend', hideReview)
				animationIsActive = false
				reviews[i4].classList.remove('visible')
				reviews[prev4].classList.remove('visible')
				reviews[prev3].classList.remove('visible')
				reviews[prev2].classList.remove('visible')
				nextReviewButton.disabled = false
				prevReviewButton.disabled = false
				if (prevReviewButtonFocusedClone)
					prevReviewButton.focus({preventScroll: true})
				reviewsControls.classList.remove('nextdisabled')
			})

			// Подготовка карусели перед использованием анимации
			reviewsControls.classList.add('nextdisabled')
			prevReviewButtonFocusedClone = true
			nextReviewButton.disabled = true
			prevReviewButton.disabled = true
			reviews[prev1].classList.add('active0')
			reviews[prev2].classList.add('visible')
			reviews[prev3].classList.add('visible')
			reviews[prev4].classList.add('visible')
			reviews[i4].classList.add('visible')

			// Анимирование карусели
			setTimeout(() => {
				animationIsActive = true
				reviews[i4].classList.remove('active4')
				reviews[prev4].classList.add('active4')
				reviews[prev4].classList.remove('active3')
				reviews[prev3].classList.add('active3')
				reviews[prev3].classList.remove('active2')
				reviews[prev2].classList.add('active2')
				reviews[prev2].classList.remove('active1')
				reviews[prev1].classList.add('active1')
				reviews[prev1].classList.remove('active0')
			}, 5)

			break
		}
	}
}
prevReviewButton.addEventListener('blur', () => {
	prevReviewButtonFocused = false
})
prevReviewButton.addEventListener('click', () => {
	reviewsCarouselBack()
	clearInterval(reviewsCarouselTimer)
	reviewsCarouselTimer = setInterval(reviewsCarousel, 15000)
})
prevReviewButton.addEventListener('focus', () => {
	nextReviewButtonFocused = false
	prevReviewButtonFocused = true
})

// Изменение вспомогательных переменных при нажатии вне кнопок во время анимации, чтобы фокус не возвращался на кнопки
document.addEventListener('click', e => {
	if (animationIsActive) {
		if (e.target !== nextReviewButton)
			nextReviewButtonFocusedClone = false
		if (e.target !== prevReviewButton)
			prevReviewButtonFocusedClone = false
	}
})

// Изменение вспомогательных переменных при смене фокуса во время анимации, чтобы фокус не возвращался на кнопки
document.addEventListener('focusin', e => {
	if (animationIsActive) {
		if (e.target !== nextReviewButton)
			nextReviewButtonFocusedClone = false
		if (e.target !== prevReviewButton)
			prevReviewButtonFocusedClone = false
	}
})

reviewsButtons.forEach(e => {
	e.addEventListener('click', () => {
		clearInterval(reviewsCarouselTimer)
		reviewsModal.innerHTML = '<img alt="" src="'+ e.dataset.href + '">'
		openModal('reviewsmodal')
	})
})
