const contentPartners = document.querySelectorAll('#contentpartnerslist > p')
const contentPartnersList = document.getElementById('contentpartnerslist')
const guestbookPreviewList = document.getElementById('guestbookpreviewlist')
const guestbookPreviews = document.querySelectorAll('#guestbookpreviewlist > li')
const navs = document.querySelectorAll('nav')
const navToggleButtons = document.querySelectorAll('nav > button')
const subNavToggleButtons = document.querySelectorAll('nav > ul > li > button')
const upButton = document.getElementById('up')

navToggleButtons.forEach(e => {
	e.addEventListener('click', function () {
		const isOpen = this.getAttribute('aria-expanded') === 'false'

		this.setAttribute('aria-expanded', isOpen)
	})
})

subNavToggleButtons.forEach(e => {
	e.addEventListener('click', function () {
		if (this.classList.contains('closesubnav')) {
			this.classList.remove('closesubnav')
			this.blur()
		} else {
			this.classList.add('closesubnav')
		}
	})
})

// Скрытие навигационного меню по клавише Escape
navs.forEach(e => {
	e.addEventListener('keyup', function (e) {
		const navToggleButton = this.querySelector('nav > button')

		if (e.code === 'Escape') {
			navToggleButton.setAttribute('aria-expanded', false)
			navToggleButton.focus()
		}
	})
})

function gbPreviewsSlide() {
	for (let i = 0, next = 1; i < guestbookPreviews.length; i++, next++) {
		if (guestbookPreviews[i].classList.contains('active')) {
			if (next === guestbookPreviews.length) {
				next = 0
			}

			// Подготовка следующего слайда перед использованием анимации
			guestbookPreviews[next].classList.add('active')

			// Анимирование слайда
			guestbookPreviews[i].classList.add('prev')

			// Удаление устаревших настроек предыдущего слайда после завершения анимации
			setTimeout(() => {
				guestbookPreviews[i].classList.remove('active')
				guestbookPreviews[i].classList.remove('prev')
			}, 1000)

			break
		}
	}
}
let guestbookSliderFocused = false,
	guestbookSliderHovered = false,
	guestbookSliderTimer = setInterval(gbPreviewsSlide, 10000)

guestbookPreviewList.onmouseenter = () => {
	guestbookSliderHovered = true
	if (!guestbookSliderFocused) {
		clearInterval(guestbookSliderTimer)
	}
}
guestbookPreviewList.onmouseleave = () => {
	guestbookSliderHovered = false
	if (!guestbookSliderFocused) {
		guestbookSliderTimer = setInterval(gbPreviewsSlide, 10000)
	}
}
guestbookPreviewList.addEventListener('focusin', () => {
	guestbookSliderFocused = true
	if (!guestbookSliderHovered) {
		clearInterval(guestbookSliderTimer)
	}
})
guestbookPreviewList.addEventListener('focusout', () => {
	guestbookSliderFocused = false
	if (!guestbookSliderHovered) {
		guestbookSliderTimer = setInterval(gbPreviewsSlide, 10000)
	}
})

let contentPartnersMinHeight = 0
for (let i = 0; i < contentPartners.length; i++) {
	if (contentPartners[i].offsetHeight > contentPartnersMinHeight)
		contentPartnersMinHeight = contentPartners[i].offsetHeight
}
contentPartnersList.style.minHeight = contentPartnersMinHeight + 'px'

function contentPartnersSlide() {
	for (let i = 0, next = 1; i < contentPartners.length; i++, next++) {
		if (contentPartners[i].classList.contains('active')) {
			if (next === contentPartners.length) {
				next = 0
			}

			// Подготовка следующего слайда перед использованием анимации
			contentPartners[next].classList.add('active')

			// Анимирование слайда
			contentPartners[i].classList.add('prev')

			// Удаление устаревших настроек предыдущего слайда после завершения анимации
			contentPartners[i].addEventListener('transitionend', function hideContentPartner() {
				this.removeEventListener('transitionend', hideContentPartner)
				this.classList.remove('active')
				this.classList.remove('prev')
			})

			break
		}
	}
}
let contentPartnersSliderTimer = setInterval(contentPartnersSlide, 5000)

// Смена слайда на получившего фокус партнёра
for (let cp = 0; cp < contentPartners.length; cp++) {
	contentPartners[cp].addEventListener('focusin', function () {
		clearInterval(contentPartnersSliderTimer)
		contentPartnersSliderTimer = setInterval(contentPartnersSlide, 5000)

		// Подготовка следующего слайда перед использованием анимации
		this.classList.add('active')

		// Обработчик события добавлен на случай возвращения фокуса партнёру, находящемуся в процессе скрытия
		this.addEventListener('transitionend', function showContentPartner() {
			this.removeEventListener('transitionend', showContentPartner)
			this.classList.add('active')
		})

		for (let i = 0; i < contentPartners.length; i++) {
			if (contentPartners[i].classList.contains('active') && i !== cp) {
				// Анимирование слайда
				contentPartners[i].classList.add('prev')

				// Удаление устаревших настроек предыдущего слайда после завершения анимации
				contentPartners[i].addEventListener('transitionend', function hideContentPartner() {
					this.removeEventListener('transitionend', hideContentPartner)
					this.classList.remove('active')
					this.classList.remove('prev')
				})
			}
		}
	})
}

// Отображение/скрытие кнопки прокрутки страницы вверх при прокрутке экрана на высоту видимой области окна
let scrollTicking = false
window.onscroll = () => {
	if (document.documentElement.scrollTop > document.documentElement.clientHeight) {
		if (!scrollTicking) {
			scrollTicking = true
			// Обработчик события добавлен на случай быстрой прокрутки страницы вниз, когда кнопка не завершила процесс своего скрытия при прокрутке страницы вверх
			upButton.addEventListener('transitionend', function showUpButton() {
				this.removeEventListener('transitionend', showUpButton)
				this.classList.remove('hidden')
			})
			upButton.classList.remove('hidden')
			setTimeout(() => {
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

let scrollTop,
	scrollToTopTimer
function scrollToTop() {
	scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop)
	if (scrollTop > 0)
		window.scrollBy(0, -30)
	else
		clearInterval(scrollToTopTimer)
}
upButton.addEventListener('click', () => {
	scrollToTopTimer = setInterval(scrollToTop, 5)
})
