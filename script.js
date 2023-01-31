/* АБВ */
const darkSchemeMedia = matchMedia('(prefers-color-scheme: dark)')
const darkStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=dark]')
const lightStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=light]')
const switcherRadios = document.querySelectorAll('#switcher input')

function setupSwitcher() {
	const savedScheme = getSavedScheme()

	if (savedScheme !== null) {
		const currentRadio = document.querySelector(`#switcher input[value=${savedScheme}]`)

		currentRadio.checked = true
	}
	[...switcherRadios].forEach((e) => {
		e.addEventListener('change', (e) => {
			setScheme(e.target.value)
		})
	});
}

function setupScheme() {
	const savedScheme = getSavedScheme()
	const systemScheme = getSystemScheme()

	if (savedScheme === null)
		return
	if (savedScheme !== systemScheme)
		setScheme(savedScheme)
}

function setScheme(scheme) {
	switchMedia(scheme)
	if (scheme === 'auto')
		clearScheme()
	else
		saveScheme(scheme)
}

function switchMedia(scheme) {
	let darkMedia,
		lightMedia

	if (scheme === 'auto') {
		darkMedia = '(prefers-color-scheme: dark)'
		lightMedia = '(prefers-color-scheme: light)'
	} else {
		darkMedia = (scheme === 'dark') ? 'all' : 'not all'
		lightMedia = (scheme === 'light') ? 'all' : 'not all'
	}
	[...darkStyles].forEach((e) => {
		e.media = darkMedia
	});
	[...lightStyles].forEach((e) => {
		e.media = lightMedia
	});
}

function getSystemScheme() {
	const darkScheme = darkSchemeMedia.matches

	return darkScheme ? 'dark' : 'light'
}

function getSavedScheme() {
	return localStorage.getItem('colorscheme')
}

function saveScheme(scheme) {
	localStorage.setItem('colorscheme', scheme)
}

function clearScheme() {
	localStorage.removeItem('colorscheme')
}

setupSwitcher()
setupScheme()
