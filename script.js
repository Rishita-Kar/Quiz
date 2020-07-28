const alert = document.querySelector('#alert')
const alertButton = document.querySelector('#alert-button')
const submitButton = document.querySelector("#submit")

alertButton.addEventListener('click', hideAlert)
submitButton.addEventListener("click", checkCompletion)

function showAlert (title, message) {
    alert.querySelector('.alert-header').textContent = title
    alert.querySelector('.alert-body').textContent = message
    alert.classList.add('alert-visible')
    document.body.classList.add('no-scroll')
}

function hideAlert () {
    alert.classList.remove('alert-visible')
    document.body.classList.remove('no-scroll')
}

function showIncompleteAlert () {
    showAlert("WHOOPS!!", "Make sure you fill up all answers before submitting!")
}

function normalizeAnswer (answer) {
    return answer.replace(/[^a-zA-Z]/g, '').toLowerCase()  
}

function checkCompletion() {
    const checkedRadios = document.querySelectorAll("input[type='radio']:checked")
    const checkedCheckboxes = document.querySelectorAll("input[type='checkbox']:checked")
    const checkboxNames = new Set([...checkedCheckboxes].map(checkbox => checkbox.name))
    const inputs = document.querySelectorAll("input[type='text']")
    const filledInputs = [...inputs].filter(input => input.value !== '')

    if (checkedRadios.length < 4) {
        showIncompleteAlert()
        return
    }

    if (checkboxNames.size < 4) {
        showIncompleteAlert()
        return
    }

    if (filledInputs.length < 2) {
        showIncompleteAlert()
        return
    }

    calculateScore()
}

function calculateScore () {
    const radioAnswers = {
        q1: 'a13',
        q2: 'a22',
        q3: 'a34',
        q4: 'a42'
    }

    const checkboxAnswers = {
        q5: ['a51', 'a52', 'a54'],
        q6: ['a62', 'a64'],
        q7: ['a73', 'a74'],
        q8: ['a81', 'a83']
    }

    const inputAnswers = {
        q9: normalizeAnswer('Instinct'),
        q10: normalizeAnswer('Sakasama Yokoshima Happo Fusagari')
    }

    let score = 0

    for (const name in radioAnswers) {
        const answer = radioAnswers[name]
        const selectedAnswer = document.querySelector(`input[name='${name}']:checked`)

        if (selectedAnswer.id === answer) {
            score++
        }
    }

    for (const name in checkboxAnswers) {
        const answers = checkboxAnswers[name]
        const checkboxes = document.querySelectorAll(`input[name='${name}']`)
        let isCorrect = true

        checkboxes.forEach(function (checkbox) {
            if (answers.includes(checkbox.id)) {
                // This checkbox is part of the right answers for this question so it has to be checked
                if (!checkbox.checked) {
                    isCorrect = false
                }
            } else {
                // This checkbox is NOT part of the right answers for this question so it has to be unchecked
                if (checkbox.checked) {
                    isCorrect = false
                }
            }
        })

        if (isCorrect) {
            score++
        }
    }

    for (const name in inputAnswers) {
        const answer = inputAnswers[name]
        const input = document.querySelector(`input[name='${name}']`)

        if (normalizeAnswer(input.value) === answer) {
            score++
        }
    }

    showAlert("Quiz Results", `Your score is ${score}/10.`)
}
