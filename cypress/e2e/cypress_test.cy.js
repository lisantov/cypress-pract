describe('Cypress tests', () => {
    const pages = (data) => ({
        any: {
            home: data.main_url,
            vacancies: data.main_url + '/vacancies',
            needs: data.main_url + '/needs',
            internships: data.main_url + '/internships',
        },
        guest: {
            login: data.main_url + '/login',
            register: data.main_url + '/registration',
        },
        employer: {
            notification: data.main_url + '/notification',
            archive: {
                requests: data.main_url + '/archive/requests',
                needs: data.main_url + '/archive/needs',
                vacancies: data.main_url + '/archive/vacancies',
                internships: data.main_url + '/archive/internships',
            },
            account: {
                home: data.main_url + '/account/main',
                profile: data.main_url + '/account/profile',
                requests: data.main_url + '/account/requests',
                organization: data.main_url + '/account/organization',
                responses: data.main_url + '/account/responses',
                needs: data.main_url + '/account/needs',
                vacancies: data.main_url + '/account/vacancies',
                internships: data.main_url + '/account/internships',
            }
        },
        student: {
            account: {
                responses: data.main_url + '/account/responses',
            }
        }
    })

    const loginEmployer = () =>
        cy.fixture('cypressTests').then(data => {
            cy.log('Переход на страницу входа')
            cy.visit(pages(data).guest.login);

            cy.log('Заполнение формы')
            cy.get('input.form-input--text.form-input[type="text"]')
                .type(data.employer_login)

            cy.get('input.form-input--password.form-input[type="password"]')
                .type(data.password);

            cy.log('Отправка формы')
            cy.get('.login-form__button button[type="submit"]')
                .click()

            cy.wait(1000)
        })

    const loginStudent = () =>
        cy.fixture('cypressTests').then(data => {
            cy.log('Переход на страницу входа')
            cy.visit(pages(data).guest.login);

            cy.log('Заполнение формы')
            cy.get('input.form-input--text.form-input[type="text"]')
                .type(data.student_login)

            cy.get('input.form-input--password.form-input[type="password"]')
                .type(data.password);

            cy.log('Отправка формы')
            cy.get('.login-form__button button[type="submit"]')
                .click()

            cy.wait(1000)
        })

    it('Создание новой стажировки работодателем', () => {
        loginEmployer()
        cy.fixture('cypressTests').then(data => {
            cy.log('Переход на страницу стажировок')
            cy.visit(pages(data).employer.account.internships)

            cy.get('[data-v-e4f6348f=""][data-v-4849dea2=""] > .vacancies-block > .vacancies-block__filters-wrapper > .button')
                .click()

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(1) > .form-control--responsive > .form-input--')
                .type('Сасунг', { force: true })

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(4) > .form-control--responsive > .form-input--date')
                .type('2026-04-23', { force: true })

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(5) > .form-control--responsive > .form-input--date')
                .type('2026-09-22', { force: true })

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(6) > [name="requirements"] > .form-area')
                .type('График 7/0, 20 часов в день')

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(7) > [name="responsibilities"] > .form-area')
                .type('Делать всё')

            cy.get('.vacancy-add-form-wrapper > .form > .form__buttons > .buttons > .button')
                .click({ force: true })

            cy.wait(1000)

            cy.get(':nth-child(1) > .internship-item__info-wrapper > .internship-header > :nth-child(2)')
                .should('exist')
                .should('contain.text', 'Сасунг')

            cy.get(':nth-child(1) > .internship-item__info-wrapper > .internship-item__footer-wrapper > .vacancy-footer > .vacancy-footer__button-wrapper > .button__background-color-green')
                .click()

            cy.wait(1000)

            cy.get(':nth-child(1) > .internship-item__info-wrapper > .internship-item__footer-wrapper > .vacancy-footer > .vacancy-footer__button-wrapper > .button__background-color-green')
                .click()
        })
    })

    it('Просмотр страницы со стажировками (с поиском и фильтром)', () => {
        cy.fixture('cypressTests').then(data => {
            cy.log('Переход на страницу стажировок')
            cy.visit(pages(data).any.internships);

            cy.contains('.internship-header__name', 'Сасунг')
                .should('exist')

            cy.get('.form-input--text.form-input.search-input__field')
                .type('Сасунг')

            cy.get('div.search-input__field > .button')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Сасунг')
                .should('exist')

            cy.get('.radio-list > :nth-child(2)')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Сасунг')
                .should('not.exist')

            cy.get('.radio-list > :nth-child(3)')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Сасунг')
                .should('exist')

            cy.get('.form-select__selected')
                .click()

            cy.contains('.form-select__option', 'Дистант')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Сасунг')
                .should('not.exist')

            cy.get('.form-select__selected')
                .click()

            cy.contains('.form-select__option', 'Очный')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Сасунг')
                .should('exist')

            cy.get('.form-input--text.form-input.search-input__field')
                .clear()
                .type('Сасунгеи')

            cy.get('div.search-input__field > .button')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Сасунг')
                .should('not.exist')
        })
    })

    it('Отклик на стажировку студентом', () => {
        loginStudent()
        cy.fixture('cypressTests').then(data => {
            cy.log('Переход на страницу стажировок')
            cy.visit(pages(data).any.internships);

            cy.get('.form-input--text.form-input.search-input__field')
                .type('Сасунг')

            cy.get('div.search-input__field > .button')
                .click()

            cy.wait(1000)

            cy.get('.internship-item__info-wrapper > .internship-item__footer-wrapper > .vacancy-footer > .vacancy-footer__button-wrapper > .button__background-color-green').first()
                .click()

            cy.contains('.internship-item__info-wrapper > .internship-item__footer-wrapper > .vacancy-footer > .vacancy-footer__button-wrapper > .button', 'Вы уже откликнулись!')
                .should('exist')
        })
    })

    it('Подтверждение отклика работадателем', () => {
        loginEmployer()
        cy.fixture('cypressTests').then(data => {
            cy.visit(pages(data).employer.account.responses);

            cy.get('.responses-list-item__action:nth-child(1)').first()
                .click()

            cy.contains('.button.button__background-color-light-blue.button__size-medium.button__color-white.responses-list-item__button-move', 'Рабочее пространство')
                .should('exist')
        })
    })

    it('Взаимодействие в рабочем пространстве', () => {
        loginEmployer()
        cy.fixture('cypressTests').then(data => {
            cy.visit(pages(data).employer.account.responses);

            cy.contains('.button.button__background-color-light-blue.button__size-medium.button__color-white.responses-list-item__button-move', 'Рабочее пространство')
                .click()

            cy.get('.form-area')
                .type('Ало, бизнесс?')

            cy.get('.comment-textarea__buttons > :nth-child(2)')
                .click()

            cy.contains('.comment-message__text', 'Ало, бизнесс?')
                .should('exist')

            cy.get('.user-avatar-info__button-logout')
                .click()
        })

        loginStudent()
        cy.fixture('cypressTests').then(data => {
            cy.visit(pages(data).student.account.responses);

            cy.contains('.responses-list-item__content-company > .button', 'Рабочее пространство')
                .click()

            cy.contains('.comment-message__text', 'Ало, бизнесс?')
                .should('exist')

            cy.get('.form-area')
                .type('Да-да, деньги')

            cy.get('.comment-textarea__buttons > :nth-child(2)')
                .click()

            cy.contains('.comment-message__text', 'Да-да, деньги')
                .should('exist')
        })
    })

    it('Смена статуса рабочего пространства', () => {
        loginEmployer()
        cy.fixture('cypressTests').then(data => {
            cy.visit(pages(data).employer.account.responses);

            cy.contains('.button.button__background-color-light-blue.button__size-medium.button__color-white.responses-list-item__button-move', 'Рабочее пространство')
                .click()

            cy.get('.status-open__buttons > :nth-child(1)')
                .click()

            cy.contains('.status-close__text', 'Стажировка пройдена')
                .should('exist')
        })
    })
})